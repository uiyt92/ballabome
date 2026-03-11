-- ============================================
-- BALLABOM Supabase 데이터베이스 스키마
-- Supabase SQL Editor에서 실행해 주세요
-- ============================================

-- 1. profiles 테이블: 회원 추가 정보 (카카오 로그인 후 저장)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  default_address text,
  default_address_detail text,
  default_zipcode text,
  role text default 'user',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- profiles 테이블에 RLS(Row Level Security) 활성화
alter table public.profiles enable row level security;

-- 본인만 자기 프로필을 읽고 수정 가능
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 새 유저가 회원가입(카카오 로그인) 시 자동으로 profiles 행 생성
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- auth.users에 새 행이 들어올 때 trigger 실행
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- 2. orders 테이블: 주문 내역
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  order_id text unique not null,          -- 토스페이먼츠 orderId
  payment_key text,                       -- 토스페이먼츠 paymentKey
  product_name text not null,
  quantity integer default 1,
  total_amount integer not null,          -- 결제 금액 (원)
  status text default 'PENDING',          -- PENDING, PAID, CANCELLED, REFUNDED
  receiver_name text,
  receiver_phone text,
  address text,
  address_detail text,
  zipcode text,
  shipping_request text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- orders 테이블에 RLS 활성화
alter table public.orders enable row level security;

-- 본인만 자기 주문을 조회 가능
create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

-- 로그인한 유저가 주문 생성 가능
create policy "Authenticated users can create orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

-- 본인 주문 상태 업데이트 가능 (일반적으로는 어드민만 가능하게 해야함, 임시 유지)
create policy "Users can update own orders"
  on public.orders for update
  using (auth.uid() = user_id);

-- 어드민은 모든 주문을 조회 및 수정 가능
create policy "Admins can view all orders"
  on public.orders for select
  using ( exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );

create policy "Admins can update all orders"
  on public.orders for update
  using ( exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );

-- ============================================
-- 3. products 테이블
-- ============================================
create table if not exists public.products (
  id             text primary key,           -- slug (예: 'cheonga-ampoule')
  name           text not null,
  description    text,
  price          integer not null,
  original_price integer,
  images         text[] default '{}',        -- 이미지 URL 배열
  is_active      boolean default true,
  rank           integer default 0,          -- 인기순 정렬
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

create table if not exists public.product_options (
  id             serial primary key,
  product_id     text references public.products(id) on delete cascade,
  name           text not null,
  price          integer not null,
  original_price integer,
  tag            text,
  sort_order     integer default 0
);

alter table public.products enable row level security;
alter table public.product_options enable row level security;

create policy "Anyone can view products"
  on public.products for select using (is_active = true);

create policy "Admins can manage products"
  on public.products for all
  using ( exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );

create policy "Anyone can view product_options"
  on public.product_options for select using (true);

create policy "Admins can manage product_options"
  on public.product_options for all
  using ( exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );

-- orders 테이블에 product_id 컬럼 추가
alter table public.orders add column if not exists product_id text references public.products(id) on delete set null;

-- 시드 데이터
insert into public.products (id, name, description, price, original_price, images, rank)
values (
  'cheonga-ampoule',
  '발라봄 청아 앰플',
  '사하라 사막보다 건조한 기내에서 10시간 물광 메이크업을 유지하는 승무원들만의 비밀 공구템',
  34800, 46400,
  ARRAY[
    '/product-hero.png',
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1512290923902-8a9d81aa713c?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=400'
  ],
  1
) on conflict (id) do nothing;

insert into public.product_options (product_id, name, price, original_price, tag, sort_order)
values
  ('cheonga-ampoule', '[BEST 40%할인] 청아 앰플 3+1개 세트', 111200, 185600, '무료배송', 1),
  ('cheonga-ampoule', '[31%할인] 청아 앰플 2개 세트', 63600, 92800, '무료배송', 2),
  ('cheonga-ampoule', '[25%할인] 청아 앰플 단품', 34800, 46400, null, 3)
on conflict do nothing;


-- ============================================
-- 4. wishlists 테이블
-- ============================================
create table if not exists public.wishlists (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references public.profiles(id) on delete cascade,
  product_id text references public.products(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

alter table public.wishlists enable row level security;

create policy "Users can manage own wishlist"
  on public.wishlists for all using (auth.uid() = user_id);


-- ============================================
-- 5. reviews 테이블
-- ============================================
create table if not exists public.reviews (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references public.profiles(id) on delete set null,
  product_id  text references public.products(id) on delete cascade,
  order_id    uuid references public.orders(id) on delete set null,
  rating      integer check (rating between 1 and 5),
  body        text,
  images      text[] default '{}',
  is_verified boolean default false,
  created_at  timestamptz default now()
);

alter table public.reviews enable row level security;

create policy "Anyone can view reviews"
  on public.reviews for select using (true);

create policy "Authenticated users can insert reviews"
  on public.reviews for insert with check (auth.uid() = user_id);

create policy "Users can update own reviews"
  on public.reviews for update using (auth.uid() = user_id);

create policy "Users can delete own reviews"
  on public.reviews for delete using (auth.uid() = user_id);


-- ============================================
-- 6. site_content 테이블: 메인페이지 텍스트 및 이미지 관리 (CMS)
-- ============================================
create table if not exists public.site_content (
  id uuid default gen_random_uuid() primary key,
  section text not null,       -- 예: 'hero', 'about', 'product'
  key text not null,           -- 예: 'title', 'subtitle', 'image_url'
  value_type text default 'text', -- 'text', 'image'
  value_content text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(section, key)
);

-- site_content 보안 설정
alter table public.site_content enable row level security;

-- 누구나 읽기 가능
create policy "Anyone can view site_content"
  on public.site_content for select
  using (true);

-- 어드민만 수정/추가 가능
create policy "Admins can insert site_content"
  on public.site_content for insert
  with check ( exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );

create policy "Admins can update site_content"
  on public.site_content for update
  using ( exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );

