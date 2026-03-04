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

-- 본인 주문 상태 업데이트 가능
create policy "Users can update own orders"
  on public.orders for update
  using (auth.uid() = user_id);
