import { useState, useEffect, useRef } from "react";

// ─── NASA PALETTE ────────────────────────────────────────────────────────────
// BG:         #0B1026  (deep space)
// NASA BLUE:  #0B3D91  (primary brand)
// NASA BLUE+: #1E56B0  (lighter interactive)
// NASA RED:   #FC3D21  (alert accent — used sparingly)
// TEXT-HI:    #E8ECF1  (headings)
// TEXT-MID:   #8B9FC0  (body)
// TEXT-LO:    #4A6180  (labels, tertiary)
// BORDER:     #1A2A4A  (lines, dividers)
// CARD-BG:    rgba(8,16,40,0.85)

const EXPERIENCE = [
  { id: "MSN-007", company: "HARVIA", role: "CREATIVE DIRECTOR", location: "AUSTIN, TX", period: "JAN 2025 — PRESENT", status: "ACTIVE", outcomes: ["Oversee agency partnerships and serve as final approval on all content from external partners, influencers, and designers", "Led complete brand audit and refresh for Almost Heaven, modernizing visual identity and elevating market positioning", "Directing new product photography and video shoots, shaping how the brand shows up across all channels", "Pioneering AI integration across website and brand operations — finding where technology adds real value, not just novelty"] },
  { id: "MSN-006", company: "MEDIA MONKS", role: "CREATIVE DIRECTOR", location: "LOS ANGELES, CA", period: "FEB 2024 — DEC 2024", status: "COMPLETE", outcomes: ["Led creative vision and execution for Disneylandia 2025 campaign — driving strategic and culturally resonant storytelling", "Creative leader across Kraft, T-Mobile, Capital One, and Disneyland, ensuring high-quality campaign deliverables", "Key role in securing new business, contributing to major pitches including Wells Fargo/Visa World Cup 2026"] },
  { id: "MSN-005", company: "CRISPIN PORTER BOGUSKY", role: "CREATIVE DIRECTOR", location: "NEW YORK, NY", period: "NOV 2020 — OCT 2023", status: "COMPLETE", outcomes: ["Creative lead for complete rebranding of Buchanan's Whisky, overseeing strategy, design, and brand evolution", "Spearheaded the relaunch and developed integrated campaigns for both new and existing whisky products", "Directed and won multiple new business pitches, securing key accounts including Dropbox and Plackers"] },
  { id: "MSN-004", company: "GSD&M", role: "ASSOCIATE CREATIVE DIRECTOR", location: "AUSTIN, TX", period: "NOV 2019 — NOV 2020", status: "COMPLETE", outcomes: ["Led integrated communications across social, TV, OLV, B2B, and B2C channels", "Oversaw the strategic launch of new products, ensuring cohesive brand messaging and market impact", "Creative lead in new business development — acquisition of Lone River Spirits and Fruit of the Loom"] },
  { id: "MSN-003", company: "YETI", role: "ASSOCIATE CREATIVE DIRECTOR", location: "AUSTIN, TX", period: "NOV 2017 — NOV 2019", status: "COMPLETE", outcomes: ["Oversaw strategy and execution of social content, driving 30% increase in engagement and new product awareness", "Led organic content creation resulting in 40% uplift in brand interactions and stronger community engagement", "Curated brand storytelling with high-impact ambassadors, driving 25% increase in audience growth"] },
  { id: "MSN-002", company: "HAVAS", role: "SENIOR ART DIRECTOR", location: "CHICAGO, IL", period: "NOV 2016 — OCT 2017", status: "COMPLETE", outcomes: ["Developed social media strategies for Moen, driving 30% increase in engagement across platforms", "Oversaw all digital and print deliverables for RJR Reynolds (Camel) across campaigns", "Produced and launched multiple video series driving 35% increase in audience engagement"] },
  { id: "MSN-001", company: "GRUBHUB", role: "ART DIRECTOR", location: "CHICAGO, IL", period: "NOV 2014 — OCT 2016", status: "COMPLETE", outcomes: ["Led seasonal brand campaigns, driving +25% order frequency during key promotions", "Managed brand consistency across B2B and CRM, improving quality by 30%", "Directed OOH, social, email, and direct mail, boosting engagement +35%", "Oversaw Seamless creative, fueling +40% app installs in core markets"] },
];

const SYSTEMS = [
  { category: "COMMAND", items: ["Brand Identity", "Creative Direction", "Art Direction", "Creative Strategy", "Concept Development", "Storytelling"] },
  { category: "OPERATIONS", items: ["Team Building", "Creative Mentoring", "Project Management", "Cross-Functional Collaboration", "New Business"] },
  { category: "AI PAYLOAD", items: ["Gemini", "Claude", "Cursor", "Nano Banana", "React"] },
  { category: "ARSENAL", items: ["Adobe Suite", "Figma", "Canva", "React", "Cursor"] },
];

/* ─── HOOKS ────────────────────────────────────────────────────────────────── */

function useScrollReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.07 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function useCounter(target, dur, active) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let t0 = null;
    const fn = (ts) => { if (!t0) t0 = ts; const p = Math.min((ts - t0) / dur, 1); setVal(Math.round(p * target)); if (p < 1) requestAnimationFrame(fn); };
    requestAnimationFrame(fn);
  }, [active, target, dur]);
  return val;
}

/* ─── STAR FIELD + ORBITAL PATHS ───────────────────────────────────────────── */

function StarField() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 300 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.0 + 0.15,
      o: Math.random() * 0.5 + 0.08,
      t: Math.random() * Math.PI * 2,
      s: Math.random() * 0.012 + 0.002,
      blue: Math.random() < 0.2,
    }));

    // Orbital paths — slow ellipses
    const orbits = [
      { cx: 0.7, cy: 0.3, rx: 0.25, ry: 0.08, rot: -0.15, speed: 0.0003, dot: 0, opacity: 0.08 },
      { cx: 0.3, cy: 0.6, rx: 0.18, ry: 0.06, rot: 0.3, speed: -0.0004, dot: Math.PI, opacity: 0.06 },
      { cx: 0.5, cy: 0.15, rx: 0.32, ry: 0.04, rot: 0.05, speed: 0.00025, dot: Math.PI / 2, opacity: 0.05 },
    ];

    const shoots = [];
    let nextShoot = Date.now() + 1200;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const W = canvas.width, H = canvas.height, now = Date.now();

      if (now > nextShoot) {
        shoots.push({ x: Math.random() * 0.7, y: Math.random() * 0.4, dx: 0.003 + Math.random() * 0.004, dy: 0.002 + Math.random() * 0.002, life: 1, decay: 0.04 + Math.random() * 0.05, len: 0.06 + Math.random() * 0.08 });
        nextShoot = now + Math.random() * 3500 + 1500;
      }

      // Stars
      stars.forEach(s => {
        s.t += s.s;
        const op = s.o * (0.5 + 0.5 * Math.sin(s.t));
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.blue ? `rgba(80,130,220,${op})` : `rgba(200,210,230,${op})`;
        ctx.fill();
      });

      // Orbital paths
      orbits.forEach(o => {
        o.dot += o.speed;
        ctx.save();
        ctx.translate(o.cx * W, o.cy * H);
        ctx.rotate(o.rot);
        // Ellipse path
        ctx.beginPath();
        ctx.ellipse(0, 0, o.rx * W, o.ry * H, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(11,61,145,${o.opacity})`;
        ctx.lineWidth = 0.8;
        ctx.setLineDash([4, 8]);
        ctx.stroke();
        ctx.setLineDash([]);
        // Orbiting dot
        const dx = Math.cos(o.dot) * o.rx * W;
        const dy = Math.sin(o.dot) * o.ry * H;
        ctx.beginPath();
        ctx.arc(dx, dy, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(11,61,145,0.6)`;
        ctx.fill();
        // Dot glow
        const g = ctx.createRadialGradient(dx, dy, 0, dx, dy, 8);
        g.addColorStop(0, "rgba(11,61,145,0.3)");
        g.addColorStop(1, "rgba(11,61,145,0)");
        ctx.beginPath(); ctx.arc(dx, dy, 8, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
        ctx.restore();
      });

      // Shooting stars
      for (let i = shoots.length - 1; i >= 0; i--) {
        const sh = shoots[i]; sh.x += sh.dx; sh.y += sh.dy; sh.life -= sh.decay;
        if (sh.life <= 0) { shoots.splice(i, 1); continue; }
        const x1 = sh.x * W, y1 = sh.y * H, x0 = (sh.x - sh.len) * W, y0 = (sh.y - sh.len * 0.5) * H;
        const g = ctx.createLinearGradient(x0, y0, x1, y1);
        g.addColorStop(0, "rgba(255,255,255,0)");
        g.addColorStop(0.7, `rgba(180,200,255,${sh.life * 0.5})`);
        g.addColorStop(1, `rgba(255,255,255,${sh.life * 0.9})`);
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
        ctx.strokeStyle = g; ctx.lineWidth = 1; ctx.stroke();
        ctx.beginPath(); ctx.arc(x1, y1, 1.4 * sh.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${sh.life * 0.85})`; ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }} />;
}

/* ─── ORBIT INDICATOR (replaces radar) ─────────────────────────────────────── */

function OrbitIndicator() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; const ctx = canvas.getContext("2d"); let raf, angle = 0;
    const S = 80; canvas.width = S; canvas.height = S;
    const cx = S / 2, cy = S / 2;
    const draw = () => {
      ctx.clearRect(0, 0, S, S);
      angle += 0.012;
      // Outer ring
      ctx.beginPath(); ctx.arc(cx, cy, 36, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(11,61,145,0.3)"; ctx.lineWidth = 1; ctx.stroke();
      // Inner ring
      ctx.beginPath(); ctx.arc(cx, cy, 20, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(11,61,145,0.15)"; ctx.lineWidth = 0.5; ctx.stroke();
      // Center dot (planet)
      ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#0B3D91"; ctx.fill();
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 8);
      cg.addColorStop(0, "rgba(11,61,145,0.4)"); cg.addColorStop(1, "rgba(11,61,145,0)");
      ctx.beginPath(); ctx.arc(cx, cy, 8, 0, Math.PI * 2); ctx.fillStyle = cg; ctx.fill();
      // Orbiting satellite 1
      const x1 = cx + Math.cos(angle) * 36, y1 = cy + Math.sin(angle) * 18;
      ctx.beginPath(); ctx.arc(x1, y1, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "#FC3D21"; ctx.fill();
      // Trail
      for (let i = 1; i <= 8; i++) {
        const ta = angle - i * 0.08;
        const tx = cx + Math.cos(ta) * 36, ty = cy + Math.sin(ta) * 18;
        ctx.beginPath(); ctx.arc(tx, ty, 1.5 * (1 - i / 10), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(252,61,33,${0.3 * (1 - i / 10)})`; ctx.fill();
      }
      // Orbiting satellite 2 (opposite, slower)
      const x2 = cx + Math.cos(-angle * 0.6) * 28, y2 = cy + Math.sin(-angle * 0.6) * 28;
      ctx.beginPath(); ctx.arc(x2, y2, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(200,210,230,0.6)"; ctx.fill();
      // Cross-hairs
      ctx.strokeStyle = "rgba(11,61,145,0.12)"; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(cx - 36, cy); ctx.lineTo(cx + 36, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy - 36); ctx.lineTo(cx, cy + 36); ctx.stroke();
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} width={80} height={80} style={{ display: "block" }} />;
}

/* ─── MISSION CONTROL BOOT SEQUENCE (intro) ────────────────────────────────── */

function BootSequence({ onComplete }) {
  const [lines, setLines] = useState([]);
  const [logoVis, setLogoVis] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const bootLines = [
    { text: "NASA PERSONNEL SYSTEM v4.2.1", delay: 0 },
    { text: "INITIALIZING SECURE CONNECTION...", delay: 400 },
    { text: "AUTHENTICATION: ██████████ GRANTED", delay: 900 },
    { text: "LOADING CREW MANIFEST...", delay: 1400 },
    { text: "STATUS: ALL SYSTEMS NOMINAL", delay: 1800 },
  ];

  useEffect(() => {
    const timers = [];
    bootLines.forEach((line, i) => {
      timers.push(setTimeout(() => setLines(prev => [...prev, line.text]), line.delay));
    });
    timers.push(setTimeout(() => setLogoVis(true), 2200));
    timers.push(setTimeout(() => setFadeOut(true), 3400));
    timers.push(setTimeout(onComplete, 4000));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999, background: "#0B1026",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'Space Mono', monospace", opacity: fadeOut ? 0 : 1,
      transition: "opacity 0.6s ease-out",
    }}>
      <div style={{ width: 420, maxWidth: "90vw" }}>
        {lines.map((line, i) => (
          <div key={i} style={{
            fontSize: 11, letterSpacing: 1.5, color: i === 4 ? "#4ADE80" : "#8B9FC0",
            marginBottom: 8, animation: "bootLine 0.3s ease-out both",
            fontFamily: "'Space Mono', monospace",
          }}>
            <span style={{ color: "#0B3D91", marginRight: 8 }}>▸</span>{line}
          </div>
        ))}
      </div>
      {logoVis && (
        <div style={{ marginTop: 40, textAlign: "center", animation: "nasaLogoIn 0.8s ease-out both" }}>
          {/* NASA Chevron — stylized */}
          <svg width="80" height="66" viewBox="0 0 80 66" fill="none" style={{ marginBottom: 16 }}>
            <path d="M40 0L80 66H64L40 24L16 66H0L40 0Z" fill="#0B3D91" opacity="0.9"/>
            <path d="M40 16L68 66H56L40 36L24 66H12L40 16Z" fill="#FC3D21" opacity="0.7"/>
            <ellipse cx="40" cy="38" rx="30" ry="6" stroke="#E8ECF1" strokeWidth="1.2" opacity="0.4" fill="none"/>
          </svg>
          <div style={{ fontSize: 9, letterSpacing: 6, color: "#4A6180", fontFamily: "'Space Mono', monospace" }}>
            NATIONAL AERONAUTICS AND SPACE ADMINISTRATION
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── TELEMETRY TICKER ─────────────────────────────────────────────────────── */

function TelemetryTicker() {
  const msg = "  ◆  CREW MANIFEST // CLASSIFICATION: OPEN  ◆  NASA CREATIVE DIVISION  ◆  DOCUMENT REF: NCD-2026-0042  ◆  AUTHORIZATION LEVEL: PUBLIC  ◆  JOHNSON SPACE CENTER // HOUSTON, TX  ◆  ";
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(11,16,38,0.95)", borderBottom: "1px solid rgba(11,61,145,0.25)", overflow: "hidden", height: 20, display: "flex", alignItems: "center" }}>
      <span style={{ display: "inline-block", whiteSpace: "nowrap", fontSize: 8, letterSpacing: 2, color: "rgba(11,61,145,0.6)", fontFamily: "'Space Mono', monospace", animation: "tickRoll 40s linear infinite" }}>{msg}{msg}{msg}</span>
    </div>
  );
}

/* ─── TYPING LABEL ─────────────────────────────────────────────────────────── */

function TypewriterLabel({ text, visible }) {
  const [out, setOut] = useState("");
  useEffect(() => {
    if (!visible) return;
    let i = 0;
    const iv = setInterval(() => { if (i <= text.length) { setOut(text.slice(0, i)); i++; } else clearInterval(iv); }, 28);
    return () => clearInterval(iv);
  }, [visible, text]);
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, letterSpacing: 4, color: "#0B3D91", textTransform: "uppercase", marginBottom: 16, minHeight: 20, fontWeight: 600 }}>
      {out}{out.length < text.length && <span style={{ color: "rgba(11,61,145,0.6)" }}>▌</span>}
    </div>
  );
}

/* ─── STATUS DOT ───────────────────────────────────────────────────────────── */

function StatusDot({ active }) {
  return (
    <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", marginRight: 8, position: "relative", verticalAlign: "middle" }}>
      <span style={{ position: "absolute", inset: 0, background: active ? "#FC3D21" : "#0B3D91", borderRadius: "50%", boxShadow: active ? "0 0 8px rgba(252,61,33,0.6)" : "0 0 6px rgba(11,61,145,0.5)" }} />
      {active && [0, 1].map((_, i) => {
        const d = `${i * 0.8}s`;
        return <span key={i} style={{ position: "absolute", borderRadius: "50%", border: "1px solid rgba(252,61,33,0.5)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", animation: `pRing 2.4s ${d} ease-out infinite` }} />;
      })}
    </span>
  );
}

/* ─── BLINK CURSOR ─────────────────────────────────────────────────────────── */

function BlinkCursor() {
  const [v, setV] = useState(true);
  useEffect(() => { const i = setInterval(() => setV(p => !p), 530); return () => clearInterval(i); }, []);
  return <span style={{ opacity: v ? 1 : 0, color: "#0B3D91" }}>█</span>;
}

/* ─── MISSION CARD ─────────────────────────────────────────────────────────── */

function MissionCard({ exp, index, expanded, toggle }) {
  const isOpen = expanded === index;
  const [ref, vis] = useScrollReveal();
  return (
    <div ref={ref} className={`mcard${vis ? " mcard--vis" : ""}`} style={{ animationDelay: `${index * 0.06}s` }} onClick={() => toggle(index)}>
      <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: isOpen ? "linear-gradient(180deg,#FC3D21,rgba(252,61,33,0.2))" : exp.status === "ACTIVE" ? "linear-gradient(180deg,#FC3D21,rgba(252,61,33,0.15))" : "linear-gradient(180deg,rgba(11,61,145,0.4),transparent)", transition: "background .3s" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 8, letterSpacing: 2, color: "#4A6180", fontFamily: "'Space Mono', monospace" }}>{exp.id}</span>
            {exp.status === "ACTIVE" && <span style={{ fontSize: 7, letterSpacing: 2, color: "#FC3D21", background: "rgba(252,61,33,0.08)", padding: "2px 6px", border: "1px solid rgba(252,61,33,0.2)", fontFamily: "'Space Mono', monospace" }}>● ACTIVE</span>}
          </div>
          <div style={{ fontSize: 10, color: "#0B3D91", letterSpacing: 2, fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>{exp.role}</div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, color: "#E8ECF1", marginTop: 4, fontFamily: "'Inter', sans-serif" }}>{exp.company}</div>
          <div style={{ fontSize: 9, color: "#4A6180", marginTop: 4, letterSpacing: 1, fontFamily: "'Space Mono', monospace" }}>{exp.location} &nbsp;·&nbsp; {exp.period}</div>
        </div>
        <div style={{ width: 22, height: 22, border: "1px solid rgba(11,61,145,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#0B3D91", transition: "transform .25s, background .2s", transform: isOpen ? "rotate(45deg)" : "rotate(0)", background: isOpen ? "rgba(11,61,145,0.1)" : "transparent", flexShrink: 0 }}>+</div>
      </div>
      {isOpen && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(11,61,145,0.15)", animation: "bIn .3s ease-out" }}>
          {exp.outcomes.map((o, j) => (
            <div key={j} style={{ display: "flex", gap: 10, fontSize: 12, color: "#8B9FC0", lineHeight: 1.7, marginBottom: 6, animation: `oIn .25s ease-out ${j * 0.06}s both` }}>
              <span style={{ color: "#0B3D91", flexShrink: 0, marginTop: 2 }}>▹</span><span>{o}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── MAIN COMPONENT ───────────────────────────────────────────────────────── */

export default function NASAResume() {
  const [expanded, setExpanded] = useState(null);
  const [introGone, setIntroGone] = useState(false);
  const toggle = (i) => setExpanded(expanded === i ? null : i);
  const [profileRef, profileVis] = useScrollReveal();
  const [logRef, logVis] = useScrollReveal();
  const [sysRef, sysVis] = useScrollReveal();
  const [commsRef, commsVis] = useScrollReveal();
  const yearsVal = useCounter(14, 1100, profileVis);

  return (
    <div style={{ minHeight: "100vh", background: "#0B1026", color: "#8B9FC0", fontFamily: "'Inter', sans-serif", position: "relative", overflowX: "hidden", cursor: "crosshair" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=Space+Mono:wght@400;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}

        /* Grid — blue tinted */
        .grid-bg{position:fixed;top:0;left:0;right:0;bottom:0;
          background-image:
            linear-gradient(rgba(11,61,145,.02) 1px,transparent 1px),
            linear-gradient(90deg,rgba(11,61,145,.02) 1px,transparent 1px);
          background-size:52px 52px;z-index:1;pointer-events:none;}

        /* Scanlines */
        .scanlines{position:fixed;top:0;left:0;right:0;bottom:0;
          background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.04) 2px,rgba(0,0,0,.04) 4px);
          z-index:1;pointer-events:none;}

        /* Top edge glow — NASA blue */
        .top-glow{position:fixed;top:20px;left:0;right:0;height:1px;
          background:linear-gradient(90deg,transparent,rgba(11,61,145,0.7),rgba(252,61,33,0.3),rgba(11,61,145,0.7),transparent);
          z-index:10;animation:glowPulse 5s ease-in-out infinite;}
        @keyframes glowPulse{0%,100%{opacity:.35;transform:scaleX(.7);}50%{opacity:.85;transform:scaleX(1);}}

        /* Scan beam */
        .scan-beam{position:fixed;left:0;right:0;height:1px;
          background:rgba(11,61,145,0.06);z-index:9;pointer-events:none;
          animation:scanBeam 12s linear infinite;}
        @keyframes scanBeam{0%{top:20px;opacity:1;}85%{opacity:.3;}100%{top:100vh;opacity:0;}}

        /* Boot sequence */
        @keyframes bootLine{from{opacity:0;transform:translateX(-8px);}to{opacity:1;transform:translateX(0);}}
        @keyframes nasaLogoIn{from{opacity:0;transform:scale(0.85) translateY(10px);}to{opacity:1;transform:scale(1) translateY(0);}}

        @keyframes tickRoll{from{transform:translateX(0);}to{transform:translateX(-33.33%);}}

        .content{position:relative;z-index:2;max-width:860px;margin:0 auto;padding:64px 24px 80px;}

        /* Name — clean, bold, institutional */
        .nasa-name{position:relative;display:block;font-family:'Inter',sans-serif;
          font-size:clamp(36px,7vw,72px);font-weight:900;letter-spacing:2px;line-height:1.05;
          color:#E8ECF1;margin-bottom:6px;}
        .nasa-name::after{content:'';position:absolute;bottom:-4px;left:0;width:60px;height:3px;
          background:linear-gradient(90deg,#FC3D21,transparent);border-radius:2px;}

        .header-in{animation:headerSlide .55s ease-out both;}
        @keyframes headerSlide{from{opacity:0;transform:translateY(-16px);}to{opacity:1;transform:translateY(0);}}

        .divider{height:1px;
          background:linear-gradient(90deg,#0B3D91,rgba(11,61,145,0.2),transparent);
          margin-bottom:48px;animation:divGrow .9s ease-out .25s both;transform-origin:left;}
        @keyframes divGrow{from{transform:scaleX(0);opacity:0;}to{transform:scaleX(1);opacity:1;}}

        @keyframes pRing{0%{width:7px;height:7px;opacity:.85;}100%{width:28px;height:28px;opacity:0;}}

        .reveal{opacity:0;transform:translateY(20px);transition:opacity .45s ease,transform .45s ease;}
        .reveal--vis{opacity:1;transform:translateY(0);}

        /* Mission cards */
        .mcard{border:1px solid rgba(11,61,145,0.18);background:rgba(8,16,40,0.85);
          backdrop-filter:blur(10px);padding:20px 24px;margin-bottom:10px;
          position:relative;cursor:pointer;opacity:0;transform:translateX(28px);
          transition:border-color .2s,box-shadow .2s,transform .15s;overflow:hidden;}
        .mcard::after{content:'';position:absolute;inset:0;
          background:linear-gradient(90deg,rgba(11,61,145,0.04),transparent);
          opacity:0;transition:opacity .2s;pointer-events:none;}
        .mcard:hover::after{opacity:1;}
        .mcard:hover{border-color:rgba(11,61,145,0.4);
          box-shadow:0 0 20px rgba(11,61,145,0.1),inset 0 0 12px rgba(11,61,145,0.02);
          transform:translateX(4px);}
        .mcard:active{transform:translateX(7px) scale(.997);}
        .mcard--vis{animation:cardIn .4s ease-out forwards;}
        @keyframes cardIn{to{opacity:1;transform:translateX(0);}}
        @keyframes bIn{from{opacity:0;transform:translateY(-6px);}to{opacity:1;transform:translateY(0);}}
        @keyframes oIn{from{opacity:0;transform:translateX(-6px);}to{opacity:1;transform:translateX(0);}}

        /* Skill cards */
        .skill-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;}
        .sk-card{border:1px solid rgba(11,61,145,0.15);background:rgba(6,12,30,0.7);
          padding:16px;transition:border-color .2s,transform .2s,box-shadow .2s;
          animation:skIn .4s ease-out both;}
        .sk-card:hover{border-color:rgba(11,61,145,0.4);transform:translateY(-4px);
          box-shadow:0 8px 24px rgba(0,0,0,0.3);}
        @keyframes skIn{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
        .sk-tag{display:inline-block;font-size:10px;color:#8B9FC0;
          border:1px solid rgba(11,61,145,0.2);padding:3px 8px;margin:3px 3px 3px 0;
          background:rgba(11,61,145,0.04);
          transition:background .15s,color .15s,border-color .15s,transform .1s;}
        .sk-tag:hover{background:rgba(11,61,145,0.12);color:#E8ECF1;
          border-color:rgba(11,61,145,0.4);transform:scale(1.05);}

        /* Contact cards */
        .ct-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;}
        .ct-card{border:1px solid rgba(11,61,145,0.18);background:rgba(8,16,40,0.7);
          padding:16px;transition:border-color .2s,box-shadow .2s,transform .2s;
          animation:ccIn .4s ease-out both;}
        .ct-card:hover{border-color:rgba(11,61,145,0.4);
          box-shadow:0 6px 18px rgba(0,0,0,0.3);transform:translateY(-3px);}
        @keyframes ccIn{from{opacity:0;scale:.96;}to{opacity:1;scale:1;}}

        .stat-item{animation:statFade .4s ease-out both;}
        @keyframes statFade{from{opacity:0;transform:translateX(-8px);}to{opacity:1;transform:translateX(0);}}

        .profile-box{border:1px solid rgba(11,61,145,0.18);border-left:3px solid #0B3D91;
          background:rgba(8,16,40,0.75);padding:22px 24px;
          font-size:13px;line-height:1.85;color:#8B9FC0;
          animation:pbIn .5s ease-out both;}
        @keyframes pbIn{from{opacity:0;transform:translateX(-10px);}to{opacity:1;transform:translateX(0);}}

        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-track{background:#0B1026;}
        ::-webkit-scrollbar-thumb{background:rgba(11,61,145,0.5);}
      `}</style>

      {!introGone && <BootSequence onComplete={() => setIntroGone(true)} />}
      <StarField />
      <div className="grid-bg" />
      <div className="scanlines" />
      <div className="scan-beam" />
      {introGone && <TelemetryTicker />}
      <div className="top-glow" />
      <div style={{ position: "fixed", top: 30, right: 20, zIndex: 50, opacity: 0.85 }}><OrbitIndicator /></div>

      <div className="content">

        {/* HEADER */}
        <div className="header-in" style={{ marginBottom: 52 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
            <div style={{ fontSize: 9, letterSpacing: 4, color: "rgba(11,61,145,0.8)", fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>CREW MANIFEST // CREATIVE DIVISION</div>
            <div style={{ fontSize: 9, letterSpacing: 2, color: "#4A6180", fontFamily: "'Space Mono', monospace" }}>REF: NCD-2026 // CM-001</div>
          </div>

          {/* Red chevron accent line */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <svg width="16" height="12" viewBox="0 0 16 12"><path d="M0 12L8 0L16 12H12L8 5L4 12Z" fill="#FC3D21" opacity="0.7"/></svg>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(252,61,33,0.3), transparent)" }} />
          </div>

          <span className="nasa-name">DIEGO SAENZ</span>

          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(9px,1.8vw,11px)", letterSpacing: 5, color: "#0B3D91", marginBottom: 28, marginTop: 18, fontWeight: 700 }}>
            CREATIVE DIRECTOR / AI DEVELOPER &nbsp;<BlinkCursor />
          </div>

          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", fontSize: 11, color: "#4A6180", fontFamily: "'Space Mono', monospace" }}>
            {[{ icon: "◆", label: "AUSTIN, TEXAS", d: "0s" }, { icon: "◆", label: `${yearsVal > 0 ? yearsVal : "14"}+ YEARS ACTIVE`, d: ".1s" }].map(s => (
              <span key={s.label} className="stat-item" style={{ animationDelay: s.d }}>
                <span style={{ color: "#0B3D91", marginRight: 6 }}>{s.icon}</span>{s.label}
              </span>
            ))}
            <span className="stat-item" style={{ animationDelay: ".2s" }}>
              <StatusDot active={true} /><span style={{ color: "#FC3D21", fontSize: 10, letterSpacing: 2 }}>MISSION READY</span>
            </span>
          </div>
        </div>

        <div className="divider" />

        {/* 01 — MISSION BRIEF */}
        <div ref={profileRef} className={`reveal${profileVis ? " reveal--vis" : ""}`} style={{ marginBottom: 56 }}>
          <TypewriterLabel text="01 // Mission Brief" visible={profileVis} />
          {profileVis && (
            <div className="profile-box">
              Creative director with <strong style={{ color: "#E8ECF1" }}>{yearsVal}+ years</strong> leading brand-defining campaigns for global companies.
              Specialized in turning complex brand challenges into compelling visual narratives.
              Currently pioneering AI-integrated creative workflows — building tools that amplify human creativity, not replace it.
              Equal parts strategist, maker, and team builder.
            </div>
          )}
        </div>

        {/* 02 — MISSION LOG */}
        <div ref={logRef} className={`reveal${logVis ? " reveal--vis" : ""}`} style={{ marginBottom: 56 }}>
          <TypewriterLabel text="02 // Mission Log" visible={logVis} />
          {EXPERIENCE.map((exp, i) => (
            <MissionCard key={exp.id} exp={exp} index={i} expanded={expanded} toggle={toggle} />
          ))}
        </div>

        {/* 03 — SYSTEMS DIAGNOSTIC */}
        <div ref={sysRef} className={`reveal${sysVis ? " reveal--vis" : ""}`} style={{ marginBottom: 56 }}>
          <TypewriterLabel text="03 // Systems Diagnostic" visible={sysVis} />
          {sysVis && (
            <div className="skill-grid">
              {SYSTEMS.map((cat, ci) => (
                <div key={cat.category} className="sk-card" style={{ animationDelay: `${ci * 0.08}s` }}>
                  <div style={{ fontSize: 8, letterSpacing: 3, color: "#0B3D91", marginBottom: 10, fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>{cat.category}</div>
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {cat.items.map(item => <span key={item} className="sk-tag">{item}</span>)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 04 — COMMS ARRAY */}
        <div ref={commsRef} className={`reveal${commsVis ? " reveal--vis" : ""}`} style={{ marginBottom: 56 }}>
          <TypewriterLabel text="04 // Comms Array" visible={commsVis} />
          {commsVis && (
            <div className="ct-grid">
              {[{ label: "DIRECT LINE", value: "630.414.8711", icon: "◇" }, { label: "TRANSMISSION", value: "diegosaenz02@gmail.com", icon: "◇" }, { label: "COORDINATES", value: "Austin, Texas", icon: "◇" }, { label: "PORTFOLIO", value: "itsmediego.com", icon: "◇" }].map((c, i) => (
                <div key={c.label} className="ct-card" style={{ animationDelay: `${i * 0.07}s` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <span style={{ color: "#0B3D91", fontSize: 10 }}>{c.icon}</span>
                    <span style={{ fontSize: 8, letterSpacing: 3, color: "#4A6180", fontFamily: "'Space Mono', monospace" }}>{c.label}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#E8ECF1", lineHeight: 1.5, fontFamily: "'Inter', sans-serif" }}>{c.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 1, background: "linear-gradient(90deg, transparent, rgba(11,61,145,0.3))" }} />
            <svg width="20" height="16" viewBox="0 0 16 12"><path d="M0 12L8 0L16 12H12L8 5L4 12Z" fill="#0B3D91" opacity="0.4"/></svg>
            <div style={{ width: 40, height: 1, background: "linear-gradient(90deg, rgba(11,61,145,0.3), transparent)" }} />
          </div>
          <div style={{ fontSize: 9, letterSpacing: 4, color: "#4A6180", fontFamily: "'Space Mono', monospace" }}>
            NCD-2026 // NASA CREATIVE DIVISION // CREW MANIFEST // CLASSIFICATION: OPEN
          </div>
        </div>
      </div>
    </div>
  );
}
