"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "om";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    "nav.home": "Home",
    "nav.about": "About",
    "nav.services": "Services",
    "nav.work": "Work",
    "nav.contact": "Contact",
    "btn.hire": "Hire Me",

    // Hero Section
    "hero.eyebrow": "Professional Video Editor / Creative Brand Builder",
    "hero.title": "Cinematic Video Editing That Makes Brands Feel Premium",
    "hero.description": "I help creators, brands, and businesses turn raw footage into polished visual stories with clean pacing, strong emotion, and a premium final look.",
    "hero.btn.work": "View My Work",
    "hero.btn.contact": "Contact Me",
    "hero.meta.focus": "Focus",
    "hero.meta.focus.value": "Editing / Motion / Creative Direction",
    "hero.meta.status": "Status",
    "hero.meta.status.value": "Haramaya University IT Student, 2nd Year",

    // Brand Strip
    "brand.workflow": "Premium Workflow",
    "brand.portfolio": "Scalable Portfolio",
    "brand.storytelling": "Creative Storytelling",
    "brand.logos": "Future Client Logos",
    "brand.awards": "Awards / Stats Ready",

    // About Section
    "about.eyebrow": "About Me",
    "about.title": "Creative identity built on story, discipline, and modern visual craft.",
    "about.text1": "I'm Hamza Teha, a video editor building work that feels cinematic, focused, and valuable. My approach combines creative instinct with strong technical execution so every cut, transition, and pacing choice supports the message.",
    "about.text2": "I'm also a second year Information Technology student at Haramaya University, which strengthens how I think about digital presentation, clean systems, and scalable brand experiences for modern clients.",
    "about.vision": "Creative Vision",
    "about.vision.desc": "Visual decisions shaped to elevate the identity behind the content.",
    "about.editing": "Professional Editing",
    "about.editing.desc": "Clean workflow, polished finishing, and dependable attention to detail.",
    "about.story": "Story-Driven Results",
    "about.story.desc": "Edits designed to hold attention and leave a memorable impression.",
    "about.brand": "Personal Brand",
    "about.name": "Hamza Teha",
    "about.title.brand": "Professional Video Editor / TEHA_TECH",

    // Services Section
    "services.eyebrow": "What I Do",
    "services.title": "Flexible service blocks that can grow as the business expands.",
    "services.video": "Video Editing",
    "services.video.desc": "Brand videos, reels, YouTube edits, promos, and short-form storytelling.",
    "services.web": "Web Development",
    "services.web.desc": "Clean web presentation support for personal brands, landing pages, and showcases.",
    "services.thumbnail": "Thumbnail Design",
    "services.thumbnail.desc": "Attention-grabbing visual covers that increase clarity, clicks, and content appeal.",
    "services.tech": "Online Passport & Tech Related",
    "services.tech.desc": "Helpful digital support for online processing and practical tech-related tasks.",

    // Work Section
    "work.eyebrow": "Featured Projects",
    "work.title": "Expandable project cards with room for new edits, campaigns, and outcomes.",
    "work.more": "See More Work",

    // Case Studies
    "case.eyebrow": "Selected Case Studies",
    "case.title": "A larger content area designed for future deep project breakdowns.",
    "case.tag": "Future Case Study Block",
    "case.heading": "Project overview, challenge, edit approach, result, and preview can live here.",
    "case.desc": "This placeholder keeps a premium structure ready for detailed portfolio growth later without redesigning the full website.",

    // Tools Section
    "tools.eyebrow": "Tools I Use",
    "tools.title": "Organized skill groups that stay clean as your workflow grows.",
    "tools.editing": "Editing",
    "tools.motion": "Motion",
    "tools.color": "Color & Sound",

    // Testimonials
    "testimonials.eyebrow": "What Clients Say",
    "testimonials.title": "Placeholder testimonial cards with space for future trust signals.",

    // CTA
    "cta.eyebrow": "Ready To Start",
    "cta.title": "Let's Turn Your Footage Into Something People Remember.",
    "cta.desc": "Clean editing, creative support, and a polished result built to make your brand feel more valuable.",
    "cta.btn.start": "Start a Project",
    "cta.btn.message": "Message Me",

    // Contact Section
    "contact.eyebrow": "Contact",
    "contact.title": "A clear contact panel for direct bookings and quick client requests.",
    "contact.heading": "Direct Contact",
    "contact.phone": "Phone",
    "contact.email": "Email",
    "contact.brand": "Brand",
    "contact.note": "Teha Tech is always your first choice if you need to learn and go with digital world",
    "contact.form.title": "Client Inquiry Panel",
    "contact.form.desc": "Select the services you need and leave your details.",
    "contact.form.name": "Client Name",
    "contact.form.name.placeholder": "Your full name",
    "contact.form.phone": "Phone Number",
    "contact.form.phone.placeholder": "+251...",
    "contact.form.email": "Email Address",
    "contact.form.email.placeholder": "your@email.com",
    "contact.form.brief": "Project Brief",
    "contact.form.brief.placeholder": "Share what you need, timeline, and any important details.",
    "contact.form.submit": "Send Inquiry",
    "contact.form.success": "Your inquiry has been sent successfully! We'll get back to you soon.",

    // Footer
    "footer.desc": "Premium video editing and digital creative services under TEHA TECH company.",
  },
  om: {
    // Header
    "nav.home": "Mana",
    "nav.about": "Waa'ee Koo",
    "nav.services": "Tajaajila",
    "nav.work": "Hojii",
    "nav.contact": "Quunnamtii",
    "btn.hire": "Na Gaafadhu",

    // Hero Section
    "hero.eyebrow": "Gulantaa Viidiyoo Ogeenya / Ijaaraa Brandicha Ogeenya",
    "hero.title": "Gulantaa Viidiyoo Sinemaatikii Kan Brandicha Miidhaagaa Taasisu",
    "hero.description": "Ijaartoota, brandicha, fi dhaabbileewwan gargaaru kan viidiyoo jalqabaa gara seenaa miidhaagaa kan qabeenya, miidhaagaa, fi ilaalcha miidhaagaa qabu jijjiiru.",
    "hero.btn.work": "Hojii Koo Ilaalaa",
    "hero.btn.contact": "Na Quunnamaa",
    "hero.meta.focus": "Xiyyeeffannaa",
    "hero.meta.focus.value": "Gulantaa / Soofaa / Karoora Ijaaraa",
    "hero.meta.status": "Haala",
    "hero.meta.status.value": "Barataa Yuniversitii Haramaya IT, Waggaa 2ffaa",

    // Brand Strip
    "brand.workflow": "Hojii Miidhaagaa",
    "brand.portfolio": "Portfooliyoo Babal'ina",
    "brand.storytelling": "Seenaa Ijaaraa",
    "brand.logos": "Loogoowwan Dhaabbilee Fuuldura",
    "brand.awards": "Gantummaa / Tilmaamota Qophaa'an",

    // About Section
    "about.eyebrow": "Waa'ee Koo",
    "about.title": "Identitii Ijaaraa kan seenaa, jajjabina, fi hojii miidhaagaa ammayyaa irratti hundaa'e.",
    "about.text1": "Ani Hamza Teha, gulantaa viidiyoo kan hojii sinemaatikii, xiyyeeffannaa, fi gatii qabu ijaaruu. Karoorni koo miidhaagaa ijaaraa fi hojii miidhaagaa walitti makaa'u kan kutaa, jijjiirama, fi karoora miidhaagaa seenaa deggersuu.",
    "about.text2": "Ani barataa waggaa 2ffaa Yuniversitii Haramaya IT kan jira, kunis akka ani yaada miidhaagaa dijitaalaa, sirna qabeenya, fi muuxannoo brandicha babal'ina ammayyaa irratti yaada gaarii qabu.",
    "about.vision": "Miidhaagaa Ijaaraa",
    "about.vision.desc": "Murtii miidhaagaa kan identitii seenaa irratti ol ol ta'u.",
    "about.editing": "Gulantaa Ogeenya",
    "about.editing.desc": "Hojii qabeenya, xumuura miidhaagaa, fi eeggannaa miidhaagaa.",
    "about.story": "Firiin Seenaa",
    "about.story.desc": "Gulantaa kan eeggannaa qabsiisuun fi yaadannoo miidhaagaa hafu.",
    "about.brand": "Brandicha Dhuunfaa",
    "about.name": "Hamza Teha",
    "about.title.brand": "Gulantaa Viidiyoo Ogeenya / TEHA_TECH",

    // Services Section
    "services.eyebrow": "Waan Hojjedhu",
    "services.title": "Tajaajila babal'ina danda'u kan dhaabbichaa babal'ina waliin.",
    "services.video": "Gulantaa Viidiyoo",
    "services.video.desc": "Viidiyoo brandicha, reels, gulantaa YouTube, odeeffannoo, fi seenaa gabaabaa.",
    "services.web": "Ijaaraa Interneetii",
    "services.web.desc": "Gargaarsa miidhaagaa interneetii brandicha dhuunfaa, fuula jalqabaa, fi agarsiisa.",
    "services.thumbnail": "Ijaaraa Fakkii Xiqqaa",
    "services.thumbnail.desc": "Fakkii miidhaagaa kan eeggannaa qabsiisuun, cuqaasuu, fi miidhaagaa seenaa ol ta'u.",
    "services.tech": "Paspoortii Interneetii & Waan Teeknoloojii",
    "services.tech.desc": "Gargaarsa dijitaalaa adeemsa interneetii fi hojii teeknoloojii.",

    // Work Section
    "work.eyebrow": "Hojii Filatamee",
    "work.title": "Kaardii hojii babal'ina danda'u kan gulantaa haaraa, odeeffannoo, fi firiin.",
    "work.more": "Hojii Dabalataa Ilaalaa",

    // Case Studies
    "case.eyebrow": "Seenaa Hojii Filatamee",
    "case.title": "Naannoo miidhaagaa kan gulantaa hojii babal'ina fuuldura.",
    "case.tag": "Blokii Seenaa Hojii Fuuldura",
    "case.heading": "Ilaalcha hojii, rakkina, karoorni gulantaa, firiin, fi mul'ata hojii.",
    "case.desc": "Naannoon kun sirna miidhaagaa babal'ina portfooliyoo fuuldura qophaa'u.",

    // Tools Section
    "tools.eyebrow": "Meeshaalee Fayyadamnu",
    "tools.title": "Gareen meeshaa qabeenya kan dhaabbichaa babal'ina waliin.",
    "tools.editing": "Gulantaa",
    "tools.motion": "Soofaa",
    "tools.color": "Halluu & Sagalee",

    // Testimonials
    "testimonials.eyebrow": "Waan Dhaabbileechi Jedhan",
    "testimonials.title": "Kaardii yaadannoo fuuldura kan mallattoo amansiisaa.",

    // CTA
    "cta.eyebrow": "Jalqabuu Qophaa'an",
    "cta.title": "Viidiyoo Kee Waan Namni Yaadadhu Jijjiiru.",
    "cta.desc": "Gulantaa qabeenya, gargaarsa ijaaraa, fi firiin miidhaagaa brandicha miidhaagaa taasisu.",
    "cta.btn.start": "Hojii Jalqabaa",
    "cta.btn.message": "Na Ergaa",

    // Contact Section
    "contact.eyebrow": "Quunnamtii",
    "contact.title": "Paneli quunnamtii qabeenya kan gaafii dhaabbilee.",
    "contact.heading": "Quunnamtii Kallattii",
    "contact.phone": "Lakkoobsa Bilbilaa",
    "contact.email": "Imeelii",
    "contact.brand": "Brandicha",
    "contact.note": "Teha Tech filannoo jalqabaa kee yoo baruu fi addeemsa dijitaalaa barbaadde.",
    "contact.form.title": "Paneli Gaafii Dhaabbilee",
    "contact.form.desc": "Tajaajila barbaaddu filadhu fi odeeffannoo kee kennuu.",
    "contact.form.name": "Maqaa Dhaabbilee",
    "contact.form.name.placeholder": "Maqaa kee guutuu",
    "contact.form.phone": "Lakkoobsa Bilbilaa",
    "contact.form.phone.placeholder": "+251...",
    "contact.form.email": "Imeelii",
    "contact.form.email.placeholder": "kee@imeelii.com",
    "contact.form.brief": "Seenaa Hojii",
    "contact.form.brief.placeholder": "Waan barbaaddu, yeroo, fi odeeffannoo barbaachisu kennuu.",
    "contact.form.submit": "Gaafii Ergi",
    "contact.form.success": "Gaafiin kee milkaa'inaan erga'e! Nu deebi'na.",

    // Footer
    "footer.desc": "Tajaajila gulantaa viidiyoo miidhaagaa fi tajaajila dijitaalaa ijaaraa TEHA TECH.",
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language | null;
    const initialLanguage = savedLanguage || "en";
    setLanguageState(initialLanguage);
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
