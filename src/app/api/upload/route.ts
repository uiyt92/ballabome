import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/utils/supabase/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
    // 1. 인증 확인
    const supabaseAuth = await createServerClient()
    const { data: { user } } = await supabaseAuth.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: '인증 필요' }, { status: 401 })
    }

    // service_role로 작업 (RLS 우회)
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const formData = await request.formData()
    const file = formData.get('file') as File
    const bucket = formData.get('bucket') as string
    const path = formData.get('path') as string
    const section = formData.get('section') as string | null
    const key = formData.get('key') as string | null
    const productId = formData.get('productId') as string | null

    if (!file || !bucket || !path) {
        return NextResponse.json({ error: 'file, bucket, path 필수' }, { status: 400 })
    }

    const allowedBuckets = ['public-images', 'review-images', 'product-images']
    if (!allowedBuckets.includes(bucket)) {
        return NextResponse.json({ error: '허용되지 않은 버킷' }, { status: 400 })
    }

    // 2. product-images 버킷은 관리자만 업로드 가능
    if (bucket === 'product-images' || productId) {
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()
        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: '관리자만 업로드 가능' }, { status: 403 })
        }
    }

    // 3. Storage 업로드
    const { error: uploadError } = await supabaseAdmin.storage.from(bucket).upload(path, file, { upsert: true })
    if (uploadError) {
        return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(path)
    const publicUrl = urlData.publicUrl

    // 4. site_content DB 업데이트 (section, key 전달 시)
    if (section && key) {
        const { data: existing } = await supabaseAdmin
            .from('site_content')
            .select('id')
            .eq('section', section)
            .eq('key', key)
            .single()

        if (existing) {
            await supabaseAdmin
                .from('site_content')
                .update({ value_content: publicUrl })
                .eq('id', existing.id)
        } else {
            await supabaseAdmin
                .from('site_content')
                .insert({ section, key, value_type: 'image', value_content: publicUrl })
        }
    }

    // 5. products.images 배열에 push (productId 전달 시)
    if (productId) {
        const { data: product, error: fetchErr } = await supabaseAdmin
            .from('products')
            .select('images')
            .eq('id', productId)
            .single()
        if (fetchErr) {
            return NextResponse.json({ error: `상품 조회 실패: ${fetchErr.message}`, url: publicUrl }, { status: 500 })
        }
        const newImages = [...(product?.images ?? []), publicUrl]
        const { error: updateErr } = await supabaseAdmin
            .from('products')
            .update({ images: newImages })
            .eq('id', productId)
        if (updateErr) {
            return NextResponse.json({ error: `이미지 저장 실패: ${updateErr.message}`, url: publicUrl }, { status: 500 })
        }
        return NextResponse.json({ url: publicUrl, images: newImages })
    }

    return NextResponse.json({ url: publicUrl })
}
