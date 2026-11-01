import React, { useState, useEffect } from 'react';
import {
  Car,
  Users,
  Plus,
  Eye,
  EyeOff,
  Trash2,
  Edit,
  LogOut,
  Upload,
  AlertCircle,
  CheckCircle,
  Phone,
  MessageSquare,
  ArrowLeft,
  X,
  Star,
  Tags,
  Image as ImageIcon,
  Newspaper,
  Calendar,
  Mail,
  Download,
  Sparkles,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Layers,
  ShieldCheck,
  Wrench,
  RotateCcw,
  FileCheck2,
  MoreHorizontal,
} from 'lucide-react';
import { Vehicle, Lead, Brand, VehicleType, NewsArticle, NewsletterSubscriber, ExclusiveBannerConfig } from '../../types';
import { getAllSubscribers } from '../../lib/newsletterStorage';
import { HeroSlide, getHeroSlides, saveHeroSlides, resetHeroSlides } from '../../lib/heroStorage';
import { validatePriceInput, getVehiclePriceInfo, formatCurrencyFCFA } from '../../lib/priceUtils';
import {
  supabase,
  isSupabaseConfigured,
  getAllVehiclesForAdmin,
  saveVehicleToDB,
  deleteVehicleFromDB,
  toggleVehicleVisibility,
  getLeadsFromDB,
  uploadVehicleImage,
  getAllBrandsForAdmin,
  saveBrandToDB,
  deleteBrandFromDB,
  uploadBrandLogo
} from '../../lib/supabase';
import { DEALERSHIP_CONFIG, buildWhatsAppUrl } from '../../config/dealership';
import { FALLBACK_VEHICLES } from '../../data/mockVehicles';
import { DEFAULT_BRANDS, DEFAULT_BRAND_LOGOS } from '../../data/defaultBrands';
import {
  loadAllBrands,
  saveBrandRecord,
  deleteBrandRecord,
  subscribeToBrands,
  resetBrandToDefault,
  getLocalStoredBrands,
} from '../../lib/brandsStorage';
import {
  loadAllNews,
  saveNewsRecord,
  deleteNewsRecord,
  subscribeToNews,
  getLocalStoredNews,
} from '../../lib/newsStorage';
import {
  getExclusiveBannerConfig,
  saveExclusiveBannerConfig,
  resetExclusiveBannerConfig,
  DEFAULT_EXCLUSIVE_BANNER,
  subscribeToExclusiveBanner,
} from '../../lib/bannerStorage';
import {
  getTestimonials,
  saveTestimonials,
  addOrUpdateTestimonial,
  deleteTestimonial,
  resetTestimonialsToDefault,
  subscribeToTestimonials,
  TestimonialItem,
} from '../../lib/testimonialsStorage';
import {
  ServiceSectionItem,
  getServicesSections,
  saveServicesSections,
  resetServicesSections,
  subscribeToServicesSections,
} from '../../config/servicesConfig';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      fill="#25D366"
      d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.59 20.16 12.04 20.16C10.61 20.16 9.21 19.78 7.99 19.06L7.7 18.89L4.58 19.71L5.41 16.67L5.22 16.37C4.43 15.11 4.02 13.53 4.02 11.91C4.02 7.37 7.71 3.67 12.04 3.67ZM8.82 7.42C8.61 7.42 8.41 7.43 8.24 7.46C8.01 7.5 7.68 7.6 7.46 8.09C7.21 8.64 6.54 9.27 6.54 10.53C6.54 11.79 7.46 13.01 7.59 13.18C7.72 13.35 9.38 15.91 11.92 17.01C14.03 17.92 14.46 17.74 14.93 17.7C15.4 17.65 16.44 17.08 16.65 16.49C16.86 15.9 16.86 15.4 16.8 15.29C16.74 15.19 16.57 15.13 16.32 15C16.07 14.88 14.84 14.28 14.61 14.2C14.38 14.12 14.21 14.07 14.04 14.32C13.88 14.57 13.39 15.15 13.24 15.31C13.1 15.48 12.95 15.5 12.7 15.37C12.45 15.25 11.65 14.99 10.7 14.14C9.96 13.48 9.46 12.67 9.32 12.42C9.17 12.17 9.31 12.04 9.43 11.91C9.54 11.8 9.68 11.62 9.81 11.47C9.93 11.33 9.97 11.22 10.05 11.06C10.14 10.89 10.09 10.75 10.03 10.62C9.97 10.5 9.49 9.31 9.28 8.82C9.09 8.34 8.89 8.41 8.74 8.4C8.59 8.4 8.42 8.4 8.24 8.4L8.82 7.42Z"
    />
  </svg>
);

const renderBannerTitle = (title: string, highlight?: string) => {
  if (!highlight || !title.toLowerCase().includes(highlight.toLowerCase())) {
    return <span>{title}</span>;
  }
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = title.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} className="text-[#f6b704] font-extrabold">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

interface AdminDashboardProps {
  onBackToSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToSite }) => {
  const [activeTab, setActiveTab] = useState<'vehicles' | 'brands' | 'news' | 'leads' | 'newsletter' | 'banner' | 'hero' | 'testimonials' | 'services'>('vehicles');
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [isLoadingSubscribers, setIsLoadingSubscribers] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Services & SAV state (Full-Bleed sections: Garantie, Ateliers, Immatriculation)
  const [servicesSections, setServicesSections] = useState<ServiceSectionItem[]>(() => getServicesSections());
  const [editingServiceSection, setEditingServiceSection] = useState<ServiceSectionItem | null>(null);
  const [uploadingServiceImage, setUploadingServiceImage] = useState(false);
  const [isSavingServices, setIsSavingServices] = useState(false);

  // Hero Diaporama slides state
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => getHeroSlides());
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isAddingSlide, setIsAddingSlide] = useState(false);

  // Testimonials state
  const [testimonialsList, setTestimonialsList] = useState<TestimonialItem[]>(() => getTestimonials());
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);
  const [isAddingTestimonial, setIsAddingTestimonial] = useState(false);

  // Exclusive WhatsApp Banner configuration state
  const [bannerConfig, setBannerConfig] = useState<ExclusiveBannerConfig>(() => getExclusiveBannerConfig());
  const [isSavingBanner, setIsSavingBanner] = useState(false);

  // Vehicles state
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('ipm_cached_vehicles') : null;
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return FALLBACK_VEHICLES;
  });
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [vehiclesDataSource, setVehiclesDataSource] = useState<'supabase' | 'cache' | 'local'>('local');
  const [vehiclesLoadError, setVehiclesLoadError] = useState<string | null>(null);

  // Brands state
  const [brands, setBrands] = useState<Brand[]>(() => getLocalStoredBrands());
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);

  // News state
  const [newsList, setNewsList] = useState<NewsArticle[]>(() => getLocalStoredNews());
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Partial<NewsArticle> | null>(null);
  const [isSavingArticle, setIsSavingArticle] = useState(false);
  const [uploadingArticleImage, setUploadingArticleImage] = useState(false);
  const [deleteConfirmArticleId, setDeleteConfirmArticleId] = useState<string | null>(null);
  const [newsTabFilter, setNewsTabFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Leads state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);

  // Vehicle Modal (Add / Edit)
  const [editingVehicle, setEditingVehicle] = useState<Partial<Vehicle> | null>(null);
  const [isSavingVehicle, setIsSavingVehicle] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deleteConfirmVehicleId, setDeleteConfirmVehicleId] = useState<string | null>(null);

  // Brand Modal (Add / Edit)
  const [editingBrand, setEditingBrand] = useState<Partial<Brand> | null>(null);
  const [isSavingBrand, setIsSavingBrand] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [deleteConfirmBrandId, setDeleteConfirmBrandId] = useState<string | null>(null);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Check Supabase session on mount
  useEffect(() => {
    if (isSupabaseConfigured() && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  // Listen for brand changes from any source
  useEffect(() => {
    const unsubscribe = subscribeToBrands((updatedBrands) => {
      setBrands(updatedBrands);
    });
    return unsubscribe;
  }, []);

  // Listen for news updates
  useEffect(() => {
    const unsubscribeNews = subscribeToNews((updatedNews) => {
      setNewsList(updatedNews);
    });
    return unsubscribeNews;
  }, []);

  // Listen for banner updates
  useEffect(() => {
    const unsub = subscribeToExclusiveBanner((cfg) => setBannerConfig(cfg));
    return unsub;
  }, []);

  // Listen for testimonials updates
  useEffect(() => {
    const unsub = subscribeToTestimonials((items) => setTestimonialsList(items));
    return unsub;
  }, []);

  // Listen for services sections updates
  useEffect(() => {
    const unsub = subscribeToServicesSections((items) => setServicesSections(items));
    return unsub;
  }, []);

  // Fetch data when authenticated
  useEffect(() => {
    loadVehicles();
    loadBrands();
    loadNews();
  }, [session]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingBanner(true);
    saveExclusiveBannerConfig(bannerConfig);
    setIsSavingBanner(false);
    showNotification('Bandeau des offres exclusives enregistré avec succès !', 'success');
  };

  const handleResetBanner = () => {
    const def = resetExclusiveBannerConfig();
    setBannerConfig(def);
    showNotification('Bandeau restauré au modèle par défaut.', 'success');
  };

  const loadVehicles = async () => {
    setIsLoadingVehicles(true);
    setVehiclesLoadError(null);
    const saved = typeof window !== 'undefined' ? localStorage.getItem('ipm_cached_vehicles') : null;

    if (!isSupabaseConfigured()) {
      setVehiclesDataSource('local');
      if (saved) {
        try {
          setVehicles(JSON.parse(saved));
        } catch {
          setVehicles(FALLBACK_VEHICLES);
        }
      } else {
        setVehicles(FALLBACK_VEHICLES);
      }
      setIsLoadingVehicles(false);
      return;
    }

    const { data, error } = await getAllVehiclesForAdmin();
    if (error) {
      // Distinction claire : Erreur de connexion / requête Supabase
      setVehiclesLoadError(error.message);
      setVehiclesDataSource('cache');
      showNotification('Connexion Supabase : ' + error.message + ' (Cache local affiché)', 'error');
      if (saved) {
        try {
          setVehicles(JSON.parse(saved));
        } catch {
          setVehicles(FALLBACK_VEHICLES);
        }
      } else {
        setVehicles(FALLBACK_VEHICLES);
      }
    } else {
      // Succès : Même si data est [] (base vide), on respecte l'état réel !
      setVehicles(data || []);
      setVehiclesDataSource('supabase');
      setVehiclesLoadError(null);
      if (typeof window !== 'undefined') {
        localStorage.setItem('ipm_cached_vehicles', JSON.stringify(data || []));
      }
    }
    setIsLoadingVehicles(false);
  };

  const loadBrands = async () => {
    setIsLoadingBrands(true);
    const loaded = await loadAllBrands();
    setBrands(loaded);
    setIsLoadingBrands(false);
  };

  const loadNews = async () => {
    setIsLoadingNews(true);
    const loaded = await loadAllNews();
    setNewsList(loaded);
    setIsLoadingNews(false);
  };

  const loadLeads = async () => {
    setIsLoadingLeads(true);
    if (!isSupabaseConfigured()) {
      setLeads([
        {
          id: 'lead-1',
          name: 'M. Touré Ibrahim',
          phone: '0708091011',
          message: 'Bonjour, je souhaite un devis pro pour un Toyota Land Cruiser LC300 pour livraison à Cocody.',
          created_at: new Date().toISOString(),
          vehicle_brand: 'Toyota',
          vehicle_model: 'Land Cruiser LC300 VXR'
        },
        {
          id: 'lead-2',
          name: 'Cabinet Kouamé & Associés',
          phone: '0501020304',
          message: 'Demande de fiche technique et disponibilité sur la Mercedes Classe S.',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          vehicle_brand: 'Mercedes-Benz',
          vehicle_model: 'Classe S 500'
        }
      ]);
      setIsLoadingLeads(false);
      return;
    }

    const { data, error } = await getLeadsFromDB();
    if (error) {
      showNotification('Impossible de charger les demandes : ' + error.message, 'error');
    } else {
      setLeads(data || []);
    }
    setIsLoadingLeads(false);
  };

  const loadSubscribers = async () => {
    setIsLoadingSubscribers(true);
    const data = await getAllSubscribers();
    setSubscribers(data);
    setIsLoadingSubscribers(false);
  };

  const exportSubscribersCSV = () => {
    if (subscribers.length === 0) {
      showNotification('Aucun abonné à exporter.', 'error');
      return;
    }
    const headers = 'ID,Email,Source,Date_Inscription\n';
    const rows = subscribers
      .map((s) => `"${s.id}","${s.email}","${s.source || 'Site web'}","${s.created_at}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `newsletter-abonnes-ipm-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Export CSV téléchargé avec succès !', 'success');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsAuthLoading(true);

    if (!isSupabaseConfigured() || !supabase) {
      if (authEmail === 'admin@ipmotors.ci' && authPassword === 'admin') {
        setSession({ user: { email: authEmail } });
        setIsAuthLoading(false);
        return;
      }
      setAuthError('Supabase non configuré. Pour tester en mode démo, utilisez : admin@ipmotors.ci / admin');
      setIsAuthLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail.trim(),
        password: authPassword,
      });

      if (error) {
        setAuthError(error.message);
      } else {
        setSession(data.session);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Erreur lors de la connexion');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    if (supabase && isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setSession(null);
  };

  // Vehicles operations
  const handleToggleVisibility = async (vehicle: Vehicle) => {
    const newStatus = !vehicle.is_available;

    if (isSupabaseConfigured()) {
      setIsSavingVehicle(true);
      const { success, error } = await toggleVehicleVisibility(vehicle.id, newStatus);
      setIsSavingVehicle(false);

      if (!success) {
        showNotification('Échec de la mise à jour sur Supabase : ' + (error?.message || ''), 'error');
        return; // Ne pas modifier l'interface si le serveur rejette la modification
      }

      // Mise à jour de l'état local APRÈS confirmation serveur
      const updated = vehicles.map((v) => (v.id === vehicle.id ? { ...v, is_available: newStatus } : v));
      setVehicles(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('ipm_cached_vehicles', JSON.stringify(updated));
      }
      showNotification(newStatus ? 'Véhicule rendu visible sur le catalogue' : 'Véhicule masqué du catalogue');
    } else {
      const updated = vehicles.map((v) => (v.id === vehicle.id ? { ...v, is_available: newStatus } : v));
      setVehicles(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('ipm_cached_vehicles', JSON.stringify(updated));
      }
      showNotification('Statut mis à jour (Mode local démo)');
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (isSupabaseConfigured()) {
      setIsSavingVehicle(true);
      const { success, error } = await deleteVehicleFromDB(id);
      setIsSavingVehicle(false);

      if (!success) {
        showNotification('Échec de la suppression sur Supabase : ' + (error?.message || ''), 'error');
        return; // Ne pas supprimer de l'état local si le serveur rejette
      }

      // Mise à jour de l'état local APRÈS confirmation serveur
      const updated = vehicles.filter((v) => v.id !== id);
      setVehicles(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('ipm_cached_vehicles', JSON.stringify(updated));
      }
      setDeleteConfirmVehicleId(null);
      showNotification('Véhicule supprimé définitivement de la base de données');
    } else {
      const updated = vehicles.filter((v) => v.id !== id);
      setVehicles(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('ipm_cached_vehicles', JSON.stringify(updated));
      }
      setDeleteConfirmVehicleId(null);
      showNotification('Véhicule supprimé (Mode local démo)');
    }
  };

  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle?.brand || !editingVehicle?.model) {
      showNotification('Veuillez renseigner la marque et le modèle', 'error');
      return;
    }

    // 1. Validation stricte du prix numérique (rejette les négatifs, NaN, distingue null de 0)
    const priceVal = validatePriceInput(editingVehicle.price);
    if (!priceVal.valid) {
      showNotification(priceVal.error || 'Montant de prix invalide', 'error');
      return;
    }

    // 2. Validation du prix promotionnel éventuel
    const promoVal = validatePriceInput(editingVehicle.promo_price);
    if (!promoVal.valid) {
      showNotification(promoVal.error || 'Prix promotionnel invalide', 'error');
      return;
    }

    // 3. Libellé commercial indépendant : n'écrase pas automatiquement les libellés personnalisés
    const customPriceLabel =
      editingVehicle.price_label !== undefined && editingVehicle.price_label !== null && editingVehicle.price_label.trim() !== ''
        ? editingVehicle.price_label.trim()
        : priceVal.value !== null && priceVal.value > 0
          ? formatCurrencyFCFA(priceVal.value)
          : 'Sur demande';

    const vehiclePayload: Partial<Vehicle> = {
      ...editingVehicle,
      year: Number(editingVehicle.year) || new Date().getFullYear(),
      type: (editingVehicle.type as VehicleType) || 'SUV',
      fuel: editingVehicle.fuel || 'Essence',
      transmission: editingVehicle.transmission || 'Automatique',
      seats: Number(editingVehicle.seats) || 5,
      is_available: editingVehicle.is_available ?? true,
      is_featured: editingVehicle.is_featured ?? false,
      is_offer: editingVehicle.is_offer ?? false,
      is_exclusive: editingVehicle.is_exclusive ?? false,
      offer_badge: editingVehicle.offer_badge || '',
      offer_highlights: editingVehicle.offer_highlights || [],
      images: editingVehicle.images && editingVehicle.images.length > 0
        ? editingVehicle.images
        : ['/assets/cars/hero_dealership_car_1793116464643.jpg'],
      price: priceVal.value,
      price_label: customPriceLabel,
      price_display_mode: editingVehicle.price_display_mode || 'auto',
      promo_price: promoVal.value,
    };

    setIsSavingVehicle(true);

    if (isSupabaseConfigured()) {
      const { data, error } = await saveVehicleToDB(vehiclePayload);
      setIsSavingVehicle(false);

      if (error) {
        showNotification('Erreur de sauvegarde Supabase : ' + error.message, 'error');
        return; // Ne pas fermer la modal afin de permettre à l'admin de corriger sans perdre sa saisie
      }

      showNotification('Véhicule enregistré avec succès sur la base de données !');
      setEditingVehicle(null);
      await loadVehicles();
    } else {
      let updatedVehicles: Vehicle[];
      if (vehiclePayload.id) {
        updatedVehicles = vehicles.map((v) =>
          v.id === vehiclePayload.id ? ({ ...v, ...vehiclePayload } as Vehicle) : v
        );
      } else {
        const newV = {
          ...vehiclePayload,
          id: 'custom-' + Date.now(),
          created_at: new Date().toISOString(),
        } as Vehicle;
        updatedVehicles = [newV, ...vehicles];
      }
      setVehicles(updatedVehicles);
      if (typeof window !== 'undefined') {
        localStorage.setItem('ipm_cached_vehicles', JSON.stringify(updatedVehicles));
      }
      setIsSavingVehicle(false);
      showNotification('Véhicule enregistré avec succès (Mode local démo) !');
      setEditingVehicle(null);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (isSupabaseConfigured()) {
        const { url, error } = await uploadVehicleImage(file);
        if (url) {
          uploadedUrls.push(url);
        } else if (error) {
          showNotification('Erreur de téléversement : ' + error.message, 'error');
        }
      } else {
        const localUrl = URL.createObjectURL(file);
        uploadedUrls.push(localUrl);
      }
    }

    if (uploadedUrls.length > 0) {
      setEditingVehicle((prev) => ({
        ...prev,
        images: [...(prev?.images || []), ...uploadedUrls],
      }));
      showNotification(`${uploadedUrls.length} image(s) ajoutée(s)`);
    }
    setUploadingImage(false);
  };

  // Brands operations
  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBrand?.name?.trim()) {
      showNotification('Veuillez renseigner le nom de la marque', 'error');
      return;
    }

    setIsSavingBrand(true);
    const brandPayload: Partial<Brand> = {
      ...editingBrand,
      name: editingBrand.name.trim(),
      logo_url: editingBrand.logo_url?.trim() || '',
      sort_order: Number(editingBrand.sort_order) || brands.length + 1,
      is_active: editingBrand.is_active ?? true,
    };

    const result = await saveBrandRecord(brandPayload);
    if (result.success) {
      showNotification(`Marque "${result.brand.name}" enregistrée avec succès !`);
      setEditingBrand(null);
      loadBrands();
    } else {
      showNotification(`Erreur sauvegarde marque : ${result.error || 'Erreur'}`, 'error');
    }
    setIsSavingBrand(false);
  };

  const handleDeleteBrand = async (id: string) => {
    await deleteBrandRecord(id);
    setDeleteConfirmBrandId(null);
    showNotification('Marque supprimée');
    loadBrands();
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);

    // 1. Immediately read as Base64 Data URL for instant rendering, localStorage persistence & zero broken links
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Url = reader.result as string;
      setEditingBrand((prev) => ({ ...prev, logo_url: base64Url }));

      // 2. If Supabase is configured, also attempt to upload to storage bucket
      if (isSupabaseConfigured()) {
        try {
          const { url, error } = await uploadBrandLogo(file);
          if (url) {
            setEditingBrand((prev) => ({ ...prev, logo_url: url }));
            showNotification('Logo téléversé vers le bucket brand-logos !');
          } else if (error) {
            showNotification('Logo conservé en haute qualité locale (Supabase : ' + error.message + ')', 'success');
          }
        } catch {
          // Base64 is kept
        } finally {
          setUploadingLogo(false);
        }
      } else {
        showNotification('Nouveau logo chargé avec succès !');
        setUploadingLogo(false);
      }
    };

    reader.onerror = () => {
      showNotification('Erreur de lecture du fichier image', 'error');
      setUploadingLogo(false);
    };

    reader.readAsDataURL(file);
  };

  // News operations
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle?.title?.trim()) {
      showNotification("Veuillez renseigner le titre de l'actualité", 'error');
      return;
    }

    setIsSavingArticle(true);
    const result = await saveNewsRecord({
      ...editingArticle,
      title: editingArticle.title.trim(),
      category: editingArticle.category || 'Nouveautés 0 km',
      published_at: editingArticle.published_at || new Date().toISOString().split('T')[0],
      is_published: editingArticle.is_published ?? true,
      is_featured: editingArticle.is_featured ?? false,
      read_time: editingArticle.read_time || '3 min',
      author: editingArticle.author || 'Équipe IPM Motors',
    });

    if (result.success) {
      showNotification(`Actualité "${result.article.title}" enregistrée avec succès !`);
      setEditingArticle(null);
      loadNews();
    } else {
      showNotification(`Erreur d'enregistrement : ${result.error}`, 'error');
    }
    setIsSavingArticle(false);
  };

  const handleDeleteArticle = async (id: string) => {
    await deleteNewsRecord(id);
    setDeleteConfirmArticleId(null);
    showNotification('Actualité supprimée');
    loadNews();
  };

  const handleToggleArticleVisibility = async (article: NewsArticle) => {
    const nextState = !article.is_published;
    const res = await saveNewsRecord({
      ...article,
      is_published: nextState,
    });
    if (res.success) {
      showNotification(
        nextState
          ? `Article "${article.title}" affiché sur le site`
          : `Article "${article.title}" masqué du site`
      );
      loadNews();
    } else {
      showNotification(`Erreur : ${res.error}`, 'error');
    }
  };

  const handleToggleArticleFeatured = async (article: NewsArticle) => {
    const nextFeatured = !article.is_featured;
    const res = await saveNewsRecord({
      ...article,
      is_featured: nextFeatured,
    });
    if (res.success) {
      showNotification(
        nextFeatured
          ? `Article "${article.title}" mis à la une`
          : `Article "${article.title}" retiré de la une`
      );
      loadNews();
    } else {
      showNotification(`Erreur : ${res.error}`, 'error');
    }
  };

  const handleArticleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingArticleImage(true);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Url = reader.result as string;
      setEditingArticle((prev) => ({ ...prev, cover_image: base64Url }));

      if (isSupabaseConfigured()) {
        try {
          const { url, error } = await uploadVehicleImage(file);
          if (url) {
            setEditingArticle((prev) => ({ ...prev, cover_image: url }));
            showNotification('Image téléversée avec succès !');
          } else if (error) {
            showNotification('Image enregistrée en haute définition locale', 'success');
          }
        } catch {
          // Keep base64
        } finally {
          setUploadingArticleImage(false);
        }
      } else {
        showNotification('Image enregistrée avec succès');
        setUploadingArticleImage(false);
      }
    };

    reader.onerror = () => {
      showNotification('Impossible de lire le fichier image sélectionné', 'error');
      setUploadingArticleImage(false);
    };

    reader.readAsDataURL(file);
  };

  const handleLoadDefaultCatalogue = async () => {
    setIsLoadingVehicles(true);
    try {
      if (isSupabaseConfigured()) {
        showNotification('Synchronisation des exemples prédéfinis du catalogue avec Supabase...', 'success');
        let count = 0;
        for (const v of FALLBACK_VEHICLES) {
          const { error } = await saveVehicleToDB(v);
          if (!error) count++;
        }
        await loadVehicles();
        showNotification(`Catalogue chargé avec succès (${count} véhicules synchronisés sur Supabase) !`);
      } else {
        setVehicles(FALLBACK_VEHICLES);
        if (typeof window !== 'undefined') {
          localStorage.setItem('ipm_cached_vehicles', JSON.stringify(FALLBACK_VEHICLES));
        }
        showNotification(`Catalogue chargé avec succès (${FALLBACK_VEHICLES.length} véhicules préremplis) !`);
      }
    } catch (err: any) {
      showNotification('Erreur de chargement des exemples : ' + (err?.message || ''), 'error');
    } finally {
      setIsLoadingVehicles(false);
    }
  };

  const handleSaveServiceSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingServiceSection) return;
    setIsSavingServices(true);
    const updated = servicesSections.map((s) =>
      s.id === editingServiceSection.id ? editingServiceSection : s
    );
    setServicesSections(updated);
    saveServicesSections(updated);
    setIsSavingServices(false);
    setEditingServiceSection(null);
    showNotification('Section Service Après-Vente enregistrée avec succès !');
  };

  const handleResetServices = () => {
    const defaults = resetServicesSections();
    setServicesSections(defaults);
    setEditingServiceSection(null);
    showNotification('Sections Services & SAV réinitialisées aux valeurs d’origine.');
  };

  const handleServiceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingServiceSection) return;
    setUploadingServiceImage(true);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Url = reader.result as string;
      setEditingServiceSection((prev) => (prev ? { ...prev, image: base64Url } : null));

      if (isSupabaseConfigured()) {
        try {
          const { url, error } = await uploadVehicleImage(file);
          if (url) {
            setEditingServiceSection((prev) => (prev ? { ...prev, image: url } : null));
            showNotification('Image téléversée avec succès sur Supabase !');
          } else if (error) {
            showNotification('Image conservée en haute qualité locale', 'success');
          }
        } catch {
          // Keep base64
        } finally {
          setUploadingServiceImage(false);
        }
      } else {
        showNotification('Nouvelle image chargée avec succès !');
        setUploadingServiceImage(false);
      }
    };
    reader.onerror = () => {
      showNotification('Impossible de lire le fichier image sélectionné', 'error');
      setUploadingServiceImage(false);
    };
    reader.readAsDataURL(file);
  };

  // 1. Login View
  if (!session) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md bg-[#141414] border border-[#2A2A2A] rounded-xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <img
              src="/assets/aistudio/image_150e736b.png"
              alt="IPM Motors"
              className="h-12 w-auto mx-auto object-contain"
            />
            <h1 className="text-xl font-bold tracking-tight text-white">
              Espace Administration IPM Motors
            </h1>
            <p className="text-xs text-[#8A8A8A]">
              Gestion du catalogue, marques partenaires & demandes clients
            </p>
          </div>

          {!isSupabaseConfigured() && (
            <div className="p-3 bg-[#1A1A1A] border border-[#333333] rounded-lg text-xs text-[#AAAAAA] space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-[#E10600]">
                <AlertCircle className="w-4 h-4" />
                <span>Base Supabase en attente de clés</span>
              </div>
              <p>Pour tester l'interface en mode prévisualisation :</p>
              <div className="font-mono text-[11px] text-white bg-black/60 p-1.5 rounded">
                admin@ipmotors.ci / admin
              </div>
            </div>
          )}

          {authError && (
            <div className="p-3 bg-red-950/60 border border-red-800 rounded-lg text-xs text-red-200">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1.5">
                E-mail administrateur
              </label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="admin@ipmotors.ci"
                className="w-full px-3.5 py-2.5 text-sm bg-[#0A0A0A] border border-[#2A2A2A] rounded-md text-white focus:outline-none focus:border-[#E10600]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1.5">
                Mot de passe
              </label>
              <input
                type="password"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-sm bg-[#0A0A0A] border border-[#2A2A2A] rounded-md text-white focus:outline-none focus:border-[#E10600]"
              />
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full py-3 bg-[#E10600] hover:bg-[#B00500] disabled:bg-[#E10600]/50 text-white text-xs font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer"
            >
              {isAuthLoading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          <div className="pt-4 border-t border-[#2A2A2A] text-center">
            <button
              onClick={onBackToSite}
              className="inline-flex items-center gap-1.5 text-xs text-[#8A8A8A] hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retourner au site public</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Admin Dashboard with 3 Tabs: Vehicles, Brands, Leads
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      {/* Top Header */}
      <header className="bg-[#141414] border-b border-[#2A2A2A] px-4 sm:px-8 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToSite}
              className="p-2 text-[#8A8A8A] hover:text-white hover:bg-white/5 rounded-md transition-colors"
              title="Voir le site en direct"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/image_150e736b.png"
                alt="Logo IPM"
                className="h-8 w-auto object-contain"
              />
              <div>
                <span className="text-base font-bold text-white tracking-tight">IPM MOTORS</span>
                <span className="ml-2 px-2 py-0.5 text-[10px] uppercase font-bold bg-[#E10600] text-white rounded">
                  Admin
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-xs text-[#8A8A8A]">
              Connecté : <span className="text-white font-medium">{session?.user?.email || 'admin@ipmotors.ci'}</span>
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#8A8A8A] hover:text-white hover:bg-white/5 rounded transition-colors cursor-pointer border border-[#2A2A2A]"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-lg shadow-2xl flex items-center gap-3 text-xs font-semibold animate-in fade-in duration-200 border bg-[#141414] border-[#E10600] text-white">
          {notification.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-[#E10600]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-500" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex-1 space-y-6">
        {/* Navigation Tabs Desktop (xl+) et Mobile/Tablette (5 boutons exactement) */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between border-b border-[#2A2A2A] pb-4 gap-4">
          {/* Version Desktop (Toutes les options visibles) */}
          <div className="hidden xl:flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('vehicles')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                activeTab === 'vehicles'
                  ? 'bg-[#E10600] text-white'
                  : 'text-[#8A8A8A] hover:text-white hover:bg-[#141414]'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Catalogue ({vehicles.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('brands')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                activeTab === 'brands'
                  ? 'bg-[#E10600] text-white'
                  : 'text-[#8A8A8A] hover:text-white hover:bg-[#141414]'
              }`}
            >
              <Tags className="w-4 h-4" />
              <span>Marques ({brands.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('news');
                loadNews();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                activeTab === 'news'
                  ? 'bg-[#E10600] text-white'
                  : 'text-[#8A8A8A] hover:text-white hover:bg-[#141414]'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>Actualités ({newsList.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('leads');
                loadLeads();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                activeTab === 'leads'
                  ? 'bg-[#E10600] text-white'
                  : 'text-[#8A8A8A] hover:text-white hover:bg-[#141414]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Demandes ({leads.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('newsletter');
                loadSubscribers();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                activeTab === 'newsletter'
                  ? 'bg-[#E10600] text-white'
                  : 'text-[#8A8A8A] hover:text-white hover:bg-[#141414]'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Newsletter ({subscribers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('banner')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                activeTab === 'banner'
                  ? 'bg-[#032b17] text-[#f6b704] border border-[#f6b704]/40 shadow-sm'
                  : 'text-[#8A8A8A] hover:text-white hover:bg-[#141414]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#f6b704]" />
              <span>Bandeau Exclusif WhatsApp</span>
            </button>

            <button
              onClick={() => setActiveTab('hero')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                activeTab === 'hero'
                  ? 'bg-[#E10600] text-white shadow-sm'
                  : 'text-[#8A8A8A] hover:text-white hover:bg-[#141414]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Diaporama Hero ({heroSlides.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('testimonials')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                activeTab === 'testimonials'
                  ? 'bg-[#E10600] text-white shadow-sm'
                  : 'text-[#8A8A8A] hover:text-white hover:bg-[#141414]'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Témoignages ({testimonialsList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                activeTab === 'services'
                  ? 'bg-[#E10600] text-white shadow-sm'
                  : 'text-[#8A8A8A] hover:text-white hover:bg-[#141414]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Services & SAV ({servicesSections.length})</span>
            </button>
          </div>

          {/* Barre de navigation mobile pour l'Admin (< xl) : Barre de navigation fluide contenant toutes les options */}
          <div className="xl:hidden w-full sticky top-[68px] z-20 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-2 px-2 bg-[#141414]/95 backdrop-blur-md border border-[#2A2A2A] rounded-2xl shadow-lg">
              {/* 1. Catalogue */}
              <button
                type="button"
                onClick={() => setActiveTab('vehicles')}
                className={`shrink-0 px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'vehicles' ? 'bg-[#E10600] text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-[#1E1E1E]'
                }`}
              >
                <Car className="w-4 h-4 shrink-0" />
                <span>Catalogue ({vehicles.length})</span>
              </button>

              {/* 2. Marques */}
              <button
                type="button"
                onClick={() => setActiveTab('brands')}
                className={`shrink-0 px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'brands' ? 'bg-[#E10600] text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-[#1E1E1E]'
                }`}
              >
                <Tags className="w-4 h-4 shrink-0" />
                <span>Marques ({brands.length})</span>
              </button>

              {/* 3. Actualités */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('news');
                  loadNews();
                }}
                className={`shrink-0 px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'news' ? 'bg-[#E10600] text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-[#1E1E1E]'
                }`}
              >
                <Newspaper className="w-4 h-4 shrink-0" />
                <span>Actualités ({newsList.length})</span>
              </button>

              {/* 4. Demandes */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('leads');
                  loadLeads();
                }}
                className={`shrink-0 px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'leads' ? 'bg-[#E10600] text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-[#1E1E1E]'
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>Demandes ({leads.length})</span>
              </button>

              {/* 5. Newsletter */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('newsletter');
                  loadSubscribers();
                }}
                className={`shrink-0 px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'newsletter' ? 'bg-[#E10600] text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-[#1E1E1E]'
                }`}
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span>Newsletter ({subscribers.length})</span>
              </button>

              {/* 6. Diaporama Hero */}
              <button
                type="button"
                onClick={() => setActiveTab('hero')}
                className={`shrink-0 px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'hero' ? 'bg-[#E10600] text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-[#1E1E1E]'
                }`}
              >
                <Layers className="w-4 h-4 shrink-0" />
                <span>Hero ({heroSlides.length})</span>
              </button>

              {/* 7. Témoignages */}
              <button
                type="button"
                onClick={() => setActiveTab('testimonials')}
                className={`shrink-0 px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'testimonials' ? 'bg-[#E10600] text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-[#1E1E1E]'
                }`}
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>Avis ({testimonialsList.length})</span>
              </button>

              {/* 8. Services & SAV */}
              <button
                type="button"
                onClick={() => setActiveTab('services')}
                className={`shrink-0 px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'services' ? 'bg-[#E10600] text-white shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-[#1E1E1E]'
                }`}
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Services ({servicesSections.length})</span>
              </button>

              {/* 9. Bandeau WhatsApp */}
              <button
                type="button"
                onClick={() => setActiveTab('banner')}
                className={`shrink-0 px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'banner' ? 'bg-[#032b17] text-[#f6b704] border border-[#f6b704]/40 shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-[#1E1E1E]'
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0 text-[#f6b704]" />
                <span>Bandeau WA</span>
              </button>
            </div>
          </div>

          {activeTab === 'testimonials' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const defaults = resetTestimonialsToDefault();
                  setTestimonialsList(defaults);
                  showNotification('Témoignages restaurés par défaut');
                }}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#222222] hover:bg-[#333333] text-zinc-300 text-xs font-semibold rounded-md border border-[#333333] cursor-pointer"
              >
                <span>Restaurer par défaut</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingTestimonial({
                    id: 'test-' + Date.now(),
                    name: '',
                    date: 'Récemment',
                    comment: '',
                    image: '/public/assets/aistudio/814493891_122239370216113743_2889832111464126919_n_8772dda4.jpg',
                    rating: 5,
                    avatarText: 'CL',
                  });
                  setIsAddingTestimonial(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#E10600] hover:bg-[#B00500] text-white text-xs uppercase tracking-wider font-bold rounded-md transition-colors cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau Témoignage</span>
              </button>
            </div>
          )}

          {activeTab === 'hero' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const defaults = resetHeroSlides();
                  setHeroSlides(defaults);
                  showNotification('Diaporama réinitialisé');
                }}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#222222] hover:bg-[#333333] text-zinc-300 text-xs font-semibold rounded-md border border-[#333333] cursor-pointer"
              >
                <span>Restaurer par défaut</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingSlide({
                    id: 'slide-' + Date.now(),
                    image: '/public/assets/aistudio/814493891_122239370216113743_2889832111464126919_n_8772dda4.jpg',
                    badge: 'Nouveau Véhicule 0 KM • Abidjan',
                    title: 'Titre de votre slide',
                    highlight: 'en vedette.',
                    subtitle: 'Description de présentation de vos modèles neufs 0 km.',
                    link: '/modeles'
                  });
                  setIsAddingSlide(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#E10600] hover:bg-[#B00500] text-white text-xs uppercase tracking-wider font-bold rounded-md transition-colors cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau Slide Hero</span>
              </button>
            </div>
          )}

          {activeTab === 'newsletter' && (
            <button
              onClick={exportSubscribersCSV}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#222222] hover:bg-[#333333] text-white text-xs uppercase tracking-wider font-bold rounded-md transition-colors cursor-pointer border border-[#333333]"
            >
              <Download className="w-4 h-4 text-[#E10600]" />
              <span>Exporter en CSV</span>
            </button>
          )}

          {activeTab === 'vehicles' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLoadDefaultCatalogue}
                disabled={isLoadingVehicles}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#222222] hover:bg-[#333333] text-zinc-200 text-xs font-semibold rounded-md transition-colors cursor-pointer border border-[#333333]"
                title="Importer et préremplir les modèles d'exemples du catalogue (BYD, BMW, Jetour, Toyota, etc.)"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Charger les exemples prédéfinis</span>
              </button>

              <button
                onClick={() =>
                  setEditingVehicle({
                    brand: 'Toyota',
                    model: '',
                    year: new Date().getFullYear(),
                    type: 'SUV',
                    fuel: 'Essence',
                    transmission: 'Automatique',
                    seats: 5,
                    price: null,
                    price_label: 'Sur demande',
                    is_available: true,
                    is_featured: false,
                    is_offer: false,
                    is_exclusive: false,
                    offer_badge: '',
                    offer_highlights: [],
                    images: [],
                    description: '',
                  })
                }
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#E10600] hover:bg-[#B00500] text-white text-xs uppercase tracking-wider font-bold rounded-md transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un véhicule</span>
              </button>
            </div>
          )}

          {activeTab === 'services' && (
            <button
              type="button"
              onClick={handleResetServices}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#222222] hover:bg-[#333333] text-zinc-300 text-xs font-semibold rounded-md border border-[#333333] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurer par défaut</span>
            </button>
          )}

          {activeTab === 'brands' && (
            <button
              onClick={() =>
                setEditingBrand({
                  name: '',
                  sort_order: brands.length + 1,
                  is_active: true,
                  logo_url: '',
                })
              }
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#E10600] hover:bg-[#B00500] text-white text-xs uppercase tracking-wider font-bold rounded-md transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter une marque</span>
            </button>
          )}

          {activeTab === 'news' && (
            <button
              onClick={() =>
                setEditingArticle({
                  title: '',
                  category: 'Nouveautés 0 km',
                  excerpt: '',
                  content: '',
                  cover_image: '',
                  author: 'Équipe IPM Motors',
                  published_at: new Date().toISOString().split('T')[0],
                  read_time: '3 min',
                  is_featured: false,
                  is_published: true,
                })
              }
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#E10600] hover:bg-[#B00500] text-white text-xs uppercase tracking-wider font-bold rounded-md transition-colors cursor-pointer shadow-lg shadow-[#E10600]/25"
            >
              <Plus className="w-4 h-4" />
              <span>Nouvelle actualité</span>
            </button>
          )}
        </div>

        {/* Tab 1: Vehicles List */}
        {activeTab === 'vehicles' && (
          <div className="space-y-4">
            {/* Barre d'état de la source de données (Supabase / Cache / Local) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-[#141416] border border-[#2A2A2E]">
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    vehiclesDataSource === 'supabase'
                      ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]'
                      : vehiclesDataSource === 'cache'
                        ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]'
                        : 'bg-zinc-500'
                  }`}
                />
                <span className="text-xs font-semibold text-white">
                  Source :{' '}
                  {vehiclesDataSource === 'supabase' && 'Supabase Connecté (Données en direct)'}
                  {vehiclesDataSource === 'cache' && 'Cache Local (Supabase non joignable)'}
                  {vehiclesDataSource === 'local' && 'Mode Local Démo'}
                </span>
                {vehiclesLoadError && (
                  <span className="text-[11px] text-amber-400 font-mono">({vehiclesLoadError})</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={loadVehicles}
                  disabled={isLoadingVehicles}
                  className="px-3 py-1 rounded bg-[#222226] hover:bg-[#2C2C32] text-xs text-zinc-300 font-medium transition-colors cursor-pointer border border-[#333339]"
                >
                  {isLoadingVehicles ? 'Chargement...' : 'Actualiser'}
                </button>
              </div>
            </div>

            {isLoadingVehicles ? (
              <div className="p-12 text-center text-[#8A8A8A]">Chargement des véhicules...</div>
            ) : vehicles.length === 0 ? (
              <div className="p-12 text-center bg-[#141414] rounded-lg border border-[#2A2A2A] space-y-3">
                <p className="text-sm text-[#8A8A8A]">Aucun véhicule dans la base de données distante.</p>
                <button
                  type="button"
                  onClick={handleLoadDefaultCatalogue}
                  disabled={isLoadingVehicles}
                  className="px-4 py-2 bg-[#E10600] hover:bg-[#b00500] text-xs text-white rounded font-medium shadow-md transition-colors cursor-pointer"
                >
                  Charger les exemples prédéfinis du catalogue
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((v) => (
                  <div
                    key={v.id}
                    className={`bg-[#141414] rounded-lg border overflow-hidden flex flex-col justify-between transition-colors ${
                      v.is_available ? 'border-[#2A2A2A]' : 'border-red-900/40 opacity-70'
                    }`}
                  >
                    <div>
                      <div className="relative aspect-[16/10] bg-[#0A0A0A]">
                        <img
                          src={v.images?.[0] || '/src/assets/images/hero_dealership_car_1793116464643.jpg'}
                          alt={v.model}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-[#E10600] text-white rounded">
                            Neuf 0 km
                          </span>
                          {v.is_exclusive && (
                            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-[#f6b704] text-zinc-950 rounded flex items-center gap-1 shadow">
                              <Sparkles className="w-3 h-3" />
                              VIP Exclusif
                            </span>
                          )}
                          {v.is_offer && !v.is_exclusive && (
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-red-900 text-red-100 rounded">
                              Offre
                            </span>
                          )}
                          {v.is_featured && (
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-amber-500 text-black rounded flex items-center gap-1">
                              <Star className="w-3 h-3 fill-black" />
                              Vedette
                            </span>
                          )}
                        </div>
                        <div className="absolute top-2 right-2">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                              v.is_available ? 'bg-emerald-950 text-emerald-400 border border-emerald-700' : 'bg-red-950 text-red-400 border border-red-800'
                            }`}
                          >
                            {v.is_available ? 'Affiché' : 'Masqué'}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="text-xs text-[#E10600] font-bold uppercase tracking-wider">
                          {v.brand} · {v.type}
                        </div>
                        <h3 className="text-lg font-bold text-white leading-tight">
                          {v.model} ({v.year})
                        </h3>
                        <p className="text-xs text-[#8A8A8A]">
                          {v.fuel} · {v.transmission}
                        </p>
                        <div className="text-sm font-bold text-white tabular-nums pt-1">
                          {v.price ? `${new Intl.NumberFormat('fr-FR').format(v.price)} FCFA` : v.price_label || 'Sur demande'}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-[#0A0A0A] border-t border-[#2A2A2A] flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleToggleVisibility(v)}
                        className="p-2 text-[#8A8A8A] hover:text-white hover:bg-white/5 rounded transition-colors"
                        title={v.is_available ? 'Masquer du site public' : 'Rendre visible sur le site'}
                      >
                        {v.is_available ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-red-400" />}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingVehicle(v)}
                          className="px-3 py-1.5 bg-[#222222] hover:bg-[#333333] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Modifier</span>
                        </button>
                        <button
                          onClick={() => setDeleteConfirmVehicleId(v.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded transition-colors"
                          title="Supprimer définitivement"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Brands Management (PARTIE 1) */}
        {activeTab === 'brands' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Marques partenaires & logos</h2>
                <p className="text-xs text-[#8A8A8A]">
                  Gestion de la table Supabase <code className="text-white">brands</code> et logos stockés dans le bucket <code className="text-white">brand-logos</code>.
                </p>
              </div>
              <button
                onClick={loadBrands}
                className="text-xs text-[#E10600] hover:underline"
              >
                Actualiser
              </button>
            </div>

            {isLoadingBrands ? (
              <div className="p-12 text-center text-[#8A8A8A]">Chargement des marques...</div>
            ) : brands.length === 0 ? (
              <div className="p-12 text-center bg-[#141414] rounded-lg border border-[#2A2A2A]">
                <p className="text-sm text-[#8A8A8A]">Aucune marque enregistrée.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {brands.map((brand) => (
                  <div
                    key={brand.id}
                    className={`bg-[#141414] rounded-xl border p-4 flex flex-col justify-between transition-colors ${
                      brand.is_active ? 'border-[#2A2A2A]' : 'border-red-900/40 opacity-60'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Logo Preview Tile */}
                      <div className="w-full aspect-square bg-white rounded-lg p-2 flex items-center justify-center border border-neutral-200">
                        {brand.logo_url || DEFAULT_BRAND_LOGOS[brand.name] ? (
                          <img
                            key={brand.logo_url || brand.name}
                            src={brand.logo_url || DEFAULT_BRAND_LOGOS[brand.name]}
                            alt={`Logo ${brand.name}`}
                            className="max-h-10 max-w-[85%] object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <span className="text-xs font-bold text-neutral-800 uppercase">{brand.name}</span>
                        )}
                      </div>

                      <div className="text-center">
                        <h4 className="text-sm font-bold text-white">{brand.name}</h4>
                        <div className="flex items-center justify-center gap-2 text-[11px] text-[#8A8A8A] mt-1">
                          <span>Ordre : {brand.sort_order}</span>
                          <span>·</span>
                          <span className={brand.is_active ? 'text-emerald-400' : 'text-red-400'}>
                            {brand.is_active ? 'Actif' : 'Inactif'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#2A2A2A] flex items-center justify-between">
                      <button
                        onClick={() => setEditingBrand(brand)}
                        className="text-xs text-[#8A8A8A] hover:text-white flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Modifier</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirmBrandId(brand.id)}
                        className="text-xs text-red-400 hover:text-red-300 p-1"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: News Management */}
        {activeTab === 'news' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Actualités & Événements</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                    {newsList.length}
                  </span>
                </h2>
                <p className="text-xs text-[#8A8A8A]">
                  Activez ou masquez les actualités qui apparaissent sur la page d'accueil et la page Actualités.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    setEditingArticle({
                      title: '',
                      slug: '',
                      category: 'Nouveautés 0 km',
                      excerpt: '',
                      content: '',
                      cover_image: '/assets/cars/hero_dealership_car_1793116464643.jpg',
                      published_at: new Date().toISOString().split('T')[0],
                      is_published: true,
                      is_featured: false,
                      read_time: '3 min',
                      author: 'Équipe IPM Motors',
                    })
                  }
                  className="px-3.5 py-2 bg-[#E10600] hover:bg-[#b00500] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Rédiger un article</span>
                </button>
                <button
                  onClick={loadNews}
                  className="text-xs text-[#8A8A8A] hover:text-white px-2 py-1 rounded transition-colors cursor-pointer"
                >
                  Actualiser
                </button>
              </div>
            </div>

            {/* Filtres d'affichage des actualités (Toutes / Publiées / Masquées) */}
            <div className="flex items-center gap-2 border-b border-[#2A2A2A] pb-3 text-xs">
              <button
                type="button"
                onClick={() => setNewsTabFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  newsTabFilter === 'all'
                    ? 'bg-zinc-800 text-white'
                    : 'text-[#8A8A8A] hover:text-white'
                }`}
              >
                Toutes ({newsList.length})
              </button>
              <button
                type="button"
                onClick={() => setNewsTabFilter('published')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  newsTabFilter === 'published'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'text-[#8A8A8A] hover:text-white'
                }`}
              >
                Visibles sur le site ({newsList.filter((n) => n.is_published).length})
              </button>
              <button
                type="button"
                onClick={() => setNewsTabFilter('draft')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  newsTabFilter === 'draft'
                    ? 'bg-red-950 text-red-400 border border-red-800'
                    : 'text-[#8A8A8A] hover:text-white'
                }`}
              >
                Masquées / Brouillons ({newsList.filter((n) => !n.is_published).length})
              </button>
            </div>

            {isLoadingNews ? (
              <div className="p-12 text-center text-[#8A8A8A]">Chargement des actualités...</div>
            ) : newsList.length === 0 ? (
              <div className="p-12 text-center bg-[#141414] rounded-lg border border-[#2A2A2A]">
                <p className="text-sm text-[#8A8A8A]">Aucun article d'actualité pour le moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {newsList
                  .filter((article) => {
                    if (newsTabFilter === 'published') return article.is_published;
                    if (newsTabFilter === 'draft') return !article.is_published;
                    return true;
                  })
                  .map((article) => (
                  <div
                    key={article.id}
                    className={`bg-[#141414] rounded-xl border flex flex-col justify-between overflow-hidden transition-all ${
                      article.is_published ? 'border-[#2A2A2A]' : 'border-red-900/60 opacity-75'
                    }`}
                  >
                    <div>
                      {/* Cover Thumbnail */}
                      <div className="relative aspect-[16/9] w-full bg-black overflow-hidden">
                        <img
                          src={article.cover_image}
                          alt={article.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/src/assets/images/hero_dealership_car_1793116464643.jpg';
                          }}
                        />
                        <div className="absolute top-2 left-2 flex items-center gap-1.5">
                          <span className="text-[10px] uppercase tracking-wider font-bold text-white bg-black/85 px-2 py-0.5 rounded backdrop-blur-sm">
                            {article.category}
                          </span>
                          {article.is_featured && (
                            <span className="text-[10px] uppercase font-bold text-white bg-[#E10600] px-2 py-0.5 rounded shadow flex items-center gap-1">
                              <Star className="w-3 h-3 fill-white" />
                              À la une
                            </span>
                          )}
                        </div>

                        {/* Statut d'affichage sur le site */}
                        <div className="absolute top-2 right-2">
                          <button
                            type="button"
                            onClick={() => handleToggleArticleVisibility(article)}
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-full border cursor-pointer transition-all ${
                              article.is_published
                                ? 'bg-emerald-950/90 text-emerald-400 border-emerald-700 hover:bg-emerald-900'
                                : 'bg-red-950/90 text-red-400 border-red-800 hover:bg-red-900'
                            }`}
                            title="Cliquer pour basculer la visibilité sur le site public"
                          >
                            {article.is_published ? '● Visible sur le site' : '○ Masqué du site'}
                          </button>
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-[#8A8A8A]">
                          <span>{article.published_at}</span>
                          <span className="text-[10px] font-mono text-zinc-500">
                            {article.read_time || '3 min'}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white line-clamp-2 leading-snug">
                          {article.title}
                        </h4>
                        <p className="text-xs text-[#8A8A8A] line-clamp-2 leading-relaxed">
                          {article.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-[#0A0A0A] border-t border-[#2A2A2A] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        {/* Toggle Visibilité */}
                        <button
                          type="button"
                          onClick={() => handleToggleArticleVisibility(article)}
                          className={`p-1.5 rounded transition-colors cursor-pointer ${
                            article.is_published
                              ? 'text-emerald-400 hover:bg-emerald-950/50'
                              : 'text-zinc-500 hover:text-white hover:bg-white/5'
                          }`}
                          title={article.is_published ? 'Masquer du site public' : 'Rendre visible sur le site'}
                        >
                          {article.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-red-400" />}
                        </button>

                        {/* Toggle À la une */}
                        <button
                          type="button"
                          onClick={() => handleToggleArticleFeatured(article)}
                          className={`p-1.5 rounded transition-colors cursor-pointer ${
                            article.is_featured
                              ? 'text-amber-400 hover:bg-amber-950/50'
                              : 'text-zinc-600 hover:text-amber-400 hover:bg-white/5'
                          }`}
                          title={article.is_featured ? 'Retirer de la une' : 'Mettre en avant à la une'}
                        >
                          <Star className={`w-4 h-4 ${article.is_featured ? 'fill-amber-400' : ''}`} />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingArticle(article)}
                          className="px-2.5 py-1.5 bg-[#222222] hover:bg-[#333333] text-white text-xs font-semibold rounded flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Modifier</span>
                        </button>

                        <button
                          onClick={() => setDeleteConfirmArticleId(article.id)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded transition-colors cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Leads List */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Demandes de contact reçues</h2>
              <button
                onClick={loadLeads}
                className="text-xs text-[#E10600] hover:underline"
              >
                Actualiser la liste
              </button>
            </div>

            {isLoadingLeads ? (
              <div className="p-12 text-center text-[#8A8A8A]">Chargement des demandes...</div>
            ) : leads.length === 0 ? (
              <div className="p-12 text-center bg-[#141414] rounded-lg border border-[#2A2A2A]">
                <p className="text-sm text-[#8A8A8A]">Aucune demande pour le moment.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {leads.map((lead) => {
                  const replyMsg = `Bonjour ${lead.name}, nous avons bien reçu votre demande concernant nos véhicules neufs chez IPM Motors Cocody Riviera. Comment pouvons-nous vous aider ?`;
                  const replyUrl = buildWhatsAppUrl(replyMsg, lead.phone.replace(/[^0-9]/g, ''));

                  return (
                    <div
                      key={lead.id}
                      className="bg-[#141414] border border-[#2A2A2A] rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h4 className="text-base font-bold text-white">{lead.name}</h4>
                          <span className="text-xs text-[#8A8A8A] tabular-nums">
                            {lead.created_at ? new Date(lead.created_at).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : ''}
                          </span>
                        </div>
                        <p className="text-xs text-[#E10600] font-semibold">
                          Tél : <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                        </p>
                        <p className="text-sm text-[#CCCCCC] bg-[#0A0A0A] p-2.5 rounded border border-[#2A2A2A] mt-2">
                          "{lead.message}"
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={`tel:${lead.phone}`}
                          className="px-3.5 py-2 bg-[#222222] hover:bg-[#333333] text-white text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#E10600]" />
                          <span>Appeler</span>
                        </a>
                        <a
                          href={replyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-[#E10600] hover:bg-[#B00500] text-white text-xs font-bold uppercase tracking-wider rounded-md flex items-center gap-1.5 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Répondre WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Newsletter Subscribers List */}
        {activeTab === 'newsletter' && (
          <div className="space-y-4">
            {isLoadingSubscribers ? (
              <div className="p-12 text-center text-[#8A8A8A]">Chargement des abonnés...</div>
            ) : subscribers.length === 0 ? (
              <div className="p-12 text-center bg-[#141414] rounded-lg border border-[#2A2A2A]">
                <Mail className="w-8 h-8 text-[#E10600] mx-auto mb-2 opacity-60" />
                <p className="text-sm text-[#8A8A8A]">Aucun abonné enregistré pour le moment.</p>
              </div>
            ) : (
              <div className="bg-[#141414] rounded-xl border border-[#2A2A2A] overflow-hidden">
                <div className="p-4 border-b border-[#2A2A2A] flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold">
                    Liste des adresses e-mail ({subscribers.length})
                  </span>
                  <button
                    onClick={exportSubscribersCSV}
                    className="inline-flex items-center gap-1.5 text-xs text-[#E10600] font-semibold hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Télécharger CSV</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0E0E11] text-[#8A8A8A] uppercase font-mono border-b border-[#2A2A2A]">
                      <tr>
                        <th className="p-3.5">E-mail</th>
                        <th className="p-3.5">Source</th>
                        <th className="p-3.5">Date d'inscription</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A2A2A]">
                      {subscribers.map((sub) => (
                        <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3.5 font-medium text-white">{sub.email}</td>
                          <td className="p-3.5 text-[#8A8A8A]">{sub.source || 'Site web'}</td>
                          <td className="p-3.5 text-[#8A8A8A] font-mono">
                            {new Date(sub.created_at).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 6: Exclusive WhatsApp Banner Configuration */}
        {activeTab === 'banner' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#f6b704]" />
                  <span>Configuration du Bandeau Offres Exclusives (WhatsApp)</span>
                </h2>
                <p className="text-xs text-[#8A8A8A] mt-1">
                  Personnalisez en temps réel les textes, les mots mis en valeur, le nom du bouton et le lien de redirection WhatsApp de la section sur la page « Nos Offres ».
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetBanner}
                  className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#252525] text-neutral-300 text-xs font-semibold rounded-md border border-[#333333] transition-colors cursor-pointer"
                >
                  Restaurer modèle par défaut
                </button>
              </div>
            </div>

            {/* Live Interactive Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#8A8A8A]">
                  Aperçu en direct (rendu fidèle à la maquette)
                </span>
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${
                    bannerConfig.enabled
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      : 'bg-red-950 text-red-400 border-red-800'
                  }`}
                >
                  {bannerConfig.enabled ? '● Actif sur le site' : '○ Désactivé / Masqué'}
                </span>
              </div>

              <div className="rounded-2xl sm:rounded-3xl bg-[#032b17] border border-[#064223] p-7 sm:p-9 lg:p-11 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-32 -right-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#f6b704]/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8">
                  <div className="max-w-3xl">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                      {renderBannerTitle(
                        bannerConfig.title || 'Découvrez des offres exclusives !!',
                        bannerConfig.highlightText || 'exclusives'
                      )}
                    </h3>
                    <p className="mt-3 text-xs sm:text-sm lg:text-base text-emerald-100/90 font-light leading-relaxed max-w-2xl">
                      {bannerConfig.subtitle ||
                        'Restez à jour avec les dernières nouvelles, mises à jour et exclusivités offres directement sur votre WhatsApp.'}
                    </p>
                  </div>

                  <a
                    href={bannerConfig.buttonUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!bannerConfig.buttonUrl) e.preventDefault();
                    }}
                    className="shrink-0 inline-flex items-center gap-2.5 px-6 sm:px-7 py-3.5 bg-white text-zinc-950 font-bold text-xs sm:text-sm uppercase tracking-wider rounded-full shadow-lg hover:scale-105 transition-transform"
                  >
                    <WhatsAppIcon className="w-5 h-5 shrink-0" />
                    <span>{bannerConfig.buttonText || 'REJOINDRE LA CHAÎNE'}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Editing Form */}
            <form onSubmit={handleSaveBanner} className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1.5">
                    Titre principal du bandeau *
                  </label>
                  <input
                    type="text"
                    required
                    value={bannerConfig.title}
                    onChange={(e) => setBannerConfig({ ...bannerConfig, title: e.target.value })}
                    placeholder="Ex: Découvrez des offres exclusives !!"
                    className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E10600]"
                  />
                  <p className="text-[11px] text-[#8A8A8A] mt-1">
                    Texte affiché en grand sur le bandeau.
                  </p>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1.5">
                    Mot-clé mis en valeur en jaune doré
                  </label>
                  <input
                    type="text"
                    value={bannerConfig.highlightText || ''}
                    onChange={(e) => setBannerConfig({ ...bannerConfig, highlightText: e.target.value })}
                    placeholder="Ex: exclusives"
                    className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-sm text-[#f6b704] font-bold focus:outline-none focus:border-[#f6b704]"
                  />
                  <p className="text-[11px] text-[#8A8A8A] mt-1">
                    Ce mot apparaîtra en jaune <span className="text-[#f6b704] font-bold">#f6b704</span> dans le titre.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1.5">
                  Sous-titre explicatif *
                </label>
                <textarea
                  rows={3}
                  required
                  value={bannerConfig.subtitle}
                  onChange={(e) => setBannerConfig({ ...bannerConfig, subtitle: e.target.value })}
                  placeholder="Ex: Restez à jour avec les dernières nouvelles, mises à jour et exclusivités offres directement sur votre WhatsApp."
                  className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E10600]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-[#222222]">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1.5">
                    Nom / Libellé du bouton *
                  </label>
                  <input
                    type="text"
                    required
                    value={bannerConfig.buttonText}
                    onChange={(e) => setBannerConfig({ ...bannerConfig, buttonText: e.target.value })}
                    placeholder="Ex: REJOINDRE LA CHAÎNE"
                    className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E10600] font-semibold uppercase"
                  />
                  <p className="text-[11px] text-[#8A8A8A] mt-1">
                    Texte inscrit à droite de l'icône WhatsApp.
                  </p>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1.5">
                    Lien de redirection du bouton (URL) *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      value={bannerConfig.buttonUrl}
                      onChange={(e) => setBannerConfig({ ...bannerConfig, buttonUrl: e.target.value })}
                      placeholder="https://whatsapp.com/channel/... ou https://wa.me/..."
                      className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#E10600]"
                    />
                    {bannerConfig.buttonUrl && (
                      <a
                        href={bannerConfig.buttonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Tester le lien dans un nouvel onglet"
                        className="p-2.5 bg-[#222222] hover:bg-[#333333] text-white rounded-lg border border-[#333333] transition-colors cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4 text-emerald-400" />
                      </a>
                    )}
                  </div>
                  <p className="text-[11px] text-[#8A8A8A] mt-1">
                    Redirige instantanément vers ce lien lors du clic.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#222222] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <label className="flex items-center gap-2.5 text-xs text-white cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={bannerConfig.enabled}
                    onChange={(e) => setBannerConfig({ ...bannerConfig, enabled: e.target.checked })}
                    className="w-4 h-4 text-[#E10600] rounded focus:ring-0"
                  />
                  <span>Activer et afficher cette section sur la page Nos Offres</span>
                </label>

                <button
                  type="submit"
                  disabled={isSavingBanner}
                  className="px-6 py-2.5 bg-[#E10600] hover:bg-[#B00500] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-lg shadow-[#E10600]/25"
                >
                  {isSavingBanner ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 7: Hero Slides Management */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#E10600]" />
                  <span>Gestion du Diaporama Principal (Hero)</span>
                </h2>
                <p className="text-xs text-[#8A8A8A] mt-1">
                  Ajoutez, personnalisez et réorganisez en direct les images, titres souverains, mots en vedette et boutons de la section d'accueil.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const defaults = resetHeroSlides();
                    setHeroSlides(defaults);
                    showNotification('Diaporama réinitialisé avec succès');
                  }}
                  className="px-3.5 py-2 bg-[#1A1A1A] hover:bg-[#252525] text-zinc-300 text-xs font-semibold rounded-md border border-[#333333] transition-colors cursor-pointer"
                >
                  Restaurer par défaut
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingSlide({
                      id: 'slide-' + Date.now(),
                      image: '/public/assets/aistudio/814493891_122239370216113743_2889832111464126919_n_8772dda4.jpg',
                      badge: 'Nouveau Véhicule 0 KM • Abidjan',
                      title: 'L’Élégance Automobile',
                      highlight: 'sur-mesure.',
                      subtitle: 'Découvrez notre collection de prestige prête pour livraison immédiate.',
                      link: '/modeles',
                    });
                    setIsAddingSlide(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#E10600] hover:bg-[#B00500] text-white text-xs uppercase tracking-wider font-bold rounded-md transition-colors cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un slide</span>
                </button>
              </div>
            </div>

            {/* Liste des slides du Hero sous forme de cartes ordonnées */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {heroSlides.map((slideItem, index) => (
                <div
                  key={slideItem.id}
                  className="bg-[#141414] border border-[#2A2A2A] rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl hover:border-zinc-700 transition-colors"
                >
                  {/* Visuel du slide avec le texte en superposition comme sur le site */}
                  <div className="relative aspect-[16/9] bg-zinc-950 overflow-hidden">
                    <img
                      src={slideItem.image}
                      alt={slideItem.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/public/assets/aistudio/814493891_122239370216113743_2889832111464126919_n_8772dda4.jpg';
                      }}
                    />
                    {/* Dégradés semi-transparents superposés */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/25" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-white/10" />

                    {/* Badge ordre #1, #2 */}
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E10600] text-white shadow-sm">
                        Slide #{index + 1}
                      </span>
                      {slideItem.badge && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-black/70 backdrop-blur-xs text-white border border-white/20">
                          {slideItem.badge}
                        </span>
                      )}
                    </div>

                    {/* Aperçu textuel */}
                    <div className="absolute bottom-4 left-4 right-4 z-10">
                      <h4 className="font-heading font-bold text-lg sm:text-xl text-white leading-tight">
                        {slideItem.title}{' '}
                        <span className="text-[#E10600] font-extrabold">{slideItem.highlight}</span>
                      </h4>
                      <p className="text-xs text-zinc-300 font-light mt-1 line-clamp-2">
                        {slideItem.subtitle}
                      </p>
                      <span className="inline-block mt-2 text-[10px] font-mono text-zinc-400 bg-black/60 px-2 py-0.5 rounded">
                        Lien: {slideItem.link}
                      </span>
                    </div>
                  </div>

                  {/* Barre d'actions du slide */}
                  <div className="p-3.5 bg-[#0e0e11] border-t border-[#2A2A2A] flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => {
                          const targetIndex = index - 1;
                          if (targetIndex < 0) return;
                          const copy = [...heroSlides];
                          const temp = copy[index];
                          copy[index] = copy[targetIndex];
                          copy[targetIndex] = temp;
                          setHeroSlides(copy);
                          saveHeroSlides(copy);
                        }}
                        title="Monter"
                        className="p-1.5 rounded bg-[#1c1c1f] hover:bg-[#2a2a2f] text-zinc-300 disabled:opacity-30 disabled:hover:bg-[#1c1c1f] cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === heroSlides.length - 1}
                        onClick={() => {
                          const targetIndex = index + 1;
                          if (targetIndex >= heroSlides.length) return;
                          const copy = [...heroSlides];
                          const temp = copy[index];
                          copy[index] = copy[targetIndex];
                          copy[targetIndex] = temp;
                          setHeroSlides(copy);
                          saveHeroSlides(copy);
                        }}
                        title="Descendre"
                        className="p-1.5 rounded bg-[#1c1c1f] hover:bg-[#2a2a2f] text-zinc-300 disabled:opacity-30 disabled:hover:bg-[#1c1c1f] cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSlide({ ...slideItem });
                          setIsAddingSlide(false);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#222222] hover:bg-[#333333] text-white text-xs font-semibold cursor-pointer border border-[#333333]"
                      >
                        <Edit className="w-3 h-3 text-blue-400" />
                        <span>Modifier</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (heroSlides.length <= 1) {
                            showNotification('Il doit rester au moins un slide actif', 'error');
                            return;
                          }
                          const updated = heroSlides.filter((s) => s.id !== slideItem.id);
                          setHeroSlides(updated);
                          saveHeroSlides(updated);
                          showNotification('Slide supprimé');
                        }}
                        className="p-1.5 rounded bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 cursor-pointer"
                        title="Supprimer ce slide"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 8: Testimonials Manager */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>Gestion des Avis & Témoignages Clients</span>
                </h3>
                <p className="text-xs text-[#8A8A8A] mt-1">
                  Personnalisez la section « Clients heureux, nous aussi ! » de la page d'accueil : photos des clients, avis, notations et dates.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingTestimonial({
                    id: 'test-' + Date.now(),
                    name: '',
                    date: 'Récemment',
                    comment: '',
                    image: '/public/assets/aistudio/814493891_122239370216113743_2889832111464126919_n_8772dda4.jpg',
                    avatarText: 'CL',
                    rating: 5,
                  });
                  setIsAddingTestimonial(true);
                }}
                className="px-4 py-2 bg-[#E10600] hover:bg-[#B00500] text-white text-xs uppercase tracking-wider font-bold rounded-md transition-colors cursor-pointer shadow-md flex items-center gap-2 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un avis</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {testimonialsList.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#141414] border border-[#2A2A2A] rounded-2xl overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-colors shadow-lg"
                >
                  <div>
                    {/* Photo du client */}
                    <div className="relative aspect-[16/10] bg-black overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/public/assets/aistudio/814493891_122239370216113743_2889832111464126919_n_8772dda4.jpg';
                        }}
                      />
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{item.rating || 5}.0</span>
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-heading font-bold text-white text-base">
                          {item.name}
                        </h4>
                        <span className="text-[11px] text-[#8A8A8A] font-mono">
                          {item.date}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 font-light leading-relaxed line-clamp-3">
                        « {item.comment} »
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-[#0e0e11] border-t border-[#2A2A2A] flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTestimonial({ ...item });
                        setIsAddingTestimonial(false);
                      }}
                      className="px-3 py-1.5 rounded bg-[#222222] hover:bg-[#333333] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer border border-[#333333]"
                    >
                      <Edit className="w-3 h-3 text-blue-400" />
                      <span>Modifier</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (testimonialsList.length <= 1) {
                          showNotification('Il doit rester au moins un avis client', 'error');
                          return;
                        }
                        deleteTestimonial(item.id);
                        setTestimonialsList((prev) => prev.filter((t) => t.id !== item.id));
                        showNotification('Témoignage supprimé avec succès');
                      }}
                      className="p-1.5 rounded bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 cursor-pointer"
                      title="Supprimer ce témoignage"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 8: Services & SAV Configuration (Full-Bleed sections: Garantie, Ateliers, Immatriculation) */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#E10600]" />
                  <span>Sections Service Après-Vente & Garanties (Full-Bleed)</span>
                </h2>
                <p className="text-xs text-[#8A8A8A] mt-1 max-w-2xl">
                  Modifiez directement les textes, puces d'engagement et images des 3 sections majeures de la page Services : Garantie Constructeur Officielle, Ateliers Certifiés & Pièces OEM, et Immatriculation & Clés en Main (Représentation Côte d'Ivoire).
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetServices}
                  className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#252525] text-neutral-300 text-xs font-semibold rounded-md border border-[#333333] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurer par défaut</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {servicesSections.map((sec, idx) => (
                <div
                  key={sec.id}
                  className="bg-[#141414] border border-[#2A2A2A] rounded-xl overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-all shadow-md group"
                >
                  <div>
                    {/* Visual image thumbnail */}
                    <div className="relative aspect-[16/10] bg-black overflow-hidden">
                      <img
                        src={sec.image}
                        alt={sec.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = '/public/assets/aistudio/814493891_122239370216113743_2889832111464126919_n_8772dda4.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-black/85 text-white backdrop-blur-xs border border-white/10">
                          {sec.badge || `Engagement 0${idx + 1}`}
                        </span>
                      </div>
                      <div className="absolute bottom-2.5 left-3 right-3 text-white">
                        <span className="text-[10px] uppercase font-bold text-white/80 block">
                          {sec.locationBadge || 'Abidjan'}
                        </span>
                        <p className="text-xs font-semibold text-white truncate">
                          {sec.caption || sec.title}
                        </p>
                      </div>
                    </div>

                    {/* Content details */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="font-heading font-bold text-base text-white leading-snug">
                          {sec.title}
                        </h3>
                        <p className="text-xs text-[#8A8A8A] mt-1.5 line-clamp-3 leading-relaxed">
                          {sec.subtitle}
                        </p>
                      </div>

                      {/* Points list preview */}
                      <div className="pt-2 border-t border-[#222222] space-y-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold block">
                          Puces d'engagements ({sec.points.length}) :
                        </span>
                        <ul className="space-y-1">
                          {sec.points.slice(0, 3).map((pt, pIdx) => (
                            <li key={pIdx} className="text-xs text-zinc-300 flex items-start gap-1.5 truncate">
                              <span className="text-[#E10600] font-bold shrink-0">•</span>
                              <span className="truncate">{pt}</span>
                            </li>
                          ))}
                          {sec.points.length > 3 && (
                            <li className="text-[10px] text-zinc-500 font-mono">
                              +{sec.points.length - 3} autre(s) puce(s)...
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Action bar */}
                  <div className="p-4 bg-[#0A0A0A] border-t border-[#2A2A2A] flex items-center justify-between">
                    <span className="text-[11px] text-zinc-500 font-mono">
                      ID: {sec.id}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingServiceSection({ ...sec, points: [...sec.points] })}
                      className="px-3.5 py-1.5 bg-[#222222] hover:bg-[#333333] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5 text-[#E10600]" />
                      <span>Modifier les textes & l'image</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Delete Vehicle Confirmation Modal */}
      {deleteConfirmVehicleId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Confirmer la suppression ?</h3>
            <p className="text-sm text-[#8A8A8A]">
              Cette action retirera définitivement ce véhicule du catalogue. Êtes-vous sûr de vouloir continuer ?
            </p>
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                onClick={() => setDeleteConfirmVehicleId(null)}
                className="px-4 py-2 bg-[#222222] text-white text-xs rounded font-medium hover:bg-[#333333]"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeleteVehicle(deleteConfirmVehicleId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded font-bold uppercase tracking-wider"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Brand Confirmation Modal */}
      {deleteConfirmBrandId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Supprimer cette marque ?</h3>
            <p className="text-sm text-[#8A8A8A]">
              Cette marque ne s'affichera plus dans la grille du site. Confirmez-vous la suppression ?
            </p>
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                onClick={() => setDeleteConfirmBrandId(null)}
                className="px-4 py-2 bg-[#222222] text-white text-xs rounded font-medium hover:bg-[#333333]"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeleteBrand(deleteConfirmBrandId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded font-bold uppercase tracking-wider"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Article Confirmation Modal */}
      {deleteConfirmArticleId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Supprimer cette actualité ?</h3>
            <p className="text-sm text-[#8A8A8A]">
              Cette action retirera définitivement cet article du site web. Êtes-vous sûr de vouloir continuer ?
            </p>
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                onClick={() => setDeleteConfirmArticleId(null)}
                className="px-4 py-2 bg-[#222222] text-white text-xs rounded font-medium hover:bg-[#333333] cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeleteArticle(deleteConfirmArticleId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded font-bold uppercase tracking-wider cursor-pointer"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Article Modal */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2A]">
              <h2 className="text-lg font-bold text-white">
                {editingArticle.id ? "Modifier l'actualité" : 'Nouvelle actualité 0 km'}
              </h2>
              <button onClick={() => setEditingArticle(null)} className="text-[#8A8A8A] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                  Titre de l'article *
                </label>
                <input
                  type="text"
                  required
                  value={editingArticle.title || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  placeholder="Ex: Arrivage exclusif : Nouvelle flotte Land Cruiser 0 km"
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-sm text-white focus:outline-none focus:border-[#E10600]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                    Catégorie
                  </label>
                  <select
                    value={editingArticle.category || 'Nouveautés 0 km'}
                    onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-sm text-white focus:outline-none focus:border-[#E10600]"
                  >
                    <option value="Nouveautés 0 km">Nouveautés 0 km</option>
                    <option value="Offres Spéciales">Offres Spéciales</option>
                    <option value="Électrique & Hybride">Électrique & Hybride</option>
                    <option value="Tout-Terrain">Tout-Terrain & Prestige</option>
                    <option value="Événement IPM">Événement IPM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                    Date de publication
                  </label>
                  <input
                    type="date"
                    value={editingArticle.published_at || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setEditingArticle({ ...editingArticle, published_at: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-sm text-white focus:outline-none focus:border-[#E10600]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                    Auteur
                  </label>
                  <input
                    type="text"
                    value={editingArticle.author || 'Équipe IPM Motors'}
                    onChange={(e) => setEditingArticle({ ...editingArticle, author: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-sm text-white focus:outline-none focus:border-[#E10600]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                    Temps de lecture estimé
                  </label>
                  <input
                    type="text"
                    value={editingArticle.read_time || '3 min'}
                    onChange={(e) => setEditingArticle({ ...editingArticle, read_time: e.target.value })}
                    placeholder="Ex: 3 min"
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-sm text-white focus:outline-none focus:border-[#E10600]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                  Résumé / Accroche (affiché sur la vignette) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingArticle.excerpt || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                  placeholder="Court résumé percutant pour attirer l'attention du client..."
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-sm text-white focus:outline-none focus:border-[#E10600]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                  Contenu détaillé de l'article *
                </label>
                <textarea
                  rows={5}
                  required
                  value={editingArticle.content || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                  placeholder="Texte complet de l'actualité, caractéristiques des véhicules, conditions de l'offre..."
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-sm text-white focus:outline-none focus:border-[#E10600]"
                />
              </div>

              {/* Cover Image */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold">
                  Image de couverture de l'actualité
                </label>

                <input
                  type="text"
                  value={editingArticle.cover_image || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, cover_image: e.target.value })}
                  placeholder="URL d'image (https://...) ou téléversez ci-dessous"
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white focus:outline-none focus:border-[#E10600] font-mono"
                />

                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 px-3 py-2 bg-[#222222] hover:bg-[#333333] text-white text-xs font-semibold rounded cursor-pointer transition-colors border border-[#333333]">
                    <Upload className="w-3.5 h-3.5 text-[#E10600]" />
                    <span>{uploadingArticleImage ? 'Téléversement...' : 'Téléverser une image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleArticleImageUpload}
                      className="hidden"
                      disabled={uploadingArticleImage}
                    />
                  </label>
                </div>

                {editingArticle.cover_image && (
                  <div className="relative aspect-[16/9] max-h-40 rounded-lg overflow-hidden border border-[#333333] bg-black">
                    <img
                      src={editingArticle.cover_image}
                      alt="Aperçu couverture"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingArticle.is_published ?? true}
                    onChange={(e) => setEditingArticle({ ...editingArticle, is_published: e.target.checked })}
                    className="w-4 h-4 text-[#E10600] rounded focus:ring-0"
                  />
                  <span>Publier immédiatement (visible sur le site)</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingArticle.is_featured ?? false}
                    onChange={(e) => setEditingArticle({ ...editingArticle, is_featured: e.target.checked })}
                    className="w-4 h-4 text-[#E10600] rounded focus:ring-0"
                  />
                  <span>Mettre à la une (Grand format accueil)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2A2A2A]">
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="px-4 py-2 bg-[#222222] hover:bg-[#333333] text-white text-xs rounded font-medium cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSavingArticle}
                  className="px-6 py-2 bg-[#E10600] hover:bg-[#B00500] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
                >
                  {isSavingArticle ? 'Enregistrement...' : "Enregistrer l'actualité"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Brand Modal */}
      {editingBrand && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl max-w-md w-full p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2A]">
              <h2 className="text-lg font-bold text-white">
                {editingBrand.id ? 'Modifier la marque' : 'Ajouter une marque'}
              </h2>
              <button onClick={() => setEditingBrand(null)} className="text-[#8A8A8A] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBrand} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                  Nom de la marque *
                </label>
                <input
                  type="text"
                  required
                  value={editingBrand.name || ''}
                  onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
                  placeholder="Ex: BYD, Toyota, Jetour..."
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-sm text-white focus:outline-none focus:border-[#E10600]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                  Ordre d'affichage
                </label>
                <input
                  type="number"
                  value={editingBrand.sort_order || 1}
                  onChange={(e) => setEditingBrand({ ...editingBrand, sort_order: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-sm text-white focus:outline-none focus:border-[#E10600]"
                />
              </div>

              {/* Logo Management */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold">
                  Logo de la marque
                </label>

                {/* Direct URL input */}
                <div>
                  <input
                    type="text"
                    value={editingBrand.logo_url || ''}
                    onChange={(e) => setEditingBrand({ ...editingBrand, logo_url: e.target.value })}
                    placeholder="Coller l'URL d'un logo (https://... ou data:image/...)"
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white focus:outline-none focus:border-[#E10600] font-mono"
                  />
                  <p className="text-[11px] text-[#8A8A8A] mt-1">
                    Vous pouvez coller directement un lien d'image ou téléverser un fichier ci-dessous.
                  </p>
                </div>

                {/* Upload & Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#222222] hover:bg-[#333333] text-white text-xs font-semibold rounded cursor-pointer transition-colors border border-[#333333]">
                    <Upload className="w-3.5 h-3.5 text-[#E10600]" />
                    <span>{uploadingLogo ? 'Chargement...' : 'Téléverser un logo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      disabled={uploadingLogo}
                    />
                  </label>

                  {editingBrand.name && DEFAULT_BRAND_LOGOS[editingBrand.name] && (
                    <button
                      type="button"
                      onClick={() => {
                        const defLogo = resetBrandToDefault(editingBrand.name!);
                        if (defLogo) {
                          setEditingBrand((prev) => ({ ...prev, logo_url: defLogo }));
                          showNotification(`Logo officiel ${editingBrand.name} restauré`);
                        }
                      }}
                      className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#252525] text-neutral-300 text-xs font-medium rounded border border-[#333333] transition-colors"
                    >
                      Restaurer logo officiel
                    </button>
                  )}

                  {editingBrand.logo_url && (
                    <button
                      type="button"
                      onClick={() => setEditingBrand((prev) => ({ ...prev, logo_url: '' }))}
                      className="px-2.5 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-medium rounded border border-red-900/60 transition-colors"
                    >
                      Effacer
                    </button>
                  )}
                </div>

                {/* Live Preview matching the public site tile */}
                <div className="pt-2">
                  <div className="text-[11px] uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1.5">
                    Aperçu en direct (tel qu'affiché dans « Nos marques »)
                  </div>
                  <div className="w-full bg-white rounded-[12px] p-4 flex flex-col items-center justify-center border border-neutral-300 aspect-[16/9] max-h-32 shadow-inner">
                    {editingBrand.logo_url ? (
                      <img
                        key={editingBrand.logo_url}
                        src={editingBrand.logo_url}
                        alt={`Aperçu ${editingBrand.name || 'Marque'}`}
                        className="max-h-14 max-w-[85%] object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-sm font-extrabold uppercase text-neutral-800 tracking-wider">
                        {editingBrand.name || 'NOM MARQUE'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingBrand.is_active ?? true}
                    onChange={(e) => setEditingBrand({ ...editingBrand, is_active: e.target.checked })}
                    className="w-4 h-4 text-[#E10600] rounded focus:ring-0"
                  />
                  <span>Actif (visible dans la section Marques)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2A2A2A]">
                <button
                  type="button"
                  onClick={() => setEditingBrand(null)}
                  className="px-4 py-2 bg-[#222222] hover:bg-[#333333] text-white text-xs rounded font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSavingBrand}
                  className="px-6 py-2 bg-[#E10600] hover:bg-[#B00500] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors"
                >
                  {isSavingBrand ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Vehicle Modal */}
      {editingVehicle && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#2A2A2A]">
              <h2 className="text-xl font-bold text-white">
                {editingVehicle.id ? 'Modifier le véhicule' : 'Nouveau véhicule 0 km'}
              </h2>
              <button
                onClick={() => setEditingVehicle(null)}
                className="text-[#8A8A8A] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                    Marque du véhicule *
                  </label>
                  <select
                    required
                    value={editingVehicle.brand || (brands[0]?.name || 'Toyota')}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, brand: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-sm text-white focus:outline-none focus:border-[#E10600]"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.name} className="bg-[#141414] text-white">
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                    Modèle *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingVehicle.model || ''}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, model: e.target.value })}
                    placeholder="Ex: Land Cruiser LC300 VXR"
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-sm text-white focus:outline-none focus:border-[#E10600]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                    Type de carrosserie
                  </label>
                  <select
                    value={editingVehicle.type || 'SUV'}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, type: e.target.value as VehicleType })}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-sm text-white focus:outline-none focus:border-[#E10600]"
                  >
                    <option value="SUV">SUV</option>
                    <option value="Berline">Berline</option>
                    <option value="Pick-up">Pick-up</option>
                    <option value="Électrique">Électrique</option>
                    <option value="Citadine">Citadine</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                    Année
                  </label>
                  <input
                    type="number"
                    value={editingVehicle.year || 2025}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, year: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-sm text-white focus:outline-none focus:border-[#E10600]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                    Places
                  </label>
                  <input
                    type="number"
                    value={editingVehicle.seats || 5}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, seats: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-sm text-white focus:outline-none focus:border-[#E10600]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                    Carburant
                  </label>
                  <input
                    type="text"
                    value={editingVehicle.fuel || 'Essence'}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, fuel: e.target.value })}
                    placeholder="Ex: Essence, Diesel, Électrique, Hybride"
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-sm text-white focus:outline-none focus:border-[#E10600]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                    Boîte de vitesses
                  </label>
                  <input
                    type="text"
                    value={editingVehicle.transmission || 'Automatique'}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, transmission: e.target.value })}
                    placeholder="Ex: Automatique"
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-sm text-white focus:outline-none focus:border-[#E10600]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                  Motorisation / Puissance
                </label>
                <input
                  type="text"
                  value={editingVehicle.engine || ''}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, engine: e.target.value })}
                  placeholder="Ex: 3.5L V6 Bi-Turbo 415 ch ou Bimoteur 530 ch"
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-sm text-white focus:outline-none focus:border-[#E10600]"
                />
              </div>

              {/* Configuration Avancée des Prix (PRIORITÉ 3) */}
              <div className="p-4 rounded-xl bg-[#0F0F11] border border-[#2A2A2A] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#222224] pb-2">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-white font-bold block">
                      Tarification & Affichage Commercial
                    </span>
                    <span className="text-[11px] text-[#8A8A8A]">
                      Sépare le montant numérique, le libellé commercial et le mode d'affichage.
                    </span>
                  </div>
                  {/* Aperçu en direct */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#8A8A8A] uppercase">Rendu site :</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#1A1A1E] border border-zinc-700 text-xs font-mono font-bold text-emerald-400">
                      {getVehiclePriceInfo(editingVehicle).displayPrice}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* 1. Prix Numérique Principal */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                      Prix Numérique (FCFA)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingVehicle.price !== undefined && editingVehicle.price !== null ? editingVehicle.price : ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? null : Math.max(0, Number(e.target.value));
                        setEditingVehicle({
                          ...editingVehicle,
                          price: val,
                        });
                      }}
                      placeholder="Ex: 25000000 (vide = absent)"
                      className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-sm text-white focus:outline-none focus:border-[#E10600] font-mono"
                    />
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {[12500000, 22000000, 35000000].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setEditingVehicle({ ...editingVehicle, price: p })}
                          className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#1E1E22] hover:bg-[#2A2A30] text-zinc-300 border border-[#333333] cursor-pointer"
                        >
                          {new Intl.NumberFormat('fr-FR').format(p)} F
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Prix Promotionnel Optionnel */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                      Prix Promo Optionnel (FCFA)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingVehicle.promo_price !== undefined && editingVehicle.promo_price !== null ? editingVehicle.promo_price : ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? null : Math.max(0, Number(e.target.value));
                        setEditingVehicle({
                          ...editingVehicle,
                          promo_price: val,
                        });
                      }}
                      placeholder="Ex: 20000000 (optionnel)"
                      className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-sm text-white focus:outline-none focus:border-[#E10600] font-mono"
                    />
                    <span className="text-[10px] text-zinc-500 block mt-1">
                      Laissez vide s'il n'y a pas de promotion.
                    </span>
                  </div>

                  {/* 3. Mode d'affichage */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                      Mode d'affichage
                    </label>
                    <select
                      value={editingVehicle.price_display_mode || 'auto'}
                      onChange={(e: any) =>
                        setEditingVehicle({
                          ...editingVehicle,
                          price_display_mode: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-sm text-white focus:outline-none focus:border-[#E10600]"
                    >
                      <option value="auto">Automatique (recommandé)</option>
                      <option value="numeric">Prix chiffré seul (FCFA)</option>
                      <option value="label">Libellé commercial seul</option>
                      <option value="both">Prix + Libellé commercial</option>
                      <option value="on_demand">Forcer « Sur demande »</option>
                    </select>
                  </div>
                </div>

                {/* 4. Libellé commercial indépendant */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold">
                      Libellé commercial personnalisé (ne sera JAMAIS écrasé par le prix chiffré)
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingVehicle({
                          ...editingVehicle,
                          price_label: 'Sur demande',
                        })
                      }
                      className="text-[10px] text-yellow-400 hover:underline"
                    >
                      Mettre « Sur demande »
                    </button>
                  </div>
                  <input
                    type="text"
                    value={editingVehicle.price_label || ''}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, price_label: e.target.value })}
                    placeholder="Ex: Sur demande, Devis VIP, À partir de 25M FCFA, etc."
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-sm text-white focus:outline-none focus:border-[#E10600]"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {['Sur demande', 'Prix VIP sur devis', 'Tarif spécial flotte', 'Livraison Cocody comprise'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setEditingVehicle({ ...editingVehicle, price_label: preset })}
                        className="px-2 py-0.5 rounded text-[10px] bg-[#1E1E22] hover:bg-[#2A2A30] text-zinc-300 border border-[#333333] cursor-pointer"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                  Description & Équipements
                </label>
                <textarea
                  rows={3}
                  value={editingVehicle.description || ''}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, description: e.target.value })}
                  placeholder="Présentation des options de luxe, finitions, garanties..."
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-sm text-white focus:outline-none focus:border-[#E10600]"
                />
              </div>

              {/* Photos Management */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                  Photos du véhicule (Bucket vehicle-images)
                </label>

                <div className="flex items-center gap-3 mb-3">
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#222222] hover:bg-[#333333] text-white text-xs font-semibold rounded cursor-pointer transition-colors border border-[#333333]">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? 'Téléversement...' : 'Téléverser des photos'}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                  <span className="text-xs text-[#8A8A8A]">
                    {editingVehicle.images?.length || 0} image(s) associée(s)
                  </span>
                </div>

                {editingVehicle.images && editingVehicle.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded">
                    {editingVehicle.images.map((img, idx) => (
                      <div key={idx} className="relative w-20 h-14 rounded overflow-hidden border border-[#333333] group">
                        <img src={img} alt="Aperçu" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setEditingVehicle({
                              ...editingVehicle,
                              images: editingVehicle.images?.filter((_, i) => i !== idx),
                            });
                          }}
                          className="absolute inset-0 bg-red-900/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section Offre Spéciale & Exclusivité */}
              <div className="p-4 rounded-xl border border-[#333333] bg-[#0E0E11] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-xs text-white font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingVehicle.is_offer ?? false}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setEditingVehicle({
                          ...editingVehicle,
                          is_offer: checked,
                          is_exclusive: checked ? editingVehicle.is_exclusive : false,
                        });
                      }}
                      className="w-4 h-4 text-[#E10600] rounded focus:ring-0"
                    />
                    <span>Véhicule en offre promotionnelle (affiché dans « Nos Offres »)</span>
                  </label>

                  {/* Bouton à cocher pour ajouter aux offres exclusives */}
                  <label className="flex items-center gap-2 text-xs text-[#f6b704] font-bold cursor-pointer bg-[#f6b704]/10 border border-[#f6b704]/30 px-3 py-1.5 rounded-lg hover:bg-[#f6b704]/20 transition-colors">
                    <input
                      type="checkbox"
                      checked={editingVehicle.is_exclusive ?? false}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setEditingVehicle({
                          ...editingVehicle,
                          is_exclusive: checked,
                          is_offer: checked ? true : editingVehicle.is_offer,
                        });
                      }}
                      className="w-4 h-4 text-[#f6b704] rounded focus:ring-0 accent-[#f6b704]"
                    />
                    <Sparkles className="w-3.5 h-3.5 text-[#f6b704]" />
                    <span>Offre Exclusive VIP</span>
                  </label>
                </div>

                {(editingVehicle.is_offer || editingVehicle.is_exclusive) && (
                  <div className="space-y-3 pt-2 border-t border-[#222222]">
                    {editingVehicle.is_exclusive && (
                      <div className="p-2.5 rounded-lg bg-[#f6b704]/10 border border-[#f6b704]/25 text-[11px] text-[#f6b704] flex items-center gap-2">
                        <Sparkles className="w-4 h-4 shrink-0" />
                        <span>
                          Ce véhicule sera mis en avant dans la sélection des offres exclusives avec le badge VIP et associé à la section WhatsApp.
                        </span>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                        Badge de l'offre
                      </label>
                      <input
                        type="text"
                        value={editingVehicle.offer_badge || ''}
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, offer_badge: e.target.value })}
                        placeholder="Ex: Pack Mobilité Électrique Offert, Immatriculation Offerte..."
                        className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white focus:outline-none focus:border-[#E10600]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                        Points forts de l'offre (un par ligne)
                      </label>
                      <textarea
                        rows={3}
                        value={(editingVehicle.offer_highlights || []).join('\n')}
                        onChange={(e) =>
                          setEditingVehicle({
                            ...editingVehicle,
                            offer_highlights: e.target.value.split('\n').filter(Boolean),
                          })
                        }
                        placeholder="Borne de recharge murale 11kW offerte&#10;Immatriculation et carte grise incluses&#10;Garantie 5 ans ou 100 000 km"
                        className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white focus:outline-none focus:border-[#E10600] font-sans"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingVehicle.is_available ?? true}
                    onChange={(e) =>
                      setEditingVehicle({ ...editingVehicle, is_available: e.target.checked })
                    }
                    className="w-4 h-4 text-[#E10600] rounded focus:ring-0"
                  />
                  <span>Disponible (visible sur le catalogue)</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingVehicle.is_featured ?? false}
                    onChange={(e) =>
                      setEditingVehicle({ ...editingVehicle, is_featured: e.target.checked })
                    }
                    className="w-4 h-4 text-[#E10600] rounded focus:ring-0"
                  />
                  <span>Mettre en avant (Vedette)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2A2A2A]">
                <button
                  type="button"
                  onClick={() => setEditingVehicle(null)}
                  className="px-4 py-2.5 bg-[#222222] hover:bg-[#333333] text-white text-xs rounded font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSavingVehicle}
                  className="px-6 py-2.5 bg-[#E10600] hover:bg-[#B00500] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors"
                >
                  {isSavingVehicle ? 'Enregistrement...' : 'Enregistrer le véhicule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Add / Edit Hero Slide Modal */}
      {editingSlide && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#2A2A2A]">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#E10600]" />
                  <span>{isAddingSlide ? 'Nouveau Slide Diaporama Hero' : 'Modifier le Slide Hero'}</span>
                </h3>
                <p className="text-xs text-[#8A8A8A] mt-0.5">
                  Les modifications sont appliquées instantanément sur la page d'accueil.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingSlide(null);
                  setIsAddingSlide(false);
                }}
                className="p-1 text-[#8A8A8A] hover:text-white rounded-lg hover:bg-[#222222] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Slide Preview */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono uppercase text-[#8A8A8A] tracking-wider block">
                Aperçu fidèle en direct
              </span>
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-zinc-950 border border-[#2A2A2A]">
                <img
                  src={editingSlide.image || '/public/assets/aistudio/814493891_122239370216113743_2889832111464126919_n_8772dda4.jpg'}
                  alt={editingSlide.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/public/assets/aistudio/814493891_122239370216113743_2889832111464126919_n_8772dda4.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/25" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-white/10" />

                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-black/70 backdrop-blur-xs text-white border border-white/20">
                    {editingSlide.badge || 'Badge exemple'}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <h4 className="font-heading font-extralight text-xl sm:text-2xl text-white leading-tight">
                    {editingSlide.title || 'Titre du véhicule'}{' '}
                    <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-[#E10600]">
                      {editingSlide.highlight || 'mise en avant.'}
                    </span>
                  </h4>
                  <p className="text-xs text-zinc-300 font-light mt-1 line-clamp-2">
                    {editingSlide.subtitle || 'Sous-titre et présentation du modèle.'}
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!editingSlide) return;
                const isNew = !heroSlides.some((s) => s.id === editingSlide.id);
                let updated: HeroSlide[];
                if (isNew) {
                  updated = [...heroSlides, { ...editingSlide, id: 'slide-' + Date.now() }];
                } else {
                  updated = heroSlides.map((s) => (s.id === editingSlide.id ? editingSlide : s));
                }
                setHeroSlides(updated);
                saveHeroSlides(updated);
                setEditingSlide(null);
                setIsAddingSlide(false);
                showNotification('Slide du diaporama enregistré avec succès !');
              }}
              className="space-y-4"
            >
              {/* Image d'arrière-plan du Slide avec upload direct & presets */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold">
                  Image d'arrière-plan du Slide (URL ou Fichier) *
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={editingSlide.image || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, image: e.target.value })}
                    placeholder="Coller l'URL d'une image ou téléversez un fichier ci-contre..."
                    className="flex-1 px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E10600] font-mono text-xs"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#222222] hover:bg-[#333333] text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors border border-[#333333] shrink-0">
                    <Upload className="w-3.5 h-3.5 text-[#E10600]" />
                    <span>Téléverser</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (isSupabaseConfigured()) {
                          const { url, error } = await uploadVehicleImage(file);
                          if (url) {
                            setEditingSlide({ ...editingSlide, image: url });
                            showNotification('Image téléversée avec succès sur Supabase Storage');
                          } else {
                            showNotification('Erreur de téléversement : ' + error?.message, 'error');
                          }
                        } else {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setEditingSlide({ ...editingSlide, image: event.target.result as string });
                              showNotification('Image chargée localement');
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Galerie miniature de sélection rapide */}
                <div className="pt-1">
                  <span className="text-[10px] text-zinc-400 block mb-1.5 font-medium">Sélection rapide parmi nos visuels haute définition :</span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {[
                      { label: 'Parc IPM', url: '/public/assets/aistudio/814493891_122239370216113743_2889832111464126919_n_8772dda4.jpg' },
                      { label: 'Équipe IPM', url: '/public/assets/aistudio/Capture_d_e_cran_2026-10-29_a__18.34.08_75055a70.png' },
                      { label: 'Mercedes AMG', url: '/assets/cars/car_mercedes_sedan_1793116467102.jpg' },
                      { label: 'BYD Seal', url: '/assets/cars/car_byd_seal_1793116465632.jpg' },
                      { label: 'Toyota 4x4', url: '/assets/cars/car_toyota_4x4_1793116466608.jpg' },
                      { label: 'Jetour SUV', url: '/assets/cars/car_jetour_suv_1793116466140.jpg' },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setEditingSlide({ ...editingSlide, image: preset.url })}
                        className={`relative aspect-[16/10] rounded-lg overflow-hidden border transition-all cursor-pointer group ${
                          editingSlide.image === preset.url
                            ? 'border-[#E10600] ring-2 ring-[#E10600]/30 scale-102'
                            : 'border-zinc-800 hover:border-zinc-500 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[8px] text-white text-center py-0.5 truncate px-1">
                          {preset.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Badge */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                  Petit Badge supérieur
                </label>
                <input
                  type="text"
                  value={editingSlide.badge || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, badge: e.target.value })}
                  placeholder="Ex: Parc Automobile Riviera Bonoumin • 0 KM"
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E10600]"
                />
              </div>

              {/* Titre et Mot mis en valeur */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                    Titre principal *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSlide.title || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                    placeholder="Ex: L’Excellence Automobile"
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E10600]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                    Mot en vedette (dégradé rouge) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSlide.highlight || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, highlight: e.target.value })}
                    placeholder="Ex: à votre portée."
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E10600]"
                  />
                </div>
              </div>

              {/* Sous-titre */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                  Sous-titre explicatif *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingSlide.subtitle || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                  placeholder="Ex: Découvrez notre sélection d’exception de véhicules neufs 0 km prêts pour enlèvement immédiat à Abidjan."
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E10600]"
                />
              </div>

              {/* Lien du bouton */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                  Lien de destination *
                </label>
                <input
                  type="text"
                  required
                  value={editingSlide.link || '/modeles'}
                  onChange={(e) => setEditingSlide({ ...editingSlide, link: e.target.value })}
                  placeholder="Ex: /modeles ou /modeles?marque=Toyota ou /contact"
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E10600]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2A2A2A]">
                <button
                  type="button"
                  onClick={() => {
                    setEditingSlide(null);
                    setIsAddingSlide(false);
                  }}
                  className="px-4 py-2.5 bg-[#222222] hover:bg-[#333333] text-white text-xs rounded-lg font-medium cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#E10600] hover:bg-[#B00500] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-lg shadow-[#E10600]/25"
                >
                  Enregistrer le slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Testimonial Modal */}
      {editingTestimonial && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#2A2A2A]">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                  <span>{isAddingTestimonial ? 'Nouveau Témoignage Client' : 'Modifier le Témoignage'}</span>
                </h3>
                <p className="text-xs text-[#8A8A8A] mt-0.5">
                  Mise à jour instantanée sur la page d'accueil du site.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingTestimonial(null);
                  setIsAddingTestimonial(false);
                }}
                className="text-[#8A8A8A] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!editingTestimonial.name.trim() || !editingTestimonial.comment.trim()) {
                  showNotification('Veuillez renseigner le nom et le commentaire', 'error');
                  return;
                }
                addOrUpdateTestimonial(editingTestimonial);
                setEditingTestimonial(null);
                setIsAddingTestimonial(false);
                showNotification('Témoignage enregistré avec succès');
              }}
              className="space-y-4"
            >
              {/* Photo du client avec prévisualisation et upload direct */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold">
                  Photo du client *
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-black shrink-0 border border-[#2A2A2A]">
                    <img
                      src={editingTestimonial.image}
                      alt="Aperçu client"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/public/assets/aistudio/814493891_122239370216113743_2889832111464126919_n_8772dda4.jpg';
                      }}
                    />
                  </div>
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      required
                      value={editingTestimonial.image}
                      onChange={(e) =>
                        setEditingTestimonial({ ...editingTestimonial, image: e.target.value })
                      }
                      placeholder="URL de l'image (https://...)"
                      className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-xs text-white focus:outline-none focus:border-[#E10600] font-mono"
                    />
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#222222] hover:bg-[#333333] text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors border border-[#333333]">
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Uploader depuis votre appareil</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            const res = ev.target?.result as string;
                            if (res) {
                              setEditingTestimonial((prev) => (prev ? { ...prev, image: res } : null));
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Nom & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                    Nom du client *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.name}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, name: e.target.value })
                    }
                    placeholder="Ex: Alain, Monsieur Idrissa, Mme Blédou"
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E10600]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                    Date affichée
                  </label>
                  <input
                    type="text"
                    value={editingTestimonial.date}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, date: e.target.value })
                    }
                    placeholder="Ex: il y a 6 jours, il y a 2 semaines"
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E10600]"
                  />
                </div>
              </div>

              {/* Étoiles */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                  Note d'évaluation (Étoiles)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setEditingTestimonial({ ...editingTestimonial, rating: star })
                      }
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= (editingTestimonial.rating || 5)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-zinc-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-zinc-400 ml-2 font-mono">
                    {editingTestimonial.rating || 5} / 5 étoiles
                  </span>
                </div>
              </div>

              {/* Commentaire */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                  Avis / Commentaire du client *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingTestimonial.comment}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, comment: e.target.value })
                  }
                  placeholder="Ex: Le service client a traité ma demande avec un véritable professionnalisme..."
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E10600]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2A2A2A]">
                <button
                  type="button"
                  onClick={() => {
                    setEditingTestimonial(null);
                    setIsAddingTestimonial(false);
                  }}
                  className="px-4 py-2.5 bg-[#222222] hover:bg-[#333333] text-white text-xs rounded-lg font-medium cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#E10600] hover:bg-[#B00500] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-lg shadow-[#E10600]/25"
                >
                  Enregistrer l'avis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Service Section Modal */}
      {editingServiceSection && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2A]">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#E10600] font-bold">
                  {editingServiceSection.badge || 'Engagement'}
                </span>
                <h2 className="text-lg font-bold text-white">
                  Modifier la section « {editingServiceSection.title} »
                </h2>
              </div>
              <button
                onClick={() => setEditingServiceSection(null)}
                className="text-[#8A8A8A] hover:text-white cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveServiceSection} className="space-y-5">
              {/* Image de la section avec upload direct */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold">
                  Image d'illustration *
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-32 h-20 rounded-xl overflow-hidden bg-black shrink-0 border border-[#2A2A2A] relative flex items-center justify-center">
                    <img
                      src={editingServiceSection.image}
                      alt="Aperçu section"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src = '/public/assets/aistudio/814493891_122239370216113743_2889832111464126919_n_8772dda4.jpg';
                      }}
                    />
                  </div>
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      required
                      value={editingServiceSection.image}
                      onChange={(e) =>
                        setEditingServiceSection({ ...editingServiceSection, image: e.target.value })
                      }
                      placeholder="URL de l'image (/assets/... ou https://...)"
                      className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-xs text-white focus:outline-none focus:border-[#E10600] font-mono"
                    />
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#222222] hover:bg-[#333333] text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors border border-[#333333]">
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{uploadingServiceImage ? 'Téléversement en cours...' : 'Uploader une nouvelle photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingServiceImage}
                        className="hidden"
                        onChange={handleServiceImageUpload}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Titre & Mots en valeur */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                    Titre complet de la section *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingServiceSection.title}
                    onChange={(e) =>
                      setEditingServiceSection({ ...editingServiceSection, title: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E10600]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                    Partie du titre mise en valeur
                  </label>
                  <input
                    type="text"
                    value={editingServiceSection.titleHighlight || ''}
                    onChange={(e) =>
                      setEditingServiceSection({ ...editingServiceSection, titleHighlight: e.target.value })
                    }
                    placeholder="Ex: Constructeur Officielle"
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E10600]"
                  />
                </div>
              </div>

              {/* Badge & Légende d'image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                    Libellé du badge supérieur
                  </label>
                  <input
                    type="text"
                    value={editingServiceSection.badge || ''}
                    onChange={(e) =>
                      setEditingServiceSection({ ...editingServiceSection, badge: e.target.value })
                    }
                    placeholder="Ex: Engagement 01"
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E10600]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                    Badge de localisation (sur l'image)
                  </label>
                  <input
                    type="text"
                    value={editingServiceSection.locationBadge || ''}
                    onChange={(e) =>
                      setEditingServiceSection({ ...editingServiceSection, locationBadge: e.target.value })
                    }
                    placeholder="Ex: Cocody Abidjan"
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E10600]"
                  />
                </div>
              </div>

              {/* Sous-titre / Description */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-1">
                  Description / Sous-titre *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingServiceSection.subtitle}
                  onChange={(e) =>
                    setEditingServiceSection({ ...editingServiceSection, subtitle: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-sm text-white focus:outline-none focus:border-[#E10600]"
                />
              </div>

              {/* Puces d'engagements (éditables) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold">
                    Puces d'engagements détaillées
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingServiceSection({
                        ...editingServiceSection,
                        points: [...editingServiceSection.points, 'Nouvel engagement'],
                      })
                    }
                    className="text-xs text-[#E10600] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter une puce</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {editingServiceSection.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2">
                      <span className="text-xs font-mono text-zinc-500 w-5 text-right">{pIdx + 1}.</span>
                      <input
                        type="text"
                        value={pt}
                        onChange={(e) => {
                          const newPts = [...editingServiceSection.points];
                          newPts[pIdx] = e.target.value;
                          setEditingServiceSection({ ...editingServiceSection, points: newPts });
                        }}
                        className="flex-1 px-3 py-1.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-xs text-white focus:outline-none focus:border-[#E10600]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newPts = editingServiceSection.points.filter((_, i) => i !== pIdx);
                          setEditingServiceSection({ ...editingServiceSection, points: newPts });
                        }}
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded cursor-pointer"
                        title="Supprimer cette puce"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Boutons validation */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2A2A2A]">
                <button
                  type="button"
                  onClick={() => setEditingServiceSection(null)}
                  className="px-4 py-2.5 bg-[#222222] hover:bg-[#333333] text-white text-xs rounded-lg font-medium cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSavingServices}
                  className="px-6 py-2.5 bg-[#E10600] hover:bg-[#B00500] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-lg shadow-[#E10600]/25"
                >
                  {isSavingServices ? 'Enregistrement...' : 'Enregistrer la section'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
