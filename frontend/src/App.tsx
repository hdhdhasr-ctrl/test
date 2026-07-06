import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Scissors, 
  Sparkles, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Instagram, 
  Facebook, 
  Check, 
  X, 
  Menu, 
  Info,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Award,
  Gem
} from "lucide-react";
import { HairService, GalleryItem, ReservationData } from "./types";

// Static premium services data
const SERVICES: HairService[] = [
  {
    id: "strzyzenie-meskie",
    name: "Strzyżenie męskie",
    description: "Precyzyjne strzyżenie maszynką i nożyczkami, odprężające mycie włosów z masażem głowy oraz profesjonalna stylizacja dobrana do kształtu twarzy.",
    price: "od 90 zł",
    duration: "45 min",
    category: "cut"
  },
  {
    id: "strzyzenie-damskie",
    name: "Strzyżenie damskie",
    description: "Profesjonalna konsultacja stylistyczna, mycie pielęgnacyjne, precyzyjne cięcie oraz modelowanie z użyciem luksusowych kosmetyków utrwalających.",
    price: "od 150 zł",
    duration: "60 min",
    category: "cut"
  },
  {
    id: "koloryzacja",
    name: "Koloryzacja",
    description: "Jednolita koloryzacja premium z ochroną struktury włosa, nadająca głęboki, długotrwały kolor i zjawiskowy blask.",
    price: "od 220 zł",
    duration: "120 min",
    category: "color"
  },
  {
    id: "baleyage",
    name: "Baleyage",
    description: "Wielotonowa technika artystycznego rozjaśniania pasemek, tworząca naturalny efekt trójwymiarowości oraz optycznej objętości.",
    price: "od 320 zł",
    duration: "180 min",
    category: "color"
  },
  {
    id: "ombre",
    name: "Ombre / Sombre",
    description: "Płynne, gradientowe przejście kolorów – od głębokiej ciemniejszej nasady po świetliste, subtelnie rozjaśnione końcówki.",
    price: "od 300 zł",
    duration: "150 min",
    category: "color"
  },
  {
    id: "modelowanie",
    name: "Modelowanie",
    description: "Okolicznościowe lub codzienne modelowanie na szczotkę, prostowanie lub romantyczne fale z kompletną termoochroną i nabłyszczeniem.",
    price: "od 100 zł",
    duration: "45 min",
    category: "style"
  },
  {
    id: "regeneracja-wlosow",
    name: "Regeneracja włosów",
    description: "Zabieg głębokiej rekonstrukcji zniszczonych struktur keratynowych, przywracający elastyczność, siłę i jedwabistą gładkość.",
    price: "od 180 zł",
    duration: "60 min",
    category: "care"
  },
  {
    id: "stylizacja-okolicznosciowa",
    name: "Stylizacja okolicznościowa",
    description: "Zjawiskowe upięcia ślubne, bankietowe i wieczorowe projektowane indywidualnie, by idealnie współgrać z Twoją kreacją i osobowością.",
    price: "od 250 zł",
    duration: "90 min",
    category: "style"
  }
];

// Curated high-end gallery items (incorporating generated images and stunning premium styling photos)
const GALLERY: GalleryItem[] = [
  {
    id: "gal-1",
    src: "/src/assets/images/salon_interior_hero_1783343000049.jpg",
    alt: "Ekskluzywne wnętrze salonu ZNNK Studio",
    category: "Salon"
  },
  {
    id: "gal-2",
    src: "/src/assets/images/baleyage_styling_1783343014944.jpg",
    alt: "Precyzyjny baleyage i fale blond",
    category: "Koloryzacja"
  },
  {
    id: "gal-3",
    src: "/src/assets/images/men_haircut_1783343028368.jpg",
    alt: "Nowoczesne strzyżenie męskie z dopracowanym fade'em",
    category: "Strzyżenie"
  },
  {
    id: "gal-4",
    src: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800",
    alt: "Luksusowa stylizacja i suszenie włosów",
    category: "Stylizacja"
  },
  {
    id: "gal-5",
    src: "https://images.unsplash.com/photo-1527799822367-a05eb5747737?auto=format&fit=crop&q=80&w=800",
    alt: "Pielęgnacyjne mycie z masażem głowy",
    category: "Pielęgnacja"
  },
  {
    id: "gal-6",
    src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800",
    alt: "Ekskluzywne kosmetyki do rekonstrukcji struktury włosa",
    category: "Pielęgnacja"
  }
];

export default function App() {
  // Navigation & UI States
  const [activeCategory, setActiveCategory] = useState<'all' | 'cut' | 'color' | 'style' | 'care'>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<ReservationData>({
    fullName: "",
    phone: "",
    email: "",
    service: "",
    date: "",
    time: "",
    notes: ""
  });

  // Form Status States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState("");
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ReservationData, string>>>({});

  // Monitor scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Today's date in YYYY-MM-DD format for date input restriction
  const todayStr = new Date().toISOString().split('T')[0];

  // Handle service selection from Usługi cards
  const handleBookService = (serviceName: string) => {
    setFormData(prev => ({ ...prev, service: serviceName }));
    const formElement = document.getElementById("rezerwacja");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Validate fields helper
  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof ReservationData, string>> = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = "Imię i nazwisko są wymagane.";
    } else if (formData.fullName.trim().split(" ").length < 2) {
      errors.fullName = "Wpisz imię i nazwisko (np. Jan Kowalski).";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Numer telefonu jest wymagany.";
    } else {
      const cleanPhone = formData.phone.replace(/\D/g, "");
      if (cleanPhone.length < 9) {
        errors.phone = "Wprowadź poprawny 9-cyfrowy numer telefonu.";
      }
    }

    if (!formData.email.trim()) {
      errors.email = "Adres e-mail jest wymagany.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Wprowadź poprawny adres e-mail.";
    }

    if (!formData.service) {
      errors.service = "Proszę wybrać usługę.";
    }

    if (!formData.date) {
      errors.date = "Proszę wybrać datę wizyty.";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date(todayStr);
      if (selectedDate < today) {
        errors.date = "Nie można zarezerwować terminu w przeszłości.";
      }
    }

    if (!formData.time) {
      errors.time = "Proszę wybrać godzinę.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle reservation submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setStatusMessage("");

    try {
      const response = await fetch("/api/rezerwacja", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && (result.success || result.message)) {
        setSubmitStatus('success');
        setStatusMessage(result.message || "Dziękujemy. Rezerwacja została przyjęta.");
        // Clear form on success
        setFormData({
          fullName: "",
          phone: "",
          email: "",
          service: "",
          date: "",
          time: "",
          notes: ""
        });
        setFormErrors({});
      } else {
        setSubmitStatus('error');
        setStatusMessage(result.error || "Wystąpił błąd podczas rezerwacji. Spróbuj ponownie.");
      }
    } catch (error) {
      console.error("Booking submission error:", error);
      setSubmitStatus('error');
      setStatusMessage("Wystąpił problem z połączeniem. Prosimy o kontakt telefoniczny: +48 537 347 356.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredServices = activeCategory === 'all' 
    ? SERVICES 
    : SERVICES.filter(s => s.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#070707] text-[#eaeaea] font-sans selection:bg-gold-500 selection:text-[#070707]">
      
      {/* HEADER / NAVIGATION */}
      <header 
        id="navbar"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled 
            ? "bg-[#0c0c0c]/90 backdrop-blur-md border-b border-white/5 py-4 shadow-lg shadow-black/40" 
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Logo */}
          <a href="#" className="group flex flex-col focus:outline-none">
            <span className="font-serif text-2xl sm:text-3xl tracking-[3px] text-white group-hover:text-gold-400 transition-colors duration-300">
              ZNNK <span className="text-gold-500">STUDIO</span>
            </span>
            <span className="text-[9px] tracking-[4px] text-gold-400 uppercase font-light text-center sm:text-left mt-0.5">
              Premium Hair Salon
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#o-nas" className="text-sm font-medium tracking-wide hover:text-gold-400 transition-colors duration-300">
              O NAS
            </a>
            <a href="#uslugi" className="text-sm font-medium tracking-wide hover:text-gold-400 transition-colors duration-300">
              USŁUGI
            </a>
            <a href="#galeria" className="text-sm font-medium tracking-wide hover:text-gold-400 transition-colors duration-300">
              GALERIA
            </a>
            <a href="#kontakt" className="text-sm font-medium tracking-wide hover:text-gold-400 transition-colors duration-300">
              KONTAKT
            </a>
          </nav>

          {/* Right action button */}
          <div className="hidden md:block">
            <a 
              href="#rezerwacja" 
              className="relative inline-flex items-center justify-center px-6 py-2.5 overflow-hidden text-xs font-semibold tracking-wider text-black bg-gold-500 hover:bg-gold-400 transition-all duration-300 rounded-none group"
            >
              <span className="relative z-10">UMÓW WIZYTĘ</span>
              <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 opacity-20"></div>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:text-gold-400 focus:outline-none"
            aria-label="Toggle Menu"
            id="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* MOBILE NAV PANEL */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-[72px] z-40 bg-[#0c0c0c]/98 backdrop-blur-lg flex flex-col p-6 space-y-6 md:hidden border-t border-white/5"
            id="mobile-navigation"
          >
            <div className="flex flex-col space-y-4">
              <a 
                href="#o-nas" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-serif tracking-wider border-b border-white/5 pb-3 hover:text-gold-400 transition-colors"
              >
                O nas
              </a>
              <a 
                href="#uslugi" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-serif tracking-wider border-b border-white/5 pb-3 hover:text-gold-400 transition-colors"
              >
                Usługi i cennik
              </a>
              <a 
                href="#galeria" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-serif tracking-wider border-b border-white/5 pb-3 hover:text-gold-400 transition-colors"
              >
                Galeria prac
              </a>
              <a 
                href="#kontakt" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-serif tracking-wider border-b border-white/5 pb-3 hover:text-gold-400 transition-colors"
              >
                Kontakt i lokalizacja
              </a>
            </div>
            
            <a 
              href="#rezerwacja" 
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-4 bg-gold-500 hover:bg-gold-400 text-black font-semibold text-sm tracking-wider transition-colors"
            >
              ZAREZERWUJ TERMIN ONLINE
            </a>

            <div className="pt-8 text-center text-zinc-500 text-xs">
              <p className="mb-2">Masz pytania? Zadzwoń do nas:</p>
              <a href="tel:+48537347356" className="text-gold-400 font-semibold text-base block hover:underline">
                +48 537 347 356
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* SECTION 1: HERO */}
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with elegant overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/src/assets/images/salon_interior_hero_1783343000049.jpg" 
            alt="Salon fryzjerski premium ZNNK Studio" 
            className="w-full h-full object-cover object-center scale-105 animate-[scaleOut_15s_ease-out_infinite]"
            referrerPolicy="no-referrer"
            id="hero-bg-img"
          />
          {/* Multi-layer linear gradient to create perfect readability and rich dark gold mood */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-black/40 to-[#070707]/90 z-10"></div>
          <div className="absolute inset-0 bg-black/40 z-10"></div>
        </div>

        {/* Content */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 text-center mt-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-6"
          >
            <span className="inline-block text-gold-500 tracking-[6px] text-xs sm:text-sm uppercase font-semibold">
              Ekskluzywny Salon Fryzjerski
            </span>
            
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif tracking-[4px] text-white leading-tight font-light">
              ZNNK <span className="italic text-gold-400">Studio</span>
            </h1>

            <p className="text-lg sm:text-2xl text-zinc-300 font-light max-w-2xl mx-auto font-sans tracking-wide">
              Twój styl zaczyna się tutaj.
            </p>

            <div className="w-24 h-[1px] bg-gold-500 mx-auto my-8"></div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a 
                href="#rezerwacja" 
                className="w-full sm:w-auto px-8 py-4 bg-gold-500 text-black text-sm font-semibold tracking-widest hover:bg-gold-400 transition-colors duration-300 rounded-none shadow-xl shadow-black/50"
                id="hero-booking-btn"
              >
                UMÓW WIZYTĘ
              </a>
              <a 
                href="#uslugi" 
                className="w-full sm:w-auto px-8 py-4 border border-white/10 hover:border-gold-400 text-white text-sm font-semibold tracking-widest transition-colors duration-300 rounded-none bg-black/30 backdrop-blur-sm"
              >
                POZNAJ USŁUGI
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden sm:flex flex-col items-center space-y-2 opacity-60">
          <span className="text-[9px] tracking-[3px] text-zinc-400 uppercase font-light">
            Odkryj więcej
          </span>
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-1.5 bg-gold-500 rounded-full"
          />
        </div>
      </section>


      {/* SECTION 2: O NAS */}
      <section id="o-nas" className="py-24 sm:py-32 border-b border-white/5 relative overflow-hidden bg-gradient-to-b from-[#070707] to-[#0c0c0c]">
        {/* Subtle background decoration */}
        <div className="absolute -left-24 top-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-[100px] pointer-events-none ambient-glow-1"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Left side: Images (Aesthetic Bento Layout) */}
            <div className="lg:col-span-5 order-2 lg:order-1 grid grid-cols-12 gap-4">
              <div className="col-span-12 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[#070707]/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img 
                  src="/src/assets/images/men_haircut_1783343028368.jpg" 
                  alt="Stylista fryzur męskich w pracy" 
                  className="w-full h-80 object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="col-span-7 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[#070707]/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=600" 
                  alt="Ekskluzywne detale salonu" 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="col-span-5 relative overflow-hidden bg-zinc-950 flex flex-col justify-center p-6 border border-zinc-800/40">
                <span className="text-4xl font-serif text-gold-400 font-semibold mb-1">10+</span>
                <span className="text-[10px] tracking-wider text-zinc-400 uppercase font-medium">Lat doświadczenia</span>
              </div>
            </div>

            {/* Right side: Editorial text copy */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-8">
              <div className="space-y-4">
                <span className="text-gold-500 text-xs font-semibold tracking-[4px] uppercase block">
                  Kunszt • Pasja • Perfekcja
                </span>
                <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-wide font-normal">
                  Salon, w którym włosy stają się <span className="italic text-gold-400">sztuką</span>.
                </h2>
                <div className="w-16 h-[2px] bg-gold-500"></div>
              </div>

              <div className="space-y-6 text-zinc-300 font-light leading-relaxed">
                <p>
                  W <strong className="text-white font-medium">ZNNK Studio</strong> tworzymy przestrzeń, w której luksus spotyka się z pełnym profesjonalizmem. Wierzymy, że idealna fryzura to nie tylko rzemiosło, ale przede wszystkim spersonalizowana kreacja dostosowana do Twoich potrzeb, urody oraz stylu życia.
                </p>
                <p>
                  Nasz zespół składa się z certyfikowanych stylistów, którzy stale podnoszą swoje kwalifikacje na międzynarodowych szkoleniach. Pracujemy wyłącznie na starannie dobranych, ekskluzywnych kosmetykach premium, które dbają o strukturę włosa, przywracając mu naturalną witalność i połysk.
                </p>
              </div>

              {/* USP (Unique Selling Points) Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/5">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-[#0c0c0c] border border-white/5 text-gold-400 shrink-0">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-1">Kosmetyki Premium</h4>
                    <p className="text-zinc-400 text-xs font-light">Włoskie, organiczne linie kosmetyczne.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-[#0c0c0c] border border-white/5 text-gold-400 shrink-0">
                    <Award size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-1">Ekspercka Wiedza</h4>
                    <p className="text-zinc-400 text-xs font-light">Wieloletni, dyplomowani mistrzowie fryzjerstwa.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-[#0c0c0c] border border-white/5 text-gold-400 shrink-0">
                    <Gem size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-1">Pełna Dbałość</h4>
                    <p className="text-zinc-400 text-xs font-light">Konsultacja w cenie i pyszna włoska kawa.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* SECTION 3: USŁUGI */}
      <section id="uslugi" className="py-24 sm:py-32 relative bg-[#070707]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section title */}
          <div className="text-center space-y-4 mb-16">
            <span className="text-gold-500 text-xs font-semibold tracking-[4px] uppercase block">
              Szeroki wachlarz kreacji
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-wide font-normal">
              Nasze Usługi i <span className="italic text-gold-400">Cennik</span>
            </h2>
            <div className="w-16 h-[2px] bg-gold-500 mx-auto"></div>
            <p className="text-zinc-400 text-sm max-w-xl mx-auto font-light">
              Oferujemy najwyższej jakości zabiegi strzyżenia, zaawansowanej koloryzacji oraz pielęgnacji regeneracyjnej.
            </p>
          </div>

          {/* Service Filters */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-12">
            {[
              { id: "all", label: "Wszystkie usługi" },
              { id: "cut", label: "Strzyżenie" },
              { id: "color", label: "Koloryzacja" },
              { id: "style", label: "Stylizacja" },
              { id: "care", label: "Pielęgnacja" }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-5 py-2 text-xs tracking-wider font-medium uppercase transition-all duration-300 rounded-none border ${
                  activeCategory === cat.id 
                    ? "bg-gold-500 text-black border-gold-500 font-semibold" 
                    : "bg-transparent text-zinc-400 border-white/5 hover:text-gold-400 hover:border-gold-400"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8" id="services-grid">
            <AnimatePresence mode="popLayout">
              {filteredServices.map((service, idx) => {
                // Assign a beautiful icon based on category/type
                let CategoryIcon = Scissors;
                if (service.category === 'color') CategoryIcon = Sparkles;
                if (service.category === 'style') CategoryIcon = Gem;
                if (service.category === 'care') CategoryIcon = Award;

                return (
                  <motion.div
                    key={service.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="group bg-[#0a0a0a] border border-white/5 hover:border-gold-500/20 hover:bg-zinc-950 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Corner decorative golden detail */}
                    <div className="absolute top-0 right-0 w-2 h-2 bg-gold-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="space-y-4">
                      {/* Top bar of the card */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-[#0d0d0d] border border-white/5 text-gold-400 group-hover:text-white transition-colors duration-300">
                            <CategoryIcon size={20} />
                          </div>
                          <h3 className="font-serif text-lg sm:text-xl text-white group-hover:text-gold-400 transition-colors duration-300">
                            {service.name}
                          </h3>
                        </div>
                        <div className="text-right">
                          <span className="font-serif text-lg text-gold-400 font-medium block whitespace-nowrap">
                            {service.price}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {service.duration}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-zinc-400 text-sm font-light leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    {/* Bottom Action inside card */}
                    <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
                      <button
                        onClick={() => handleBookService(service.name)}
                        className="text-xs font-semibold tracking-wider text-gold-400 hover:text-white flex items-center space-x-1.5 group/btn"
                        id={`book-btn-${service.id}`}
                      >
                        <span>Wybierz i rezerwuj</span>
                        <ArrowRight size={14} className="transform group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

        </div>
      </section>


      {/* SECTION 4: GALERIA */}
      <section id="galeria" className="py-24 sm:py-32 bg-[#0c0c0c] border-t border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Title */}
          <div className="text-center space-y-4 mb-16">
            <span className="text-gold-500 text-xs font-semibold tracking-[4px] uppercase block">
              Inspiracje i Realizacje
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-wide font-normal">
              Galeria naszych <span className="italic text-gold-400">prac</span>
            </h2>
            <div className="w-16 h-[2px] bg-gold-500 mx-auto"></div>
            <p className="text-zinc-400 text-sm max-w-xl mx-auto font-light">
              Zobacz metamorfozy i stylizacje wykonane przez nasz zespół w ZNNK Studio. Kliknij zdjęcie, aby je powiększyć.
            </p>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="gallery-grid">
            {GALLERY.map((img) => (
              <div 
                key={img.id}
                onClick={() => setSelectedImage(img)}
                className="group relative h-96 overflow-hidden cursor-zoom-in bg-zinc-950 border border-white/5"
              >
                {/* Image rendering with lazy loading */}
                <img 
                  src={img.src} 
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Hover overlay with gold borders and details */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex flex-col justify-end p-6">
                  {/* Decorative Frame */}
                  <div className="absolute inset-4 border border-gold-400/30 scale-95 group-hover:scale-100 transition-all duration-500"></div>

                  <div className="relative z-20 space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <span className="text-gold-400 text-[10px] tracking-[3px] uppercase font-semibold">
                      {img.category}
                    </span>
                    <h4 className="text-white font-serif text-lg font-light leading-snug">
                      {img.alt}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* LIGHTBOX MODAL */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 sm:p-10 backdrop-blur-sm"
              id="gallery-lightbox"
            >
              {/* Close button */}
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 p-3 bg-zinc-900/80 hover:bg-zinc-800 text-white transition-colors rounded-full z-50 hover:text-gold-400"
                aria-label="Close Lightbox"
              >
                <X size={24} />
              </button>

              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-4xl w-full bg-[#0a0a0a] border border-white/10 flex flex-col overflow-hidden"
              >
                <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-black">
                  <img 
                    src={selectedImage.src} 
                    alt={selectedImage.alt}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6 bg-[#0c0c0c] border-t border-white/5 flex justify-between items-center gap-4">
                  <div>
                    <span className="text-gold-500 text-[10px] tracking-widest uppercase font-semibold block mb-1">
                      {selectedImage.category}
                    </span>
                    <h3 className="font-serif text-white text-lg sm:text-xl">
                      {selectedImage.alt}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="text-xs text-zinc-400 hover:text-white uppercase tracking-wider font-medium"
                  >
                    Zamknij
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>


      {/* SECTION 5: REZERWACJA ONLINE */}
      <section id="rezerwacja" className="py-24 sm:py-32 relative overflow-hidden bg-[#070707]">
        {/* Decorative ambient background lights */}
        <div className="absolute right-0 bottom-12 w-96 h-96 bg-gold-500/5 rounded-full blur-[120px] pointer-events-none ambient-glow-2"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-[#0c0c0c] border border-white/5 p-8 sm:p-12 relative">
            {/* Elegant luxury framing lines */}
            <div className="absolute top-3 left-3 bottom-3 right-3 border border-white/5 pointer-events-none"></div>

            <div className="text-center space-y-4 mb-12">
              <span className="text-gold-500 text-xs font-semibold tracking-[4px] uppercase block">
                Zarezerwuj swój fotel
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-white tracking-wide">
                Rezerwacja Online
              </h2>
              <div className="w-16 h-[2px] bg-gold-500 mx-auto"></div>
              <p className="text-zinc-400 text-sm max-w-md mx-auto font-light">
                Wypełnij poniższy formularz. Skontaktujemy się z Tobą mailowo lub telefonicznie w celu ostatecznego potwierdzenia terminu.
              </p>
            </div>

            {/* Success state */}
            {submitStatus === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 px-4 space-y-6 flex flex-col items-center"
                id="booking-success-message"
              >
                <div className="w-16 h-16 bg-gold-400/10 border border-gold-500 rounded-full flex items-center justify-center text-gold-400">
                  <Check size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl text-white">Rezerwacja wysłana pomyślnie!</h3>
                  <p className="text-zinc-400 text-sm max-w-md mx-auto font-light">
                    {statusMessage || "Dziękujemy. Rezerwacja została przyjęta."}
                  </p>
                  <p className="text-zinc-500 text-xs italic pt-4">
                    Oczekuj na telefon lub e-mail potwierdzający od managera salonu.
                  </p>
                </div>
                <button
                  onClick={() => setSubmitStatus('idle')}
                  className="mt-6 px-6 py-2.5 bg-[#0a0a0a] hover:bg-zinc-900 text-white border border-white/5 hover:border-gold-400/40 text-xs tracking-wider font-semibold transition-colors uppercase"
                >
                  Zarezerwuj kolejną wizytę
                </button>
              </motion.div>
            ) : (
              /* Booking Form */
              <form onSubmit={handleFormSubmit} className="space-y-6 relative z-10" id="booking-form" noValidate>
                
                {/* General server error */}
                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-950/20 border border-red-900/60 text-red-200 text-sm rounded-none flex items-start space-x-3">
                    <Info size={18} className="shrink-0 mt-0.5" />
                    <span>{statusMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="block text-xs font-semibold tracking-wider text-zinc-300 uppercase">
                      Imię i nazwisko <span className="text-gold-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      placeholder="np. Jan Kowalski"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={`w-full bg-[#070707] border px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-400 transition-colors rounded-none placeholder-zinc-700 ${
                        formErrors.fullName ? "border-red-900" : "border-white/5"
                      }`}
                    />
                    {formErrors.fullName && (
                      <p className="text-red-400 text-xs font-light">{formErrors.fullName}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-xs font-semibold tracking-wider text-zinc-300 uppercase">
                      Telefon kontaktowy <span className="text-gold-400">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      placeholder="np. 500 600 700"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full bg-[#070707] border px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-400 transition-colors rounded-none placeholder-zinc-700 ${
                        formErrors.phone ? "border-red-900" : "border-white/5"
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="text-red-400 text-xs font-light">{formErrors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-xs font-semibold tracking-wider text-zinc-300 uppercase">
                      Adres e-mail <span className="text-gold-400">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="np. jan@domena.pl"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full bg-[#070707] border px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-400 transition-colors rounded-none placeholder-zinc-700 ${
                        formErrors.email ? "border-red-900" : "border-white/5"
                      }`}
                    />
                    {formErrors.email && (
                      <p className="text-red-400 text-xs font-light">{formErrors.email}</p>
                    )}
                  </div>

                  {/* Service selector */}
                  <div className="space-y-2">
                    <label htmlFor="service" className="block text-xs font-semibold tracking-wider text-zinc-300 uppercase">
                      Wybór usługi <span className="text-gold-400">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="service"
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className={`w-full bg-[#070707] border px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-400 transition-colors rounded-none appearance-none cursor-pointer ${
                          formErrors.service ? "border-red-900" : "border-white/5"
                        }`}
                      >
                        <option value="">-- Wybierz z listy --</option>
                        {SERVICES.map((s) => (
                          <option key={s.id} value={s.name} className="bg-[#0c0c0c] text-white">
                            {s.name} ({s.price})
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    </div>
                    {formErrors.service && (
                      <p className="text-red-400 text-xs font-light">{formErrors.service}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Date */}
                  <div className="space-y-2">
                    <label htmlFor="date" className="block text-xs font-semibold tracking-wider text-zinc-300 uppercase">
                      Preferowana data <span className="text-gold-400">*</span>
                    </label>
                    <input
                      type="date"
                      id="date"
                      min={todayStr}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className={`w-full bg-[#070707] border px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-400 transition-colors rounded-none ${
                        formErrors.date ? "border-red-900" : "border-white/5"
                      }`}
                    />
                    {formErrors.date && (
                      <p className="text-red-400 text-xs font-light">{formErrors.date}</p>
                    )}
                  </div>

                  {/* Time selector */}
                  <div className="space-y-2">
                    <label htmlFor="time" className="block text-xs font-semibold tracking-wider text-zinc-300 uppercase">
                      Preferowana godzina <span className="text-gold-400">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className={`w-full bg-[#070707] border px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-400 transition-colors rounded-none appearance-none cursor-pointer ${
                          formErrors.time ? "border-red-900" : "border-white/5"
                        }`}
                      >
                        <option value="">-- Wybierz godzinę --</option>
                        {["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00"].map((timeVal) => (
                          <option key={timeVal} value={timeVal} className="bg-[#0c0c0c] text-white">
                            {timeVal}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    </div>
                    {formErrors.time && (
                      <p className="text-red-400 text-xs font-light">{formErrors.time}</p>
                    )}
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="space-y-2">
                  <label htmlFor="notes" className="block text-xs font-semibold tracking-wider text-zinc-300 uppercase">
                    Dodatkowe informacje / Uwagi dla stylisty
                  </label>
                  <textarea
                    id="notes"
                    rows={4}
                    placeholder="np. informacja o aktualnym stanie włosów, preferowanym styliście, czy chęci drastycznej metamorfozy"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-[#070707] border border-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-400 transition-colors rounded-none placeholder-zinc-700 resize-none"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gold-500 hover:bg-gold-400 text-black text-sm font-semibold tracking-widest transition-all duration-300 rounded-none shadow-lg shadow-black/30 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    id="booking-submit-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>WYSYŁANIE REZERWACJI...</span>
                      </>
                    ) : (
                      <>
                        <Calendar size={16} />
                        <span>ZAREZERWUJ TERMIN</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      </section>


      {/* SECTION 6: KONTAKT */}
      <section id="kontakt" className="py-24 sm:py-32 relative bg-[#0c0c0c] border-t border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">
            
            {/* Contact details */}
            <div className="lg:col-span-5 space-y-10 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="space-y-3">
                  <span className="text-gold-500 text-xs font-semibold tracking-[4px] uppercase block">
                    Do zobaczenia w salonie
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-wide">
                    Kontakt
                  </h2>
                  <div className="w-16 h-[2px] bg-gold-500"></div>
                </div>

                <p className="text-zinc-400 text-sm font-light leading-relaxed">
                  ZNNK Studio zlokalizowane jest w samym sercu miasta. Odwiedź nas i oddaj swoje włosy w ręce mistrzów fryzjerstwa.
                </p>
              </div>

              {/* Direct clickable contact cards */}
              <div className="space-y-6">
                
                {/* Phone number */}
                <a 
                  href="tel:+48537347356" 
                  className="flex items-center space-x-4 p-4 bg-[#0a0a0a] border border-white/5 hover:border-gold-400/40 hover:bg-[#070707] transition-all duration-300 group"
                  id="contact-phone"
                >
                  <div className="p-3 bg-zinc-900 text-gold-400 group-hover:text-white transition-colors">
                    <Phone size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] tracking-wider uppercase text-zinc-500 font-medium block">Zadzwoń do nas</span>
                    <span className="text-white font-serif text-lg tracking-wide block group-hover:text-gold-400 transition-colors">
                      +48 537 347 356
                    </span>
                  </div>
                </a>

                {/* Email address */}
                <a 
                  href="mailto:znnkstudio@gmail.com" 
                  className="flex items-center space-x-4 p-4 bg-[#0a0a0a] border border-white/5 hover:border-gold-400/40 hover:bg-[#070707] transition-all duration-300 group"
                  id="contact-email"
                >
                  <div className="p-3 bg-zinc-900 text-gold-400 group-hover:text-white transition-colors">
                    <Mail size={20} />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[10px] tracking-wider uppercase text-zinc-500 font-medium block">Napisz e-mail</span>
                    <span className="text-white font-serif text-base sm:text-lg tracking-wide block group-hover:text-gold-400 transition-colors truncate">
                      znnkstudio@gmail.com
                    </span>
                  </div>
                </a>

                {/* Address */}
                <div className="flex items-center space-x-4 p-4 bg-[#0a0a0a] border border-white/5">
                  <div className="p-3 bg-zinc-900 text-gold-400">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] tracking-wider uppercase text-zinc-500 font-medium block">Adres salonu</span>
                    <span className="text-white font-serif text-base tracking-wide block">
                      ul. Piękna 12, 00-477 Warszawa
                    </span>
                  </div>
                </div>

              </div>

              {/* Working Hours & Socials */}
              <div className="space-y-6 pt-6 border-t border-white/5">
                <div className="flex items-start space-x-3 text-sm text-zinc-300 font-light">
                  <Clock size={16} className="text-gold-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="text-white font-semibold block text-xs tracking-wider uppercase mb-1">Godziny otwarcia</span>
                    <p className="text-xs">Poniedziałek – Piątek: <strong className="text-white font-medium">9:00 – 20:00</strong></p>
                    <p className="text-xs">Sobota: <strong className="text-white font-medium">8:00 – 15:00</strong></p>
                    <p className="text-xs">Niedziela: <strong className="text-zinc-500 font-medium">Zamknięte</strong></p>
                  </div>
                </div>

                {/* Social media connections */}
                <div className="flex items-center space-x-4 pt-2">
                  <span className="text-xs tracking-wider uppercase text-zinc-500 font-medium">Znajdź nas na:</span>
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-zinc-950 border border-white/5 hover:border-gold-400 text-zinc-400 hover:text-white transition-all rounded-full"
                    aria-label="Facebook Link"
                    id="social-fb"
                  >
                    <Facebook size={16} />
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-zinc-950 border border-white/5 hover:border-gold-400 text-zinc-400 hover:text-white transition-all rounded-full"
                    aria-label="Instagram Link"
                    id="social-ig"
                  >
                    <Instagram size={16} />
                  </a>
                </div>
              </div>

            </div>

            {/* Google map iframe */}
            <div className="lg:col-span-7 h-96 lg:h-auto min-h-[350px] relative border border-white/5">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2443.9015949581726!2d21.0210214!3d52.2270383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471eccf919b78eab%3A0x2d17c9b884dbd5e7!2sul.%20Pi%C4%99kna%2012%2C%2000-477%20Warszawa!5e0!3m2!1spl!2spl!4v1710000000000!5m2!1spl!2spl" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) grayscale(100%) brightness(95%) contrast(110%)" }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map ZNNK Studio Warszawa"
                id="contact-map-iframe"
              ></iframe>
            </div>

          </div>

        </div>
      </section>


      {/* FOOTER */}
      <footer className="bg-[#070707] border-t border-white/5 py-12 text-center text-zinc-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="font-serif text-xl tracking-[2px] text-white">
            ZNNK <span className="text-gold-500">STUDIO</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-zinc-400 text-[11px] tracking-widest uppercase">
            <a href="#o-nas" className="hover:text-gold-400 transition-colors">O nas</a>
            <a href="#uslugi" className="hover:text-gold-400 transition-colors">Usługi</a>
            <a href="#galeria" className="hover:text-gold-400 transition-colors">Galeria</a>
            <a href="#rezerwacja" className="hover:text-gold-400 transition-colors">Rezerwacja</a>
            <a href="#kontakt" className="hover:text-gold-400 transition-colors">Kontakt</a>
          </div>
          <div className="w-12 h-[1px] bg-white/10 mx-auto"></div>
          <p className="font-light">
            © 2026 ZNNK Studio. Wszelkie prawa zastrzeżone. Projekt strony i wdrożenie dla salonu fryzjerskiego.
          </p>
        </div>
      </footer>

    </div>
  );
}
