import { useState, useEffect, useRef } from "react";

// ─── PALETTE ─────────────────────────────────────────────────────────────────
// BG:      #000000   (pure black)
// RED:     #FC3D21   (NASA red — the only accent, used sparingly)
// WHITE:   #FFFFFF   (headings, bold values)
// MID:     #999999   (body text)
// DIM:     #555555   (labels, tertiary)
// GHOST:   #333333   (footer text, faintest)
// LINE:    rgba(255,255,255,0.08)  (borders, dividers)

const EXPERIENCE = [
  { company: "HARVIA", role: "CREATIVE DIRECTOR", location: "AUSTIN, TX", period: "JAN 2025 — PRESENT", year: 2025, active: true, outcomes: ["Oversee agency partnerships and serve as final approval on all content from external partners, influencers, and designers", "Led complete brand audit and refresh for Almost Heaven, modernizing visual identity and elevating market positioning", "Directing new product photography and video shoots, shaping how the brand shows up across all channels", "Pioneering AI integration across website and brand operations — finding where technology adds real value, not just novelty"] },
  { company: "MEDIA MONKS", role: "CREATIVE DIRECTOR", location: "LOS ANGELES, CA", period: "FEB 2024 — DEC 2024", year: 2024, outcomes: ["Led creative vision and execution for Disneylandia 2025 campaign — driving strategic and culturally resonant storytelling", "Creative leader across Kraft, T-Mobile, Capital One, and Disneyland, ensuring high-quality campaign deliverables", "Key role in securing new business, contributing to major pitches including Wells Fargo/Visa World Cup 2026"] },
  { company: "CRISPIN PORTER BOGUSKY", role: "CREATIVE DIRECTOR", location: "NEW YORK, NY", period: "NOV 2020 — OCT 2023", year: 2020, outcomes: ["Creative lead for complete rebranding of Buchanan's Whisky, overseeing strategy, design, and brand evolution", "Spearheaded the relaunch and developed integrated campaigns for both new and existing whisky products", "Directed and won multiple new business pitches, securing key accounts including Dropbox and Plackers"] },
  { company: "GSD&M", role: "ASSOCIATE CREATIVE DIRECTOR", location: "AUSTIN, TX", period: "NOV 2019 — NOV 2020", year: 2019, outcomes: ["Led integrated communications across social, TV, OLV, B2B, and B2C channels", "Oversaw the strategic launch of new products, ensuring cohesive brand messaging and market impact", "Creative lead in new business development — acquisition of Lone River Spirits and Fruit of the Loom"] },
  { company: "YETI", role: "ASSOCIATE CREATIVE DIRECTOR", location: "AUSTIN, TX", period: "NOV 2017 — NOV 2019", year: 2017, outcomes: ["Oversaw strategy and execution of social content, driving 30% increase in engagement and new product awareness", "Led organic content creation resulting in 40% uplift in brand interactions and stronger community engagement", "Curated brand storytelling with high-impact ambassadors, driving 25% increase in audience growth"] },
  { company: "HAVAS", role: "SENIOR ART DIRECTOR", location: "CHICAGO, IL", period: "NOV 2016 — OCT 2017", year: 2016, outcomes: ["Developed social media strategies for Moen, driving 30% increase in engagement across platforms", "Oversaw all digital and print deliverables for RJR Reynolds (Camel) across campaigns", "Produced and launched multiple video series driving 35% increase in audience engagement"] },
  { company: "GRUBHUB", role: "ART DIRECTOR", location: "CHICAGO, IL", period: "NOV 2014 — OCT 2016", year: 2014, outcomes: ["Led seasonal brand campaigns, driving +25% order frequency during key promotions", "Managed brand consistency across B2B and CRM, improving quality by 30%", "Directed OOH, social, email, and direct mail, boosting engagement +35%", "Oversaw Seamless creative, fueling +40% app installs in core markets"] },
];

const SYSTEMS = [
  { category: "COMMAND", items: ["Brand Identity", "Creative Direction", "Art Direction", "Creative Strategy", "Concept Development", "Storytelling"] },
  { category: "OPERATIONS", items: ["Team Building", "Creative Mentoring", "Project Management", "Cross-Functional Collaboration", "New Business"] },
  { category: "AI PAYLOAD", items: ["Gemini", "Claude", "Cursor", "Nano Banana", "React"] },
  { category: "ARSENAL", items: ["Adobe Suite", "Figma", "Canva", "React", "Cursor"] },
];

const TIMELINE = [...EXPERIENCE].reverse();

/* ─── HOOKS ────────────────────────────────────────────────────────────────── */

function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

function useCounter(target, dur, active) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let t0 = null;
    const step = (ts) => { if (!t0) t0 = ts; const p = Math.min((ts - t0) / dur, 1); setVal(Math.round(p * target)); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }, [active, target, dur]);
  return val;
}

/* ─── STAR FIELD — very subtle, calm ───────────────────────────────────────── */

function Stars() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext("2d");
    let raf;
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.3 + 0.2,
      o: Math.random() * 0.55 + 0.1,
      t: Math.random() * Math.PI * 2,
      s: Math.random() * 0.008 + 0.002,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      stars.forEach(s => {
        s.t += s.s;
        const op = s.o * (0.6 + 0.4 * Math.sin(s.t));
        ctx.beginPath();
        ctx.arc(s.x * c.width, s.y * c.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${op})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }} />;
}

/* ─── ORBITAL VISUALIZATION — SVG hero element ─────────────────────────────── */

function OrbitalVis() {
  return (
    <svg viewBox="0 0 400 400" style={{ width: "100%", maxWidth: 380, height: "auto" }}>
      {/* Orbit rings */}
      <ellipse cx="200" cy="200" rx="180" ry="60" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" transform="rotate(-12 200 200)" />
      <ellipse cx="200" cy="200" rx="130" ry="45" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" strokeDasharray="4 8" transform="rotate(8 200 200)" />
      <ellipse cx="200" cy="200" rx="80" ry="30" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" transform="rotate(-5 200 200)" />

      {/* Center point */}
      <circle cx="200" cy="200" r="4" fill="rgba(255,255,255,0.3)" />
      <circle cx="200" cy="200" r="1.5" fill="rgba(255,255,255,0.7)" />

      {/* Crosshair at center */}
      <line x1="188" y1="200" x2="212" y2="200" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
      <line x1="200" y1="188" x2="200" y2="212" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />

      {/* + markers */}
      <text x="148" y="157" fill="rgba(255,255,255,0.5)" fontSize="12" fontFamily="'Space Mono', monospace" textAnchor="middle">+</text>
      <text x="262" y="247" fill="rgba(255,255,255,0.4)" fontSize="12" fontFamily="'Space Mono', monospace" textAnchor="middle">+</text>

      {/* - markers */}
      <text x="315" y="185" fill="rgba(255,255,255,0.35)" fontSize="13" fontFamily="'Space Mono', monospace" textAnchor="middle">−</text>

      {/* ○ marker */}
      <circle cx="100" cy="213" r="5.5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />

      {/* Orbiting red dot — outer ring */}
      <g style={{ animation: "orbit 30s linear infinite", transformOrigin: "200px 200px" }}>
        <circle cx="380" cy="200" r="4" fill="#FC3D21" />
        <circle cx="380" cy="200" r="10" fill="rgba(252,61,33,0.2)" />
      </g>

      {/* Orbiting white dot — inner ring */}
      <g style={{ animation: "orbit 18s linear infinite reverse", transformOrigin: "200px 200px" }}>
        <circle cx="280" cy="200" r="2.5" fill="rgba(255,255,255,0.7)" />
      </g>

      {/* Small labels along orbits */}
      <text x="345" y="168" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="'Space Mono', monospace" letterSpacing="2">TRAJECTORY</text>
      <text x="55" y="240" fill="rgba(255,255,255,0.25)" fontSize="8" fontFamily="'Space Mono', monospace" letterSpacing="2">PERIAPSIS</text>
    </svg>
  );
}

/* ─── CAREER TIMELINE — horizontal waypoints ───────────────────────────────── */

function CareerTimeline() {
  const [ref, vis] = useReveal(0.2);
  return (
    <div ref={ref} style={{ padding: "80px 0", opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s ease" }}>
      <div style={{ position: "relative", overflowX: "auto", overflowY: "hidden", paddingBottom: 20, scrollbarWidth: "none" }}>
        <div style={{ display: "flex", alignItems: "flex-start", minWidth: 900, position: "relative", padding: "0 20px" }}>
          {/* Connecting line */}
          <div style={{ position: "absolute", top: 28, left: 20, right: 20, height: 1, background: "rgba(255,255,255,0.08)" }} />

          {TIMELINE.map((exp, i) => {
            const num = String(i + 1).padStart(3, "0");
            const isActive = exp.active;
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", minWidth: 120, opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(12px)", transition: `all 0.5s ease ${i * 0.08}s` }}>
                {/* Number */}
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#555", letterSpacing: 2, marginBottom: 10, fontWeight: 700 }}>{num}</div>

                {/* Dot */}
                <div style={{ width: isActive ? 12 : 10, height: isActive ? 12 : 10, borderRadius: "50%", background: isActive ? "#FC3D21" : "transparent", border: isActive ? "none" : "1.5px solid rgba(255,255,255,0.25)", boxShadow: isActive ? "0 0 12px rgba(252,61,33,0.4)" : "none", marginBottom: 14, position: "relative", zIndex: 1 }} />

                {/* Company */}
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: isActive ? "#fff" : "#888", letterSpacing: 1, textAlign: "center", lineHeight: 1.3, textTransform: "uppercase" }}>{exp.company}</div>

                {/* Role */}
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#555", marginTop: 4, textAlign: "center", letterSpacing: 1 }}>{exp.role.split(" ").slice(0, 2).join(" ")}</div>

                {/* Year */}
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#444", marginTop: 4 }}>{exp.year}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── SECTION LABEL ────────────────────────────────────────────────────────── */

function SectionLabel({ number, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 48 }}>
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#444", letterSpacing: 2, fontWeight: 700 }}>{number}</span>
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#555", letterSpacing: 5, textTransform: "uppercase" }}>{text}</span>
      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
    </div>
  );
}

/* ─── METRIC CALLOUT ───────────────────────────────────────────────────────── */

function Metric({ label, value, delay = 0 }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} style={{ marginBottom: 36, opacity: vis ? 1 : 0, transform: vis ? "translateX(0)" : "translateX(12px)", transition: `all 0.6s ease ${delay}s` }}>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 3, color: "#555", textTransform: "uppercase", marginBottom: 6, textAlign: "right" }}>{label}</div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 31, fontWeight: 700, color: "#fff", letterSpacing: 1, textAlign: "right" }}>{value}</div>
    </div>
  );
}

/* ─── EXPERIENCE CARD ──────────────────────────────────────────────────────── */

function ExpCard({ exp, index, expanded, toggle }) {
  const isOpen = expanded === index;
  const [ref, vis] = useReveal();
  return (
    <div
      ref={ref}
      onClick={() => toggle(index)}
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "28px 0",
        cursor: "pointer",
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(16px)",
        transition: `all 0.5s ease ${index * 0.05}s`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24 }}>
        <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flex: 1, flexWrap: "wrap" }}>
          {/* Period */}
          <div className="exp-period" style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#555", letterSpacing: 1, minWidth: 170, paddingTop: 6 }}>{exp.period}</div>

          <div>
            {/* Company + active dot */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 25, fontWeight: 700, color: "#fff", letterSpacing: 1 }}>{exp.company}</span>
              {exp.active && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FC3D21", boxShadow: "0 0 8px rgba(252,61,33,0.5)", display: "inline-block" }} />}
            </div>

            {/* Role + Location */}
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#777", letterSpacing: 2, marginTop: 6, textTransform: "uppercase" }}>
              {exp.role} &nbsp;·&nbsp; {exp.location}
            </div>
          </div>
        </div>

        {/* Toggle */}
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 25, color: "#555", transition: "transform 0.25s, color 0.2s", transform: isOpen ? "rotate(45deg)" : "rotate(0)", flexShrink: 0, lineHeight: 1, paddingTop: 4 }}>+</div>
      </div>

      {/* Expanded outcomes */}
      {isOpen && (
        <div style={{ marginTop: 20, paddingLeft: 172, animation: "fadeUp 0.3s ease both" }}>
          {exp.outcomes.map((o, j) => (
            <div key={j} style={{ display: "flex", gap: 12, fontSize: 18, color: "#999", lineHeight: 1.8, marginBottom: 4, animation: `fadeUp 0.25s ease ${j * 0.04}s both` }}>
              <span style={{ color: "#444", flexShrink: 0 }}>—</span>
              <span>{o}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

export default function NASAResume() {
  const [expanded, setExpanded] = useState(null);
  const toggle = (i) => setExpanded(expanded === i ? null : i);
  const [heroRef, heroVis] = useReveal(0.05);
  const [expRef, expVis] = useReveal();
  const [skillRef, skillVis] = useReveal();
  const [contactRef, contactVis] = useReveal();
  const years = useCounter(15, 1200, heroVis);

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#999", fontFamily: "'Inter', sans-serif", position: "relative", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=Space+Mono:wght@400;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes orbit{to{transform:rotate(360deg);}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
        @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
        @keyframes redLine{from{transform:scaleX(0);}to{transform:scaleX(1);}}
        ::-webkit-scrollbar{width:2px;}
        ::-webkit-scrollbar-track{background:#000;}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);}
        @media(max-width:768px){
          .hero-grid{grid-template-columns:1fr !important;text-align:center;}
          .hero-metrics{flex-direction:row !important;flex-wrap:wrap;justify-content:center;gap:32px;}
          .hero-orbital{order:-1;max-width:260px;margin:0 auto;}
          .exp-period{display:none !important;}
          .exp-outcomes{padding-left:0 !important;}
        }
      `}</style>

      <Stars />

      {/* ─── NAV ─────────────────────────────────────────────────────────────── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "18px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img src="/nasa-worm.svg" alt="NASA" style={{ height: 24, opacity: 0.9 }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 3, color: "#555", textTransform: "uppercase", borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: 16 }}>Creative Division</span>
        </div>
        <div style={{ display: "flex", gap: 28, fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 3, textTransform: "uppercase" }}>
          <span style={{ color: "#FC3D21" }}>Manifest</span>
          <span style={{ color: "#555" }}>Experience</span>
          <span style={{ color: "#555" }}>Systems</span>
          <span style={{ color: "#555" }}>Comms</span>
        </div>
      </nav>

      {/* ─── HERO ────────────────────────────────────────────────────────────── */}
      <section ref={heroRef} style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1, padding: "80px 40px" }}>
        <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "60px", maxWidth: 1200, width: "100%", alignItems: "center", opacity: heroVis ? 1 : 0, transform: heroVis ? "translateY(0)" : "translateY(30px)", transition: "all 1s ease" }}>

          {/* Left — Identity */}
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, letterSpacing: 4, color: "#555", marginBottom: 24, textTransform: "uppercase" }}>Crew Manifest // Creative Division</div>

            <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "clamp(56px, 8.5vw, 112px)", color: "#fff", lineHeight: 1, letterSpacing: "-1px", marginBottom: 12 }}>
              DIEGO<br />SAENZ
            </h1>

            {/* Red underline */}
            <div style={{ width: 50, height: 3, background: "#FC3D21", marginBottom: 28, animation: heroVis ? "redLine 0.6s ease 0.4s both" : "none", transformOrigin: "left" }} />

            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 14, letterSpacing: 4, color: "#777", textTransform: "uppercase", marginBottom: 8 }}>Creative Director</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 14, letterSpacing: 4, color: "#555", textTransform: "uppercase" }}>AI Developer</div>

            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#444", marginTop: 32, letterSpacing: 2 }}>
              AUSTIN, TX &nbsp;·&nbsp; {years > 0 ? years : 15}+ YRS
            </div>
          </div>

          {/* Center — Orbital visualization */}
          <div className="hero-orbital" style={{ opacity: heroVis ? 1 : 0, transition: "opacity 1.2s ease 0.3s" }}>
            <OrbitalVis />
          </div>

          {/* Right — Metrics */}
          <div className="hero-metrics" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <Metric label="Experience" value={`${years > 0 ? years : 15}+ Years`} delay={0.2} />
            <Metric label="Missions" value="007" delay={0.35} />
            <Metric label="Status" value="Active" delay={0.5} />
            <Metric label="Clearance" value="Open" delay={0.65} />
          </div>
        </div>
      </section>

      {/* ─── CAREER TIMELINE ─────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px", position: "relative", zIndex: 1 }}>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />
        <CareerTimeline />
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }} />
      </section>

      {/* ─── EXPERIENCE ──────────────────────────────────────────────────────── */}
      <section ref={expRef} style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 40px", position: "relative", zIndex: 1, opacity: expVis ? 1 : 0, transform: expVis ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease" }}>
        <SectionLabel number="001" text="Experience" />
        {EXPERIENCE.map((exp, i) => (
          <ExpCard key={exp.company} exp={exp} index={i} expanded={expanded} toggle={toggle} />
        ))}
      </section>

      {/* ─── PROFILE ─────────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px 100px", position: "relative", zIndex: 1 }}>
        <div ref={skillRef} style={{ opacity: skillVis ? 1 : 0, transform: skillVis ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease" }}>
          <SectionLabel number="002" text="Systems" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40 }}>
            {SYSTEMS.map((cat, ci) => (
              <div key={cat.category} style={{ opacity: skillVis ? 1 : 0, transform: skillVis ? "translateY(0)" : "translateY(12px)", transition: `all 0.5s ease ${ci * 0.1}s` }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 4, color: "#444", marginBottom: 16, textTransform: "uppercase", fontWeight: 700 }}>{cat.category}</div>
                {cat.items.map(item => (
                  <div key={item} style={{ fontSize: 18, color: "#888", lineHeight: 2.2 }}>{item}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT ─────────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px 120px", position: "relative", zIndex: 1 }}>
        <div ref={contactRef} style={{ opacity: contactVis ? 1 : 0, transform: contactVis ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease" }}>
          <SectionLabel number="003" text="Comms" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 40 }}>
            {[
              { label: "Direct Line", value: "630.414.8711" },
              { label: "Transmission", value: "diegosaenz02@gmail.com" },
              { label: "Coordinates", value: "Austin, Texas" },
              { label: "Portfolio", value: "itsmediego.com" },
            ].map((c, i) => (
              <div key={c.label} style={{ opacity: contactVis ? 1 : 0, transition: `all 0.5s ease ${i * 0.08}s` }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 3, color: "#444", textTransform: "uppercase", marginBottom: 8 }}>{c.label}</div>
                <div style={{ fontSize: 20, color: "#fff", fontWeight: 500 }}>{c.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer style={{ textAlign: "center", paddingBottom: 80, position: "relative", zIndex: 1 }}>
        <div style={{ width: 60, height: 1, background: "rgba(255,255,255,0.08)", margin: "0 auto 20px" }} />
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 4, color: "#333", textTransform: "uppercase" }}>
          NCD-2026 &nbsp;·&nbsp; NASA Creative Division &nbsp;·&nbsp; Classification: Open
        </div>
      </footer>
    </div>
  );
}
