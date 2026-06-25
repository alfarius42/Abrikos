import { useState, useEffect, useRef, useCallback } from "react";

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  sky:        "#3B82F6",   // deep azure — header, badges, footers
  skyLight:   "#60A5FA",   // day sky — gradients, hovers
  skyPale:    "#EBF4FF",   // pale sky — card bg, muted sections
  foam:       "#FFFDF2",   // sea foam/sand — page background, text areas
  sun:        "#FBBF24",   // Yeysk sun — primary CTA buttons
  coral:      "#EF4444",   // sunset coral — prices, highlights
  green:      "#10B981",   // lush green — amenities, nature tags
  navy:       "#0F2A5C",   // deep navy — body text
  navyMid:    "#4A6FA5",   // mid navy — secondary text
  white:      "#FFFFFF",
} as const;

// ─── Data ─────────────────────────────────────────────────────────────────────
const PHONES = [
  { label: "+7 (938) 000-00-00", href: "tel:+79380000000" },
  { label: "+7 (938) 000-00-01", href: "tel:+79380000001" },
];

interface Room {
  id: string;
  name: string;
  tagline: string;
  description: string;
  area: string;
  capacity: number;
  beds: string;
  features: string[];
  price: string;
  imageUrl: string;
  gallery: string[];
}

const ROOMS: Room[] = [
  {
    id: "1", name: "Номер 1", tagline: "Стандартный двухместный",
    description: "Уютный номер с двуспальной кроватью в тёплых тонах. Подходит для пары. Из окна — ухоженный двор с зеленью. Всё необходимое для комфортного отдыха на Азовском море.",
    area: "18", capacity: 2, beds: "1 двуспальная кровать",
    features: ["Wi-Fi", "Кондиционер", "Телевизор", "Холодильник", "Душ"],
    price: "от 3 500 ₽/ночь",
    imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&h=800&fit=crop&auto=format",
    ],
  },
  {
    id: "2", name: "Номер 2", tagline: "Стандартный с раздельными кроватями",
    description: "Два отдельных спальных места — идеально для друзей или коллег. Светлый интерьер с натуральными материалами и всем необходимым для отдыха.",
    area: "20", capacity: 2, beds: "2 односпальные кровати",
    features: ["Wi-Fi", "Кондиционер", "Телевизор", "Холодильник", "Душ"],
    price: "от 3 500 ₽/ночь",
    imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&h=800&fit=crop&auto=format",
    ],
  },
  {
    id: "3", name: "Номер 3", tagline: "Улучшенный двухместный",
    description: "Улучшенный номер с большей площадью и более высоким уровнем оснащения. Мебель ручной работы, блэкаут-шторы и качественное бельё создают атмосферу настоящего уюта.",
    area: "22", capacity: 2, beds: "1 двуспальная кровать (King)",
    features: ["Wi-Fi", "Кондиционер", "Телевизор", "Холодильник", "Ванная"],
    price: "от 4 200 ₽/ночь",
    imageUrl: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&h=800&fit=crop&auto=format",
    ],
  },
  {
    id: "4", name: "Номер 4", tagline: "Семейный",
    description: "Широкая двуспальная и дополнительная кровать — для семьи с ребёнком. Больше места, больше свободы. Детская кроватка — по запросу.",
    area: "30", capacity: 3, beds: "1 двуспальная + 1 односпальная",
    features: ["Wi-Fi", "Кондиционер", "Телевизор", "Холодильник", "Ванная", "Детская кроватка (запрос)"],
    price: "от 5 200 ₽/ночь",
    imageUrl: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=800&fit=crop&auto=format",
    ],
  },
  {
    id: "5", name: "Номер 5", tagline: "Делюкс с видом на море",
    description: "Панорамный вид на Азовское море, интерьер в бело-голубой гамме, натуральные акценты. Утро с кофе у окна с морским видом — лучшее начало дня.",
    area: "25", capacity: 2, beds: "1 двуспальная кровать (King)",
    features: ["Wi-Fi", "Кондиционер", "Телевизор", "Мини-бар", "Ванная", "Халаты и тапочки"],
    price: "от 5 800 ₽/ночь",
    imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&h=800&fit=crop&auto=format",
    ],
  },
  {
    id: "6", name: "Номер 6", tagline: "С балконом",
    description: "Собственный балкон для утреннего кофе и вечернего бриза. Тёплые Ейские закаты и морской воздух — прямо из номера.",
    area: "24", capacity: 2, beds: "1 двуспальная кровать",
    features: ["Wi-Fi", "Кондиционер", "Телевизор", "Холодильник", "Душ", "Балкон"],
    price: "от 4 800 ₽/ночь",
    imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=800&fit=crop&auto=format",
    ],
  },
  {
    id: "apartments", name: "Апартаменты", tagline: "Просторные апартаменты",
    description: "Отдельная гостиная, спальня и полностью оборудованная кухня. Идеал для длительного проживания и для тех, кто ценит домашний уют вдали от дома.",
    area: "45", capacity: 4, beds: "1 двуспальная + диван-кровать",
    features: ["Wi-Fi", "Кондиционер", "Телевизор", "Кухня", "Стиральная машина", "Ванная", "Гостиная"],
    price: "от 7 500 ₽/ночь",
    imageUrl: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&h=600&fit=crop&auto=format",
    gallery: [
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&h=800&fit=crop&auto=format",
    ],
  },
];

const HOME_BLOCKS = [
  {
    heading: "Добро пожаловать в Абрикос",
    text: "Мини-отель «Абрикос» — в самом центре Ейска, в нескольких минутах ходьбы от Азовского моря. Тёплая атмосфера, внимательный персонал и уютные номера для настоящего отдыха.",
    imageUrl: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=900&h=650&fit=crop&auto=format",
    imageAlt: "Мини-отель Абрикос, Ейск",
  },
  {
    heading: "Ейск — жемчужина Азова",
    text: "Мягкий климат, тёплое мелководное море и свежий морской воздух. Ейск — один из самых уютных курортов юга России. От нашего отеля до пляжа — 10 минут пешком по тенистым улицам.",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&h=650&fit=crop&auto=format",
    imageAlt: "Азовское море, Ейск",
  },
  {
    heading: "Комфорт в каждой детали",
    text: "Кондиционер, телевизор, холодильник, бесплатный Wi-Fi — в каждом номере. Свежее бельё, мягкие полотенца, приветственный набор. Мы регулярно обновляем интерьеры, чтобы каждый заезд был лучше предыдущего.",
    imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&h=650&fit=crop&auto=format",
    imageAlt: "Уютный номер отеля",
  },
  {
    heading: "Для любой компании",
    text: "Стандартные номера для пары, семейные для детей, апартаменты с кухней для долгого отдыха. 7 вариантов размещения — найдётся подходящий для каждого. Бронируйте заранее: в сезон номера заполняются быстро.",
    imageUrl: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=900&h=650&fit=crop&auto=format",
    imageAlt: "Апартаменты для семьи",
  },
];

// ─── Icons (inline SVG — zero deps) ──────────────────────────────────────────
function IconMenu({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
function IconX({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function IconPhone({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.37 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 3.09 4.18 2 2 0 0 1 5.09 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L9.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
function IconChevronRight({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
function IconArrowLeft({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  );
}
function IconCheck({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function IconExternalLink({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

// ─── Shared styles ─────────────────────────────────────────────────────────────
const btnPrimary: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: "6px",
  background: C.sun, color: C.navy, fontWeight: 700, fontSize: "15px",
  padding: "10px 22px", borderRadius: "10px", border: "none", cursor: "pointer",
  transition: "transform 120ms ease, box-shadow 120ms ease",
  boxShadow: "0 2px 8px rgba(251,191,36,0.35)",
};
const btnSecondary: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: "6px",
  background: "transparent", color: C.sky, fontWeight: 600, fontSize: "14px",
  padding: "8px 16px", borderRadius: "8px", border: `1.5px solid ${C.sky}`,
  cursor: "pointer", transition: "background 150ms ease, color 150ms ease",
};

// ─── Header ───────────────────────────────────────────────────────────────────
type PageState = { type: "home" } | { type: "rooms" } | { type: "room"; id: string } | { type: "privacy" };

function Header({ onNavigate, menuOpen, setMenuOpen }: {
  onNavigate: (p: PageState) => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollToBooking = () => {
    onNavigate({ type: "home" });
    setTimeout(() => document.getElementById("booking-widget")?.scrollIntoView({ behavior: "smooth" }), 120);
  };

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      background: scrolled ? "rgba(59,130,246,0.72)" : C.sky,
      backdropFilter: scrolled ? "blur(14px) saturate(160%)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(14px) saturate(160%)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.18)" : "1px solid transparent",
      transition: "background 300ms ease, backdrop-filter 300ms ease, border-color 300ms ease, box-shadow 300ms ease",
      boxShadow: scrolled ? "0 2px 24px rgba(15,42,92,0.18)" : "0 2px 16px rgba(59,130,246,0.25)",
    }}>
      <div style={{ maxWidth: 1024, margin: "0 auto", padding: "0 16px", height: 66, display: "flex", alignItems: "center", gap: 12 }}>

        {/* Burger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Меню"
          style={{ width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(255,255,255,0.14)", border: "none", borderRadius: 10, cursor: "pointer",
            color: C.white, transition: "background 150ms ease", flexShrink: 0 }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.14)")}
        >
          <IconMenu />
        </button>

        {/* Logo */}
        <button onClick={() => onNavigate({ type: "home" })} style={{ flex: 1, textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 1.2 }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: C.white, letterSpacing: "-0.3px" }}>
            🍑 Абрикос
          </span>
          <span className="header-subtitle" style={{ fontSize: 15, color: "rgba(255,255,255,0.82)", marginLeft: 10, fontWeight: 400 }}>
            мини-отель · Ейск
          </span>
        </button>

        {/* Phones desktop */}
        <div style={{ display: "flex", alignItems: "center", gap: 22 }} className="phones-desktop">
          {PHONES.map(p => (
            <a key={p.href} href={p.href} style={{
              display: "flex", alignItems: "center", gap: 7, fontSize: 15,
              fontWeight: 600, color: C.white, textDecoration: "none",
              transition: "color 150ms",
            }}
              onMouseEnter={e => (e.currentTarget.style.color = C.sun)}
              onMouseLeave={e => (e.currentTarget.style.color = C.white)}
            >
              <IconPhone size={15} />
              {p.label}
            </a>
          ))}
        </div>

        {/* Phone icon mobile */}
        <a href={PHONES[0].href} className="phone-mobile" style={{
          width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(255,255,255,0.14)", borderRadius: 10, color: C.white, textDecoration: "none",
        }} aria-label="Позвонить">
          <IconPhone size={19} />
        </a>

        {/* CTA */}
        <button
          onClick={scrollToBooking}
          style={btnPrimary}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(251,191,36,0.5)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(251,191,36,0.35)"; }}
        >
          Забронировать
        </button>
      </div>

      <style>{`
        @media (max-width: 760px) { .phones-desktop { display: none !important; } .header-subtitle { display: none !important; } }
        @media (min-width: 761px) { .phone-mobile { display: none !important; } }
      `}</style>
    </header>
  );
}

// ─── Burger Drawer ─────────────────────────────────────────────────────────────
function BurgerMenu({ open, onClose, onNavigate }: { open: boolean; onClose: () => void; onNavigate: (p: PageState) => void }) {
  const go = (p: PageState) => { onNavigate(p); onClose(); };
  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, zIndex: 40, background: "rgba(15,42,92,0.5)",
        backdropFilter: "blur(3px)", opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none", transition: "opacity 250ms ease",
      }} />
      <aside style={{
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
        width: 280, background: C.white,
        borderRight: `3px solid ${C.sky}`,
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 280ms cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column",
        boxShadow: "4px 0 32px rgba(59,130,246,0.18)",
      }}>
        {/* Drawer header */}
        <div style={{ height: 62, background: C.sky, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px" }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: C.white }}>🍑 Абрикос</span>
          <button onClick={onClose} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, cursor: "pointer", color: C.white }}>
            <IconX />
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ padding: "16px 10px", flex: 1 }}>
          {[
            { label: "Главная",     page: { type: "home" }    as PageState },
            { label: "Наши номера", page: { type: "rooms" }   as PageState },
            { label: "Политика ПД", page: { type: "privacy" } as PageState },
          ].map(item => (
            <button key={item.label} onClick={() => go(item.page)} style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "13px 14px", borderRadius: 10, background: "none", border: "none",
              fontSize: 15, fontWeight: 600, color: C.navy, cursor: "pointer",
              transition: "background 150ms ease",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = C.skyPale)}
              onMouseLeave={e => (e.currentTarget.style.background = "none")}
            >
              {item.label}
              <span style={{ color: C.sky }}><IconChevronRight /></span>
            </button>
          ))}
        </nav>

        {/* Phones in drawer */}
        <div style={{ borderTop: `1px solid ${C.skyPale}`, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
          {PHONES.map(p => (
            <a key={p.href} href={p.href} style={{
              display: "flex", alignItems: "center", gap: 8, fontSize: 14,
              fontWeight: 500, color: C.sky, textDecoration: "none",
            }}>
              <span style={{ color: C.sky }}><IconPhone size={14} /></span>
              {p.label}
            </a>
          ))}
        </div>
      </aside>
    </>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ onNavigate }: { onNavigate: (p: PageState) => void }) {
  return (
    <footer style={{ background: C.sky, color: C.white, marginTop: "auto" }}>
      {/* Wave divider */}
      <div style={{ lineHeight: 0, overflow: "hidden" }}>
        <svg viewBox="0 0 1440 48" preserveAspectRatio="none" style={{ width: "100%", height: 48, display: "block" }}>
          <path fill={C.foam} d="M0,32 C360,0 720,48 1080,24 C1260,12 1380,36 1440,32 L1440,0 L0,0 Z" />
        </svg>
      </div>

      <div style={{ maxWidth: 1024, margin: "0 auto", padding: "32px 16px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 32, marginBottom: 32 }}>

          {/* Brand */}
          <div>
            <p style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>🍑 Абрикос</p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.72)", lineHeight: 1.6 }}>
              Мини-отель на берегу<br />Азовского моря, Ейск
            </p>
          </div>

          {/* Nav */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.55)", marginBottom: 12 }}>
              Навигация
            </p>
            {[
              { label: "Наши номера", page: { type: "rooms" }   as PageState },
              { label: "Политика ПД", page: { type: "privacy" } as PageState },
            ].map(item => (
              <button key={item.label} onClick={() => onNavigate(item.page)} style={{
                display: "block", background: "none", border: "none", color: "rgba(255,255,255,0.85)",
                fontSize: 14, cursor: "pointer", padding: "4px 0", transition: "color 150ms",
              }}
                onMouseEnter={e => (e.currentTarget.style.color = C.sun)}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.85)")}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Social */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.55)", marginBottom: 12 }}>
              Соцсети
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { label: "ВК",  href: "https://vk.com",    bg: "#4C75A3" },
                { label: "TG",  href: "https://t.me",       bg: "#229ED9" },
                { label: "Max", href: "https://max.ru",     bg: C.sun, color: C.navy },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{ width: 40, height: 40, borderRadius: 10, background: s.bg || C.skyLight,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 800, color: s.color || C.white, textDecoration: "none",
                    transition: "transform 150ms ease, box-shadow 150ms ease",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.25)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                  aria-label={s.label}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.18)", paddingTop: 20, display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 8 }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
            ООО «Комплексные мероприятия»
          </p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
            © 2026 Мини-отель Абрикос
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Page header strip ────────────────────────────────────────────────────────
function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{
      background: C.navy,
      paddingTop: 100, paddingBottom: 40, paddingLeft: 16, paddingRight: 16,
      borderBottom: `4px solid ${C.sun}`,
    }}>
      <div style={{ maxWidth: 1024, margin: "0 auto" }}>
        <h1 style={{
          fontSize: "clamp(30px,5vw,44px)", fontWeight: 800, color: C.white,
          lineHeight: 1.15, marginBottom: subtitle ? 10 : 0,
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.72)", maxWidth: 540, lineHeight: 1.6 }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Booking Widget ────────────────────────────────────────────────────────────
function BookingWidget() {
  return (
    <section id="booking-widget" style={{ background: C.skyPale, padding: "60px 16px" }}>
      <div style={{ maxWidth: 1024, margin: "0 auto" }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: C.navy, marginBottom: 6 }}>
          Онлайн-бронирование
        </h2>
        <p style={{ fontSize: 15, color: C.navyMid, marginBottom: 32 }}>
          Выберите даты и номер — подтвердим бронирование в течение часа.
        </p>

        <div style={{
          background: C.white, borderRadius: 18, minHeight: 380,
          border: `1.5px solid ${C.border}`,
          boxShadow: "0 4px 32px rgba(59,130,246,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {/* INSERT agast.ru widget script here */}
          <div style={{ textAlign: "center", padding: "48px 24px" }}>
            <div style={{ width: 64, height: 64, background: `linear-gradient(135deg,${C.sky},${C.skyLight})`,
              borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 18px", fontSize: 28 }}>
              🗓
            </div>
            <p style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 6 }}>
              Виджет бронирования agast.ru
            </p>
            <p style={{ fontSize: 14, color: C.navyMid, marginBottom: 22, lineHeight: 1.55 }}>
              Здесь размещается виджет системы бронирования.<br />
              Вставьте код от agast.ru для активации.
            </p>
            <a href="https://agast.ru" target="_blank" rel="noopener noreferrer"
              style={{ ...btnPrimary, textDecoration: "none" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
            >
              Перейти к бронированию <IconExternalLink />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Home Page ─────────────────────────────────────────────────────────────────
function HomePage({ onNavigate }: { onNavigate: (p: PageState) => void }) {
  return (
    <main>
      <PageHeader
        title="Мини-отель «Абрикос»"
        subtitle="Уютный отдых на берегу Азовского моря в Ейске — 7 номеров от стандарта до апартаментов."
      />

      {/* Chess blocks */}
      <div style={{ background: C.foam }}>
        {HOME_BLOCKS.map((block, i) => {
          const even = i % 2 === 0;
          return (
            <section key={i} style={{ maxWidth: 1024, margin: "0 auto", padding: "52px 16px" }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 48,
                alignItems: "center",
              }} className={`chess-row${i}`}>
                <div style={{ order: even ? 0 : 1 }}>
                  <h2 style={{ fontSize: 24, fontWeight: 800, color: C.navy, marginBottom: 14, lineHeight: 1.25 }}>
                    {block.heading}
                  </h2>
                  <p style={{ fontSize: 15, color: C.navy, lineHeight: 1.7, opacity: 0.85 }}>
                    {block.text}
                  </p>
                </div>
                <div style={{ order: even ? 1 : 0 }}>
                  <div style={{
                    borderRadius: 18, overflow: "hidden", background: C.skyPale,
                    aspectRatio: "4/3",
                    boxShadow: `0 6px 32px rgba(59,130,246,0.14)`,
                  }}>
                    <img src={block.imageUrl} alt={block.imageAlt}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block",
                        transition: "transform 400ms ease" }}
                      loading="lazy"
                      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
                      onMouseLeave={e => (e.currentTarget.style.transform = "none")}
                    />
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* CTA Banner */}
      <section style={{ background: C.skyPale, padding: "48px 16px" }}>
        <div style={{ maxWidth: 1024, margin: "0 auto" }}>
          <div style={{
            background: `linear-gradient(120deg, ${C.sky}, ${C.skyLight})`,
            borderRadius: 20, padding: "36px 40px",
            display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20,
            boxShadow: "0 6px 32px rgba(59,130,246,0.22)",
          }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: C.white, marginBottom: 4 }}>
                Посмотрите наши номера
              </h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
                7 вариантов размещения на любой вкус и бюджет.
              </p>
            </div>
            <button onClick={() => onNavigate({ type: "rooms" })}
              style={btnPrimary}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 5px 18px rgba(251,191,36,0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(251,191,36,0.35)"; }}
            >
              Все номера <IconChevronRight />
            </button>
          </div>
        </div>
      </section>

      <BookingWidget />

      <style>{`
        @media (max-width: 680px) {
          .chess-row0, .chess-row1, .chess-row2, .chess-row3 { grid-template-columns: 1fr !important; }
          .chess-row0 > *, .chess-row1 > *, .chess-row2 > *, .chess-row3 > * { order: 0 !important; }
        }
      `}</style>
    </main>
  );
}

// ─── Rooms Page ────────────────────────────────────────────────────────────────
function RoomsPage({ onNavigate }: { onNavigate: (p: PageState) => void }) {
  return (
    <main>
      <PageHeader
        title="Наши номера"
        subtitle="Выберите подходящий вариант размещения — от уютного стандарта до просторных апартаментов."
      />
      <section style={{ background: C.foam, padding: "52px 16px" }}>
        <div style={{ maxWidth: 1024, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 22 }}>
            {ROOMS.map(room => (
              <RoomCard key={room.id} room={room} onClick={() => onNavigate({ type: "room", id: room.id })} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function RoomCard({ room, onClick }: { room: Room; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <article
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.white, borderRadius: 16, overflow: "hidden", cursor: "pointer",
        border: `1.5px solid ${hovered ? C.skyLight : C.border}`,
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered ? "0 10px 32px rgba(59,130,246,0.16)" : "0 2px 12px rgba(59,130,246,0.07)",
        transition: "transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease",
      }}
    >
      {/* Image */}
      <div style={{ aspectRatio: "4/3", overflow: "hidden", background: C.skyPale }}>
        <img src={room.imageUrl} alt={room.name}
          style={{ width: "100%", height: "100%", objectFit: "cover",
            transform: hovered ? "scale(1.05)" : "none",
            transition: "transform 400ms ease" }}
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div style={{ padding: "18px 20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: C.navy }}>{room.name}</h2>
          <span style={{
            background: C.sky, color: C.white, fontSize: 12, fontWeight: 700,
            padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap",
          }}>
            {room.area} м²
          </span>
        </div>

        <p style={{ fontSize: 13, color: C.navyMid, marginBottom: 14 }}>{room.tagline}</p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: 16, fontWeight: 800, color: C.coral }}>{room.price}</p>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.sky, display: "flex", alignItems: "center", gap: 2 }}>
            Подробнее <IconChevronRight size={13} />
          </span>
        </div>
      </div>
    </article>
  );
}

// ─── Room Detail Page ──────────────────────────────────────────────────────────
function RoomDetailPage({ id, onNavigate }: { id: string; onNavigate: (p: PageState) => void }) {
  const room = ROOMS.find(r => r.id === id);
  const [activeImg, setActiveImg] = useState(0);

  if (!room) return (
    <main style={{ paddingTop: 100, textAlign: "center", color: C.navyMid }}>
      Номер не найден.{" "}
      <button onClick={() => onNavigate({ type: "rooms" })} style={{ color: C.sky, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
        Вернуться
      </button>
    </main>
  );

  const scrollToBooking = () => {
    onNavigate({ type: "home" });
    setTimeout(() => document.getElementById("booking-widget")?.scrollIntoView({ behavior: "smooth" }), 120);
  };

  const featureColor = (f: string) => {
    const l = f.toLowerCase();
    if (l.includes("wi-fi") || l.includes("wifi")) return { bg: "#EBF4FF", color: C.sky };
    if (l.includes("кондиц")) return { bg: "#EBF4FF", color: C.skyLight };
    if (l.includes("кухн") || l.includes("холод") || l.includes("мини-бар")) return { bg: "#ECFDF5", color: C.green };
    if (l.includes("балкон") || l.includes("вид")) return { bg: "#FFFBEB", color: "#D97706" };
    return { bg: C.skyPale, color: C.navyMid };
  };

  return (
    <main style={{ background: C.foam, minHeight: "100vh" }}>
      <PageHeader title={room.name} subtitle={room.tagline} />

      <div style={{ maxWidth: 1024, margin: "0 auto", padding: "40px 16px 64px" }}>
        {/* Back */}
        <button onClick={() => onNavigate({ type: "rooms" })} style={{
          display: "flex", alignItems: "center", gap: 6, background: "none", border: "none",
          fontSize: 14, color: C.sky, cursor: "pointer", marginBottom: 28, padding: "4px 0",
          fontWeight: 500, transition: "gap 150ms",
        }}
          onMouseEnter={e => (e.currentTarget.style.gap = "10px")}
          onMouseLeave={e => (e.currentTarget.style.gap = "6px")}
        >
          <IconArrowLeft /> Все номера
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }} className="detail-grid">
          {/* Gallery */}
          <div>
            <div style={{ borderRadius: 18, overflow: "hidden", background: C.skyPale, aspectRatio: "4/3",
              boxShadow: "0 6px 32px rgba(59,130,246,0.14)", marginBottom: 12 }}>
              <img src={room.gallery[activeImg]} alt={`${room.name} — фото ${activeImg + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity 200ms ease" }}
              />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {room.gallery.map((url, i) => (
                <button key={i} onClick={() => setActiveImg(i)} style={{
                  flex: 1, borderRadius: 10, overflow: "hidden", background: C.skyPale, aspectRatio: "4/3",
                  border: `2.5px solid ${activeImg === i ? C.sky : "transparent"}`,
                  cursor: "pointer", padding: 0, transition: "border-color 150ms",
                }}>
                  <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            {/* Stats bar */}
            <div style={{ display: "flex", gap: 20, background: C.skyPale, borderRadius: 14, padding: "16px 20px", marginBottom: 22 }}>
              <div>
                <p style={{ fontSize: 24, fontWeight: 800, color: C.sky }}>{room.area}<span style={{ fontSize: 14, fontWeight: 500 }}>м²</span></p>
                <p style={{ fontSize: 11, color: C.navyMid }}>площадь</p>
              </div>
              <div style={{ width: 1, background: C.border }} />
              <div>
                <p style={{ fontSize: 24, fontWeight: 800, color: C.sky }}>{room.capacity}</p>
                <p style={{ fontSize: 11, color: C.navyMid }}>гостей</p>
              </div>
              <div style={{ width: 1, background: C.border }} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{room.beds}</p>
                <p style={{ fontSize: 11, color: C.navyMid }}>тип кровати</p>
              </div>
            </div>

            <p style={{ fontSize: 15, color: C.navy, lineHeight: 1.7, marginBottom: 24, opacity: 0.88 }}>
              {room.description}
            </p>

            {/* Features */}
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.navyMid, marginBottom: 10 }}>
              Оснащение
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
              {room.features.map(f => {
                const { bg, color } = featureColor(f);
                return (
                  <span key={f} style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    background: bg, color, fontSize: 13, fontWeight: 500,
                    padding: "6px 12px", borderRadius: 8,
                  }}>
                    <IconCheck size={12} />
                    {f}
                  </span>
                );
              })}
            </div>

            {/* Price + CTA */}
            <div style={{
              background: `linear-gradient(120deg, ${C.sky}, ${C.skyLight})`,
              borderRadius: 16, padding: "22px 24px",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
              boxShadow: "0 4px 20px rgba(59,130,246,0.2)",
            }}>
              <div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.72)", marginBottom: 2 }}>Стоимость</p>
                <p style={{ fontSize: 24, fontWeight: 800, color: C.sun }}>{room.price}</p>
              </div>
              <button onClick={scrollToBooking} style={btnPrimary}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
              >
                Забронировать
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 680px) { .detail-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </main>
  );
}

// ─── Privacy Page ──────────────────────────────────────────────────────────────
function PrivacyPage() {
  const sections = [
    { title: "1. Общие положения", text: "Настоящая политика составлена в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных» и определяет порядок обработки персональных данных ООО «Комплексные мероприятия» (далее — Оператор)." },
    { title: "2. Оператор", text: "ООО «Комплексные мероприятия». Адрес: г. Ейск, Краснодарский край. Телефон: +7 (938) 000-00-00. Email: info@hotel-abricos.ru." },
    { title: "3. Цели обработки", text: "Исполнение договора на оказание услуг размещения; обратная связь с гостем (звонки, e-mail); информирование об акциях (с согласия субъекта); исполнение требований законодательства РФ." },
    { title: "4. Перечень данных", text: "Фамилия, имя, отчество; номер телефона; адрес электронной почты; паспортные данные для оформления проживания согласно требованиям ФМС; данные об оплате (без хранения реквизитов карты)." },
    { title: "5. Cookies и аналитика", text: "Сайт использует файлы cookie для улучшения работы и анализа посещаемости. Cookie не содержат персональных данных. Вы вправе отключить cookie в настройках браузера — это может повлиять на работу сайта." },
    { title: "6. Права субъекта", text: "Субъект вправе получать сведения об обработке своих данных, требовать уточнения, блокировки или уничтожения, отзывать согласие, обжаловать действия Оператора в Роскомнадзоре." },
    { title: "7. Хранение и защита", text: "Оператор применяет организационные и технические меры для защиты данных от неправомерного доступа. Срок хранения — не более 3 лет с последнего взаимодействия, если иное не предусмотрено законом." },
    { title: "8. Изменения политики", text: "Оператор вправе вносить изменения. Новая редакция вступает в силу с момента публикации. Действующая редакция: 01.01.2026." },
  ];
  return (
    <main style={{ background: C.foam, minHeight: "100vh" }}>
      <PageHeader title="Политика обработки персональных данных" />
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "48px 16px 72px" }}>
        <div style={{ background: C.white, borderRadius: 18, padding: "36px 40px", boxShadow: "0 2px 24px rgba(59,130,246,0.08)", border: `1px solid ${C.border}` }}>
          {sections.map((s, i) => (
            <div key={i} style={{ marginBottom: i < sections.length - 1 ? 28 : 0 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: C.sky, marginBottom: 8 }}>{s.title}</h2>
              <p style={{ fontSize: 15, color: C.navy, lineHeight: 1.7, opacity: 0.88 }}>{s.text}</p>
              {i < sections.length - 1 && <div style={{ marginTop: 28, height: 1, background: C.skyPale }} />}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

// ─── Cookie Banner ─────────────────────────────────────────────────────────────
function CookieBanner({ onAccept, onDecline }: { onAccept: () => void; onDecline: () => void }) {
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 60,
      background: C.navy, borderTop: `3px solid ${C.sky}`,
      padding: "16px 20px",
      boxShadow: "0 -4px 24px rgba(15,42,92,0.3)",
    }}>
      <div style={{ maxWidth: 1024, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16, justifyContent: "space-between" }}>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.88)", flex: 1, minWidth: 240, lineHeight: 1.55 }}>
          🍪 Мы используем файлы cookie для улучшения сайта. Продолжая использование, вы соглашаетесь с их применением.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onDecline} style={{ padding: "8px 18px", borderRadius: 9, background: "transparent",
            border: "1.5px solid rgba(255,255,255,0.3)", color: "rgba(255,255,255,0.8)",
            fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "border-color 150ms" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.7)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)")}
          >
            Отказаться
          </button>
          <button onClick={onAccept} style={btnPrimary}
            onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-1px)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "none")}
          >
            Принять
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<PageState>({ type: "home" });
  const [menuOpen, setMenuOpen] = useState(false);
  const [cookieDone, setCookieDone] = useState(() => {
    try { return !!localStorage.getItem("cookie-consent"); } catch { return false; }
  });

  const navigate = useCallback((p: PageState) => {
    setPage(p);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const acceptCookies = () => { try { localStorage.setItem("cookie-consent", "accepted"); } catch {} setCookieDone(true); };
  const declineCookies = () => { try { localStorage.setItem("cookie-consent", "declined"); } catch {} setCookieDone(true); };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: C.foam, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header onNavigate={navigate} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <BurgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={navigate} />

      <div style={{ flex: 1 }}>
        {page.type === "home"    && <HomePage    onNavigate={navigate} />}
        {page.type === "rooms"   && <RoomsPage   onNavigate={navigate} />}
        {page.type === "room"    && <RoomDetailPage id={page.id} onNavigate={navigate} />}
        {page.type === "privacy" && <PrivacyPage />}
      </div>

      <Footer onNavigate={navigate} />

      {!cookieDone && <CookieBanner onAccept={acceptCookies} onDecline={declineCookies} />}
    </div>
  );
}
