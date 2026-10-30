-- ==============================================================================
-- IPM MOTORS SUPABASE DATABASE MIGRATIONS
-- Cocody Riviera Bonoumin, Abidjan - Côte d'Ivoire
-- ==============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Vehicles Table
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand TEXT NOT NULL,
    brand_slug TEXT,
    model TEXT NOT NULL,
    year INTEGER NOT NULL DEFAULT 2025,
    type TEXT NOT NULL CHECK (type IN ('SUV', 'Berline', 'Pick-up', 'Électrique', 'Citadine')),
    fuel TEXT NOT NULL,
    transmission TEXT NOT NULL,
    engine TEXT,
    seats INTEGER DEFAULT 5,
    price NUMERIC,
    price_label TEXT DEFAULT 'Sur demande',
    description TEXT,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_offer BOOLEAN DEFAULT false,
    is_exclusive BOOLEAN DEFAULT false,
    offer_badge TEXT,
    offer_highlights TEXT[] DEFAULT ARRAY[]::TEXT[],
    price_display_mode TEXT DEFAULT 'auto',
    promo_price NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Brands Table
CREATE TABLE IF NOT EXISTS public.brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT,
    logo_url TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    country TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Leads / Contact requests Table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    vehicle_brand TEXT,
    vehicle_model TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. News Articles Table
CREATE TABLE IF NOT EXISTS public.news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Actualités',
    brand_tag TEXT,
    author TEXT DEFAULT 'IPM Motors',
    published_at DATE DEFAULT CURRENT_DATE,
    read_time TEXT DEFAULT '3 min',
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    source TEXT DEFAULT 'Site web',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Row Level Security (RLS)
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Allow public read available vehicles" ON public.vehicles
    FOR SELECT USING (is_available = true);

CREATE POLICY "Allow public read active brands" ON public.brands
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public insert leads" ON public.leads
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read news" ON public.news
    FOR SELECT USING (is_published = true);

CREATE POLICY "Allow public insert newsletter" ON public.newsletter_subscribers
    FOR INSERT WITH CHECK (true);

-- Authenticated Admin Access Policies (Strictement réservé aux administrateurs connectés)
CREATE POLICY "Allow authenticated manage vehicles" ON public.vehicles
    FOR ALL TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated manage brands" ON public.brands
    FOR ALL TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated manage leads" ON public.leads
    FOR ALL TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated manage news" ON public.news
    FOR ALL TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated manage newsletter" ON public.newsletter_subscribers
    FOR ALL TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 8. Storage Buckets (brand-logos, vehicle-images)
-- In Supabase dashboard:
-- Storage > New Bucket > "brand-logos" (Public: true)
-- Storage > New Bucket > "vehicle-images" (Public: true)
