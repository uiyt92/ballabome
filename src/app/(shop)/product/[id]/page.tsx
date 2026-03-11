import ProductPage from '@/components/ProductPage'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function DynamicProductPage({ params }: PageProps) {
  const { id } = await params
  return <ProductPage id={id} />
}
