import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Bot, Check, Globe2, Layers3, Menu, Network, Phone, ScanLine, Sparkles, X } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, useLocation, Router as WouterRouter } from "wouter";
import NotFound from "@/pages/not-found";
import "@/index.css";
import portraitAsset from "@assets/IMG_20260806_220625_177_1786632795287.jpg";
import logoAsset from "@assets/NOVORA_logo_design_concept_202608071446_1786632795339.jpeg";
import linkedinAsset from "@assets/Picsart_26-08-13_00-40-04-730_1786632795408.png";
import instagramAsset from "@assets/Picsart_26-08-13_00-40-53-233_1786632795464.png";
import githubAsset from "@assets/Picsart_26-08-13_00-42-04-411_1786632795529.png";

const queryClient = new QueryClient();
const portrait = portraitAsset;
const logo = logoAsset;
const CALENDLY_URL = "https://calendly.com/novara_agency/ai-consultation";
const WHATSAPP_URL = "https://wa.me/213560843444";
const EMAIL = "collabaivora@proton.me";
const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/rayane-mazari", src: linkedinAsset },
  { label: "Instagram", href: "https://www.instagram.com/agency_novora?igsh=MzlnaHIzcTMyamxz", src: instagramAsset },
  { label: "GitHub", href: "https://github.com/aivoraio", src: githubAsset },
];

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: .12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${visible ? "is-visible" : ""} ${className}`}>{children}</div>;
}

function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let start = 0;
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const startTime = performance.now();
      const tick = (time: number) => {
        const progress = Math.min((time - startTime) / 1200, 1);
        start = Math.round((1 - Math.pow(1 - progress, 3)) * value);
        setCount(start);
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      observer.disconnect();
    }, { threshold: .8 });
    observer.observe(node);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [value]);
  return <span ref={ref}>{count}{suffix}</span>;
}

function HeroField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: -1000, y: -1000 };
    let width = 0, height = 0, frame = 0;
    const count = reduced ? 24 : window.innerWidth < 768 ? 50 : window.innerWidth <= 1024 ? 80 : 175;
    const points = Array.from({ length: count }, (_, index) => ({
      x: Math.random(), y: Math.random(), size: 1 + Math.random() * 2.2,
      drift: .08 + Math.random() * .24, phase: index * 1.73, opacity: .18 + Math.random() * .35,
    }));
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth; height = canvas.clientHeight;
      canvas.width = width * ratio; canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const move = (event: PointerEvent) => { const box = canvas.getBoundingClientRect(); pointer.x = event.clientX - box.left; pointer.y = event.clientY - box.top; };
    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      const now = time * .001;
      const renderedPoints: Array<{ x: number; y: number }> = [];
      points.forEach((point, index) => {
        const x = point.x * width + Math.sin(now * point.drift + point.phase) * 28;
        const y = point.y * height - ((now * (4 + point.drift * 10) + point.phase * 14) % 100);
        const wrappedY = y < -10 ? y + height + 10 : y;
        const dx = pointer.x - x, dy = pointer.y - wrappedY, distance = Math.sqrt(dx * dx + dy * dy);
        const pull = distance < 190 ? (1 - distance / 190) * .16 : 0;
        const px = x + dx * pull, py = wrappedY + dy * pull;
        renderedPoints.push({ x: px, y: py });
        context.beginPath(); context.arc(px, py, point.size, 0, Math.PI * 2);
        context.fillStyle = `rgba(180,142,47,${point.opacity})`; context.fill();
        if (index % 4 === 0) {
          context.beginPath(); context.moveTo(px, py); context.lineTo(px + 50, py - 34);
          context.strokeStyle = "rgba(201,168,76,.11)"; context.lineWidth = .7; context.stroke();
        }
      });
      if (!reduced) {
        for (let i = 0; i < renderedPoints.length; i += 1) {
          for (let j = i + 1; j < renderedPoints.length; j += 1) {
            const a = renderedPoints[i], b = renderedPoints[j];
            const distance = Math.hypot(a.x - b.x, a.y - b.y);
            if (distance > 120) continue;
            context.beginPath(); context.moveTo(a.x, a.y); context.lineTo(b.x, b.y);
            context.strokeStyle = `rgba(201,168,76,${Math.max(.012, .045 * (1 - distance / 120))})`;
            context.lineWidth = .5; context.stroke();
          }
        }
      }
      if (!reduced) frame = requestAnimationFrame(draw);
    };
    resize(); window.addEventListener("resize", resize); window.addEventListener("pointermove", move, { passive: true });
    if (reduced) draw(0); else frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", move); };
  }, []);
  return <canvas ref={canvasRef} className="hero-field" aria-hidden="true" />;
}

function MagneticButton({ children, href, className = "" }: { children: ReactNode; href: string; className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const move = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const node = ref.current; if (!node) return;
    const box = node.getBoundingClientRect();
    node.style.transform = `translate(${(event.clientX - box.left - box.width / 2) * .12}px, ${(event.clientY - box.top - box.height / 2) * .12}px)`;
  };
  const leave = () => { if (ref.current) ref.current.style.transform = ""; };
  return <a ref={ref} href={href} className={`gold-button ${className}`} onPointerMove={move} onPointerLeave={leave}>{children}</a>;
}

function PageMeta({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  }, [title, description]);
  return null;
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const [location] = useLocation();
  const homePath = location === "/" ? "" : "/";
  const links = [["Vision", `${homePath}#about`], ["Expertise", `${homePath}#services`], ["Method", `${homePath}#method`], ["Founder", `${homePath}#founder`]];
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const previousHtmlOverflow = html.style.overflow;
    const previousHtmlOverscrollBehavior = html.style.overscrollBehavior;
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyOverscrollBehavior = document.body.style.overscrollBehavior;
    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    const menu = menuRef.current;
    const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    menu?.querySelector<HTMLElement>(".mobile-menu-close")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !menu) return;
      const focusable = Array.from(menu.querySelectorAll<HTMLElement>(focusableSelector));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      html.style.overflow = previousHtmlOverflow;
      html.style.overscrollBehavior = previousHtmlOverscrollBehavior;
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.overscrollBehavior = previousBodyOverscrollBehavior;
      window.removeEventListener("keydown", onKeyDown);
      menuToggleRef.current?.focus();
    };
  }, [open]);

  const closeMenu = () => setOpen(false);
  const jump = (id: string) => { closeMenu(); document.querySelector(id)?.scrollIntoView({ behavior: "smooth" }); };
  return <>
    <header className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="container-n nav-inner">
        <a href={`${homePath}#top`} className="brand" aria-label="Novora home" onClick={(event) => { if (location === "/") { event.preventDefault(); jump("#top"); } }}>
          <img src={logo} className="brand-mark" alt="Novora monogram" loading="eager" /><span className="brand-word">NOVORA</span>
        </a>
        <nav className="nav-links">{links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav>
        <a className="nav-cta" href={CALENDLY_URL} target="_blank" rel="noreferrer"><Phone size={16} aria-hidden="true" /> Book a Call <ArrowUpRight size={14} aria-hidden="true" /></a>
        <button ref={menuToggleRef} className={`menu-toggle ${open ? "menu-toggle-hidden" : ""}`} type="button" aria-label="Open menu" aria-expanded={open} tabIndex={open ? -1 : 0} onClick={() => setOpen(!open)}><Menu size={22} /></button>
      </div>
    </header>
    {createPortal(
      <>
        <button className={`menu-backdrop ${open ? "is-open" : ""}`} type="button" aria-label="Close menu" aria-hidden={!open} tabIndex={-1} onClick={closeMenu} onTouchMove={(event) => event.preventDefault()} />
        <nav ref={menuRef} className={`mobile-menu ${open ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Mobile navigation" aria-hidden={!open}>
          <button className="mobile-menu-close" type="button" aria-label="Close menu" onClick={closeMenu}><X size={22} /></button>
          {links.map(([label, href]) => <a key={href} href={href} onClick={closeMenu}>{label}</a>)}
          <a href={CALENDLY_URL} target="_blank" rel="noreferrer" onClick={closeMenu}><Phone size={16} aria-hidden="true" /> Book a Call <ArrowUpRight size={14} aria-hidden="true" /></a>
        </nav>
      </>,
      document.body,
    )}
  </>;
}

function SocialLinks({ footer = false }: { footer?: boolean }) {
  return <div className={`socials ${footer ? "footer-socials" : "about-socials"}`} aria-label="Social links">
    {socialLinks.map((social) => <a className="social" href={social.href} target="_blank" rel="noreferrer" aria-label={social.label} key={social.label}>
      <img src={social.src} alt="" loading="lazy" />
      <span>{social.label}</span>
    </a>)}
  </div>;
}

const services = [
  { no: "01", title: "Intelligent systems", copy: "AI workflows that take the repetitive out of ambitious operations — and give teams room to think.", icon: Bot, meta: "Automation / Agents" },
  { no: "02", title: "Digital worlds", copy: "Websites and interfaces with a point of view: fast, expressive, and built to become part of the brand.", icon: Globe2, meta: "Web / Experience" },
  { no: "03", title: "Signal & story", copy: "A considered content engine for founders and teams who want to be remembered, not just seen.", icon: ScanLine, meta: "Content / Social" },
  { no: "04", title: "Future prototypes", copy: "From the first useful sketch to a living product. We turn a sharp idea into something people can touch.", icon: Layers3, meta: "Strategy / Build" },
];

function Services() {
  const [viewportRef, api] = useEmblaCarousel({ align: "center", loop: true, breakpoints: { "(min-width: 801px)": { slidesToScroll: 1 } } });
  const [selected, setSelected] = useState(0);
  useEffect(() => {
    if (!api) return;
    const update = () => setSelected(api.selectedScrollSnap());
    update(); api.on("select", update); return () => { api.off("select", update); };
  }, [api]);
  return <div className="services-wrap">
    <div className="services-viewport" ref={viewportRef}><div className="services-container">
      {services.map((service, index) => {
        const Icon = service.icon;
        const offset = ((index - selected + services.length + services.length / 2) % services.length) - services.length / 2;
        const position = offset === 0 ? "is-active" : offset < 0 ? "is-prev" : "is-next";
        return <div className={`service-slide ${position}`} key={service.no}>
        <article className="service-card"><div><div className="service-top"><span className="service-index">{service.no} / 04</span><Icon className="service-icon" size={23} strokeWidth={1.4} /></div><h3>{service.title}</h3><p>{service.copy}</p></div><div className="service-meta"><span>{service.meta}</span><ArrowUpRight size={15} /></div></article>
      </div>;
      })}
    </div></div>
    <div className="carousel-controls"><span className="carousel-count">0{selected + 1} <span style={{ color: "#d0c4ac" }}>/ 04</span></span><div className="control-pair"><button className="icon-button" type="button" aria-label="Previous service" onClick={() => api?.scrollPrev()}><ArrowLeft size={16} /></button><button className="icon-button" type="button" aria-label="Next service" onClick={() => api?.scrollNext()}><ArrowRight size={16} /></button></div></div>
  </div>;
}

function Footer() {
  return <footer className="footer">
    <div className="container-n">
      <div className="footer-top">
        <div className="footer-brand">
          <a href="/#top" className="brand" aria-label="Novora home">
            <img src={logo} className="brand-mark footer-brand-mark" alt="Novora monogram" loading="lazy" />
            <span className="brand-word">NOVORA</span>
          </a>
          <p className="footer-copy">Creative technology for people with somewhere interesting to go.</p>
           <a className="footer-cta" href={CALENDLY_URL} target="_blank" rel="noreferrer"><Phone size={16} aria-hidden="true" /> Book a Call <ArrowUpRight size={14} aria-hidden="true" /></a>
          <SocialLinks footer />
        </div>
        <div className="footer-nav">
          <div><h4>Explore</h4><a href="/#about">Point of view</a><a href="/#services">The studio</a><a href="/#method">How we work</a><a href="/#founder">Meet the founder</a></div>
          <div><h4>Connect</h4><a href={WHATSAPP_URL} target="_blank" rel="noreferrer">WhatsApp</a><a href={`mailto:${EMAIL}`}>{EMAIL}</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div>
        </div>
      </div>
      <div className="footer-bottom"><span>© 2026 NOVORA Agency. All rights reserved.</span><span>Made with AI &amp; <span className="heart" aria-label="love">♥</span> by Rayane Mazari (AIVORA)</span></div>
    </div>
  </footer>;
}

function LegalPage({ kind }: { kind: "privacy" | "terms" }) {
  const isPrivacy = kind === "privacy";
  const title = isPrivacy ? "Privacy Policy | NOVORA" : "Terms of Service | NOVORA";
  const description = isPrivacy
    ? "Read how NOVORA handles information shared through this website and its booking and contact services."
    : "The terms that guide conversations and engagements with NOVORA, an AI-powered digital agency.";
  return <div className="novora-page legal-page" id="top">
    <PageMeta title={title} description={description} />
    <Navbar />
    <main className="legal-main">
      <div className="container-n legal-container">
        <span className="eyebrow">NOVORA / {isPrivacy ? "Privacy" : "Terms"}</span>
        <h1>{isPrivacy ? "Privacy, plainly." : "Terms of engagement."}</h1>
        <p className="legal-intro">{isPrivacy ? "A clear, human summary of how Novora treats information shared through this site." : "A simple starting point for working together with Novora."}</p>
        <div className="legal-copy">
          <h2>{isPrivacy ? "Information we receive" : "Using this website"}</h2>
           <p>Novora may receive information you choose to share when you contact the studio, book a call, or interact with this website. This can include your name, email address, message, booking details, and basic technical information needed to keep the site secure and usable.</p>
          <h2>{isPrivacy ? "How we use it" : "Working together"}</h2>
           <p>{isPrivacy ? "We use that information to respond to your request, coordinate a conversation, provide agreed services, improve the experience, and protect the website. We keep it only for as long as it is reasonably needed for those purposes and do not sell personal information." : "A proposal, statement of work, or other written agreement will define the scope, deliverables, timing, fees, and responsibilities for a paid engagement. Until then, conversations and concepts are exploratory and do not create an obligation to begin work."}</p>
          <h2>{isPrivacy ? "Your choices" : "Content and links"}</h2>
           <p>{isPrivacy ? <>You can ask what information Novora holds about you, request an update, or ask for it to be removed by emailing <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. External services such as Calendly, WhatsApp, and social networks have their own policies and terms.</> : <>Please use this website and Novora materials lawfully, do not attempt to disrupt the service, and only share materials you have the right to provide. Links to Calendly, WhatsApp, social networks, or other third-party services are provided for convenience and are governed by those services' own terms.</>}</p>
          <p className="legal-date">Last updated: August 2026</p>
        </div>
      </div>
    </main>
    <Footer />
  </div>;
}

function Home() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => { const max = document.documentElement.scrollHeight - window.innerHeight; setProgress(max ? window.scrollY / max : 0); };
    window.addEventListener("scroll", update, { passive: true }); update(); return () => window.removeEventListener("scroll", update);
  }, []);
  const portraitMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const node = event.currentTarget.querySelector(".portrait-shell") as HTMLElement | null;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce), (max-width: 767px)").matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    node.style.transform = `perspective(900px) rotateY(${((event.clientX - box.left) / box.width - .5) * 12}deg) rotateX(${((event.clientY - box.top) / box.height - .5) * -8}deg)`;
  }, []);
  const portraitLeave = (event: React.PointerEvent<HTMLDivElement>) => { const node = event.currentTarget.querySelector(".portrait-shell") as HTMLElement | null; if (node) node.style.transform = ""; };
  return <div className="novora-page" id="top">
     <PageMeta title="NOVORA | AI-Powered Digital Agency - Rayane Mazari (AIVORA)" description="Transform your business with AI automation, websites, videos & social media. Book your free 15-min consultation." />
    <div className="progress-line" style={{ width: `${progress * 100}%` }} /><Navbar />
    <main>
      <section className="hero"><HeroField /><div className="hero-grid" /><div className="container-n hero-layout">
        <div className="hero-copy">
          <Reveal><div className="hero-kicker"><span className="kicker-dot" /><span className="eyebrow">Independent creative technology studio</span></div></Reveal>
          <Reveal className="delay-1"><h1>Building the <span className="future display">future</span>,<br /><span className="quiet">one idea</span> at a time.</h1></Reveal>
            <Reveal className="delay-2"><p className="hero-sub">Novora is where intelligent technology meets a distinctly human point of view. We make ambitious ideas useful, beautiful, and real.</p><div className="hero-actions"><MagneticButton href={CALENDLY_URL}><Phone size={16} aria-hidden="true" /> Book Your Free 15-Min Call <ArrowUpRight size={16} aria-hidden="true" /></MagneticButton><a className="text-link" href="#about">Read our point of view <ArrowUpRight size={15} aria-hidden="true" /></a></div><div className="hero-note"><ArrowDown size={14} /> Scroll to explore</div></Reveal>
        </div>
        <div className="hero-orbit" onPointerMove={portraitMove} onPointerLeave={portraitLeave}>
          <div className="orbit-ring" /><div className="orbit-ring ring-two" />
           <div className="portrait-shell"><img src={portrait} alt="Rayane Mazari, founder of Novora" loading="eager" fetchPriority="high" decoding="async" /><div className="portrait-caption"><strong>Rayane Mazari</strong><span>Founder / Builder</span></div></div>
          <div className="signal-card top"><Sparkles size={18} /><div><span>Studio status</span><b>Making what’s next</b></div></div>
          <div className="signal-card bottom"><Network size={18} /><div><span>Coordinates</span><b>Design × Intelligence</b></div></div>
        </div>
      </div></section>
      <section className="stats-band"><div className="container-n stats">{[["10", "+", "Websites shipped"], ["3", "+", "AI systems built"], ["2", "+", "Years in the work"], ["100", "%", "Founder-led"]].map(([num, suffix, label]) => <div className="stat" key={label}><div className="stat-number"><CountUp value={Number(num)} suffix={suffix} /></div><div className="stat-label">{label}</div></div>)}</div></section>
        <section className="section paper" id="about" aria-labelledby="about-title"><div className="container-n manifesto"><Reveal><div className="manifesto-index">01 — Point of view</div></Reveal><Reveal className="delay-1"><div className="manifesto-copy"><h2 id="about-title">Technology should feel <em>inevitable.</em></h2><p>Not louder. Not more complicated. The best tools disappear into the way people already think and work. We pair careful design with practical AI to create that feeling — a new capability that feels like it was always meant to be there.</p><div className="signature-line">Human curiosity, engineered clearly.</div><MagneticButton href={CALENDLY_URL} className="about-cta"><Phone size={16} aria-hidden="true" /> Book a Call <ArrowUpRight size={15} aria-hidden="true" /></MagneticButton></div></Reveal></div></section>
      <section className="section ivory" id="services"><div className="container-n"><Reveal><div className="section-head"><div><span className="eyebrow">02 — The studio</span><h2>A small team for <span className="serif-italic gold-text">large</span> possibilities.</h2></div><p>Focused engagements, sharp thinking, and the fluency to move from a conversation to a working prototype.</p></div></Reveal><Reveal className="delay-1"><Services /></Reveal></div></section>
      <section className="section paper" id="method"><div className="container-n"><Reveal><div className="section-head"><div><span className="eyebrow">03 — How we work</span><h2>Clarity before <span className="serif-italic gold-text">complexity.</span></h2></div><p>Every Novora engagement has a beginning, a build, and a reason. No theatre. Just momentum you can feel.</p></div></Reveal><div className="method-grid"><Reveal><article className="method"><span className="method-number">01 / LISTEN</span><Sparkles className="method-icon" size={19} /><h3>Find the live wire.</h3><p>We start with the friction, the desire, and the odd little detail everyone else overlooks.</p></article></Reveal><Reveal className="delay-1"><article className="method"><span className="method-number">02 / FRAME</span><ScanLine className="method-icon" size={19} /><h3>Make the invisible clear.</h3><p>A focused direction replaces a sprawling brief. We define what matters before we make anything.</p></article></Reveal><Reveal className="delay-2"><article className="method"><span className="method-number">03 / BUILD</span><Bot className="method-icon" size={19} /><h3>Ship the first useful thing.</h3><p>Small, testable, alive. Our prototypes earn their next step by being useful on day one.</p></article></Reveal><Reveal className="delay-3"><article className="method"><span className="method-number">04 / TUNE</span><Check className="method-icon" size={19} /><h3>Leave it better.</h3><p>We refine the edges, document the thinking, and hand over systems that keep giving.</p></article></Reveal></div></div></section>
       <section className="section ivory" id="founder"><div className="container-n founder-layout"><Reveal><div className="founder-visual"><div className="orbit-ring" /><div className="portrait-shell"><img src={portrait} alt="Portrait of Rayane Mazari" loading="lazy" decoding="async" /><div className="portrait-caption"><strong>Rayane Mazari</strong><span>Founder / Creative technologist</span></div></div></div></Reveal><Reveal className="delay-1"><div className="founder-copy"><span className="eyebrow">04 — Behind Novora</span><h2>Built by someone who still <em>gets curious.</em></h2><p>Rayane Mazari started Novora to close the distance between a good idea and its first real expression. He works across design, code, and emerging intelligence — close enough to the details to keep the original spark intact.</p><div className="founder-quote">“The future is not a place we arrive at. It is a material we learn to shape.”</div><a className="text-link" href={`mailto:${EMAIL}?subject=Hello%20Novora`}>Write to Rayane <ArrowUpRight size={15} /></a><SocialLinks /></div></Reveal></div></section>
        <section className="contact" id="contact"><div className="container-n"><Reveal><span className="eyebrow">05 — A useful next step</span><h2>Have an idea<br />worth <em className="serif-italic">building?</em></h2><p>Tell us what you are making, what is getting in the way, or simply what you cannot stop thinking about.</p><div className="contact-actions"><MagneticButton href={CALENDLY_URL}><Phone size={16} aria-hidden="true" /> Book Your Free Call Now <ArrowUpRight size={16} aria-hidden="true" /></MagneticButton><div className="contact-links"><a className="text-link" href={WHATSAPP_URL} target="_blank" rel="noreferrer">WhatsApp <ArrowUpRight size={15} /></a><a className="text-link" href={`mailto:${EMAIL}`}>{EMAIL} <ArrowUpRight size={15} /></a></div></div></Reveal></div></section>
    </main>
     <Footer />
  </div>;
}

function Router() {
  return <ErrorBoundary resetKey={useLocation()[0]}><Switch><Route path="/" component={Home} /><Route path="/privacy"><LegalPage kind="privacy" /></Route><Route path="/terms"><LegalPage kind="terms" /></Route><Route component={NotFound} /></Switch></ErrorBoundary>;
}
function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}
export default App;