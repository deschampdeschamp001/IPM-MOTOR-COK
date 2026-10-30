-- ==============================================================================
-- IPM MOTORS - MIGRATION ADDITIVE V2 (SÉCURITÉ & COLONNES ADDITIONNELLES)
-- Cocody Riviera Bonoumin, Abidjan - Côte d'Ivoire
-- ==============================================================================
-- Cette migration est 100% additive et non-destructive.
-- Elle préserve l'intégralité des données existantes.
-- ==============================================================================

-- 1. Ajout des colonnes manquantes sur la table public.vehicles
ALTER TABLE public.vehicles 
    ADD COLUMN IF NOT EXISTS brand_slug TEXT,
    ADD COLUMN IF NOT EXISTS is_exclusive BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS offer_badge TEXT,
    ADD COLUMN IF NOT EXISTS offer_highlights TEXT[] DEFAULT ARRAY[]::TEXT[],
    ADD COLUMN IF NOT EXISTS price_display_mode TEXT DEFAULT 'auto',
    ADD COLUMN IF NOT EXISTS promo_price NUMERIC;

-- Index utile pour les requêtes par marque slug et offres exclusives
CREATE INDEX IF NOT EXISTS idx_vehicles_brand_slug ON public.vehicles (brand_slug);
CREATE INDEX IF NOT EXISTS idx_vehicles_is_exclusive ON public.vehicles (is_exclusive);
CREATE INDEX IF NOT EXISTS idx_vehicles_is_offer ON public.vehicles (is_offer);

-- 2. Mise à jour de la table public.brands (champs optionnels)
ALTER TABLE public.brands 
    ADD COLUMN IF NOT EXISTS slug TEXT,
    ADD COLUMN IF NOT EXISTS logo_url TEXT;

CREATE INDEX IF NOT EXISTS idx_brands_slug ON public.brands (slug);

-- 3. Sécurisation stricte des politiques RLS (Row Level Security)
-- Suppression des anciennes politiques permissives non sécurisées
DROP POLICY IF EXISTS "Allow all actions for admin on vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Allow all actions for admin on brands" ON public.brands;
DROP POLICY IF EXISTS "Allow all actions for admin on leads" ON public.leads;
DROP POLICY IF EXISTS "Allow all actions for admin on news" ON public.news;
DROP POLICY IF EXISTS "Allow all actions for admin on newsletter" ON public.newsletter_subscribers;

DROP POLICY IF EXISTS "Allow public read available vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Allow authenticated manage vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Allow public read active brands" ON public.brands;
DROP POLICY IF EXISTS "Allow authenticated manage brands" ON public.brands;
DROP POLICY IF EXISTS "Allow public insert leads" ON public.leads;
DROP POLICY IF EXISTS "Allow authenticated manage leads" ON public.leads;
DROP POLICY IF EXISTS "Allow public read news" ON public.news;
DROP POLICY IF EXISTS "Allow authenticated manage news" ON public.news;
DROP POLICY IF EXISTS "Allow public insert newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Allow authenticated manage newsletter" ON public.newsletter_subscribers;

-- Activation RLS garantie
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- 3.1. VEHICLES
-- Lecture publique : uniquement véhicules disponibles (ou admin authentifié)
CREATE POLICY "Allow public read available vehicles" ON public.vehicles
    FOR SELECT USING (is_available = true);

-- Gestion complète : uniquement utilisateurs authentifiés (administrateurs)
CREATE POLICY "Allow authenticated manage vehicles" ON public.vehicles
    FOR ALL TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 3.2. BRANDS
CREATE POLICY "Allow public read active brands" ON public.brands
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated manage brands" ON public.brands
    FOR ALL TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 3.3. LEADS (Demandes de contact)
-- Le public peut uniquement soumettre un formulaire de contact (INSERT)
CREATE POLICY "Allow public insert leads" ON public.leads
    FOR INSERT WITH CHECK (true);

-- Seul l'administrateur authentifié peut lire, modifier ou supprimer les leads
CREATE POLICY "Allow authenticated manage leads" ON public.leads
    FOR ALL TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 3.4. NEWS ARTICLES
CREATE POLICY "Allow public read news" ON public.news
    FOR SELECT USING (is_published = true);

CREATE POLICY "Allow authenticated manage news" ON public.news
    FOR ALL TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 3.5. NEWSLETTER SUBSCRIBERS
CREATE POLICY "Allow public insert newsletter" ON public.newsletter_subscribers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated manage newsletter" ON public.newsletter_subscribers
    FOR ALL TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 4. Notification à PostgREST pour recharger le cache du schéma sans redémarrage
NOTIFY pgrst, 'reload schema';
