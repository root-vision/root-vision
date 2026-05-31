"use client";
import { useEffect, useRef, useState, useCallback } from "react";

function seeded(s: number) { return ((Math.sin(s+1)*43758.5453)%1+1)%1; }

// ── SVG Logos ─────────────────────────────────────────────────
const YouTubeSVG = () => (
  <svg viewBox="0 0 90 63" fill="none" style={{width:52,height:36}}>
    <rect width="90" height="63" rx="14" fill="#FF0000"/>
    <path d="M37 44V19l26 12.5L37 44Z" fill="white"/>
  </svg>
);
const TelegramSVG = () => (
  <svg viewBox="0 0 48 48" fill="none" style={{width:44,height:44}}>
    <circle cx="24" cy="24" r="24" fill="#29B6F6"/>
    <path d="M10 23.5l5.5 2 2 6.5 3-3.5 6 4.5 7-19-23.5 9.5Z" fill="white" opacity="0.6"/>
    <path d="M10 23.5l23.5-9.5-7 19-6-4.5 3.5-5-14 0Z" fill="white"/>
  </svg>
);
const MediumSVG = () => (
  <svg viewBox="0 0 195 113" fill="none" style={{width:64,height:37}}>
    <ellipse cx="56" cy="56.5" rx="56" ry="56.5" fill="white"/>
    <ellipse cx="149" cy="68" rx="22" ry="45" fill="white"/>
    <ellipse cx="185" cy="56.5" rx="10" ry="56.5" fill="white"/>
  </svg>
);
const GitHubSVG = () => (
  <svg viewBox="0 0 98 96" fill="none" style={{width:44,height:44}}>
    <path fillRule="evenodd" clipRule="evenodd" d="M49 0C21.9 0 0 22 0 49.2c0 21.7 14 40.1 33.4 46.6 2.4.5 3.3-1.1 3.3-2.4v-8.4c-13.5 3-16.3-6.5-16.3-6.5-2.2-5.6-5.4-7.1-5.4-7.1-4.4-3 .3-3 .3-3 4.9.4 7.4 5 7.4 5 4.3 7.4 11.3 5.3 14 4 .4-3.1 1.7-5.3 3-6.5-10.7-1.2-22-5.4-22-24 0-5.3 1.9-9.6 5-13-.5-1.2-2.2-6.2.5-12.9 0 0 4.1-1.3 13.4 5 3.9-1.1 8-1.6 12.2-1.6 4.1 0 8.3.5 12.2 1.6 9.3-6.3 13.4-5 13.4-5 2.7 6.7 1 11.7.5 12.9 3.1 3.4 5 7.7 5 13 0 18.6-11.3 22.7-22.1 23.9 1.7 1.5 3.3 4.5 3.3 9v13.3c0 1.3.9 2.9 3.3 2.4C84 89.3 98 70.9 98 49.2 98 22 76.1 0 49 0Z" fill="white"/>
  </svg>
);
const InstagramSVG = () => (
  <svg viewBox="0 0 48 48" fill="none" style={{width:44,height:44}}>
    <defs>
      <radialGradient id="ig1" cx="30%" cy="107%" r="150%">
        <stop offset="0%" stopColor="#fdf497"/>
        <stop offset="45%" stopColor="#fd5949"/>
        <stop offset="60%" stopColor="#d6249f"/>
        <stop offset="90%" stopColor="#285AEB"/>
      </radialGradient>
    </defs>
    <rect width="48" height="48" rx="12" fill="url(#ig1)"/>
    <circle cx="24" cy="24" r="8" stroke="white" strokeWidth="2.5" fill="none"/>
    <circle cx="35" cy="13" r="2" fill="white"/>
    <rect x="6" y="6" width="36" height="36" rx="10" stroke="white" strokeWidth="2.5" fill="none"/>
  </svg>
);

const SOCIALS = [
  { platform:"YouTube",  handle:"@Root_Vision",        desc:"Penetration testing, hacking tutorials, CTF yechimlar. Real hujumlar — real bilim.",                    link:"https://www.youtube.com/@Root_Vision",          Logo:YouTubeSVG,  accent:"#FF0000", bg:"rgba(255,0,0,0.06)",     border:"rgba(255,0,0,0.22)" },
  { platform:"Telegram", handle:"root_vision_channel", desc:"Eng yangi zaifliklar, kiber xavfsizlik yangiliklari va jamoa. Har kuni yangi signal.",                   link:"https://t.me/root_vision_channel",              Logo:TelegramSVG, accent:"#29B6F6", bg:"rgba(41,182,246,0.06)",  border:"rgba(41,182,246,0.22)" },
  { platform:"Medium",   handle:"@rootvition",         desc:"Chuqur texnik tahlil. Exploit tadqiqotlari. Zaiflik anatomiyasi. O'qish — bu ham qurol.",               link:"https://medium.com/@rootvition",                Logo:MediumSVG,   accent:"#ffffff", bg:"rgba(255,255,255,0.04)", border:"rgba(255,255,255,0.15)" },
  { platform:"GitHub",   handle:"root-vision",         desc:"Ochiq kodlar. Tools, scripts, PoC exploits. Bilim yashirilmaydi — u tarqatiladi.",                     link:"https://github.com/root-vision",                Logo:GitHubSVG,   accent:"#ffffff", bg:"rgba(255,255,255,0.04)", border:"rgba(255,255,255,0.15)" },
  { platform:"Instagram",handle:"root.vision",         desc:"Kiber estetika. Texnik grafika. Root Vision dunyosining vizual qatlami.",                               link:"https://www.instagram.com/root.vision/",        Logo:InstagramSVG,accent:"#d6249f", bg:"rgba(214,36,159,0.06)",  border:"rgba(214,36,159,0.22)" },
];

// ── Star physics ──────────────────────────────────────────────
const N_STARS = 680;
// Star colors — Hubble palette: white, warm yellow, orange, blue-white, red
const STAR_COLORS = [
  [255,255,255],   // pure white
  [255,255,220],   // warm white
  [255,240,180],   // yellow-white
  [255,200,100],   // golden
  [255,160,60],    // orange
  [200,220,255],   // blue-white
  [180,200,255],   // cool blue
  [255,120,80],    // red-orange
];
type Star = { ox:number; oy:number; x:number; y:number; vx:number; vy:number; baseZ:number; size:number; op:number; dur:number; del:number; lit:number; colorIdx:number; };

function makeStars(loop: number): Star[] {
  return Array.from({length:N_STARS},(_,i)=>({
    ox:(seeded(i*13)-0.5)*4200, oy:(seeded(i*17)-0.5)*4200,
    x:(seeded(i*13)-0.5)*4200,  y:(seeded(i*17)-0.5)*4200,
    vx:0, vy:0,
    baseZ:-seeded(i*31)*loop,
    size: i%40===0 ? 3.5+seeded(i*3)*3   // big bright stars
        : i%12===0 ? 2.0+seeded(i*5)*2   // medium
        : 0.6+seeded(i*7)*1.8,            // small
    op: i%40===0 ? 0.85+seeded(i*19)*0.15
      : i%12===0 ? 0.65+seeded(i*19)*0.3
      : 0.35+seeded(i*19)*0.55,
    dur:1.5+seeded(i*23)*5,
    del:seeded(i*41)*6,
    lit:0,
    colorIdx: Math.floor(seeded(i*97)*STAR_COLORS.length),
  }));
}

const Z_GAP   = 900;
const CAM_SPD = 2.6;
const N_ITEMS = SOCIALS.length + 1; // 5 cards + 1 ROOT VISION
const LOOP    = N_ITEMS * Z_GAP;

export default function Home() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const starsRef     = useRef<Star[]>([]);
  const scrollSmooth = useRef(0);
  const targetScroll = useRef(0);
  const velSmooth    = useRef(0);
  const mouseRef     = useRef({x:0,y:0,sx:0,sy:0}); // sx/sy = screen coords
  const rafRef       = useRef(0);

  const [scroll,  setScroll]  = useState(0);
  const [vel,     setVel]     = useState(0);
  const [mounted, setMounted] = useState(false);
  const [heroPhase, setHeroPhase] = useState<"hidden"|"in"|"visible"|"out">("hidden");
  const [curX, setCurX] = useState(-200);
  const [curY, setCurY] = useState(-200);
  const [curClick, setCurClick] = useState(false);

  // Canvas star render
  const drawStars = useCallback((cameraZ: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0,0,W,H);

    const fov = 900;
    const cx = W/2, cy = H/2;

    starsRef.current.forEach(s => {
      let relZ = s.baseZ + cameraZ;
      relZ = ((relZ % LOOP) + LOOP) % LOOP;
      if (relZ > 800) relZ -= LOOP;
      if (relZ <= -fov*1.5 || relZ >= 0) return;

      const scale = fov / (fov - relZ);
      const sx = cx + s.x * scale;
      const sy = cy + s.y * scale;
      if (sx < -50 || sx > W+50 || sy < -50 || sy > H+50) return;

      const r = Math.max(0.5, s.size * scale * 0.012);
      const lit = s.lit;
      const baseOp = s.op;
      const finalOp = Math.min(1, baseOp + lit * 0.5);
      const [cr,cg,cb] = STAR_COLORS[s.colorIdx];

      // Big glow when lit — lamp effect
      if (lit > 0.05) {
        const glowR = r * (8 + lit * 14);
        const grd = ctx.createRadialGradient(sx,sy,0,sx,sy,glowR);
        grd.addColorStop(0, `rgba(${cr},${cg},${cb},${(lit*0.7).toFixed(2)})`);
        grd.addColorStop(0.3, `rgba(${cr},${Math.floor(cg*0.6)},${Math.floor(cb*0.3)},${(lit*0.3).toFixed(2)})`);
        grd.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath(); ctx.arc(sx,sy,glowR,0,Math.PI*2);
        ctx.fillStyle = grd; ctx.fill();

        // Cross spike for bright stars
        if (lit > 0.4 || s.size > 2.5) {
          const spikeLen = r * (6 + lit * 10);
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},${(lit*0.5).toFixed(2)})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath(); ctx.moveTo(sx-spikeLen,sy); ctx.lineTo(sx+spikeLen,sy); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(sx,sy-spikeLen); ctx.lineTo(sx,sy+spikeLen); ctx.stroke();
        }
      }

      // Ambient soft glow for all stars
      if (s.size > 1.8) {
        const ambR = r * 3.5;
        const ag = ctx.createRadialGradient(sx,sy,0,sx,sy,ambR);
        ag.addColorStop(0, `rgba(${cr},${cg},${cb},${(baseOp*0.25).toFixed(2)})`);
        ag.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath(); ctx.arc(sx,sy,ambR,0,Math.PI*2);
        ctx.fillStyle = ag; ctx.fill();
      }

      // Core dot
      const coreR = r * (1 + lit * 2.5);
      ctx.beginPath(); ctx.arc(sx,sy,coreR,0,Math.PI*2);
      ctx.fillStyle = `rgba(${cr},${cg},${cb},${finalOp.toFixed(2)})`;
      ctx.fill();
    });
  }, []);

  useEffect(() => {
    starsRef.current = makeStars(LOOP);
    setMounted(true);

    const t1 = setTimeout(()=>setHeroPhase("in"),     200);
    const t2 = setTimeout(()=>setHeroPhase("visible"),1000);

    const onWheel = (e:WheelEvent) => {
      targetScroll.current += e.deltaY * 0.6;
      if (targetScroll.current > 80) setHeroPhase("out");
    };
    let touchY = 0;
    const onTouchStart = (e:TouchEvent) => { touchY = e.touches[0].clientY; };
    const onTouchMove  = (e:TouchEvent) => {
      targetScroll.current += (touchY - e.touches[0].clientY)*2.4;
      touchY = e.touches[0].clientY;
      if (targetScroll.current > 80) setHeroPhase("out");
    };
    const onMouseMove = (e:MouseEvent) => {
      const sx = e.clientX, sy = e.clientY;
      const W = window.innerWidth, H = window.innerHeight;
      mouseRef.current = { x:(sx/W-0.5)*2, y:(sy/H-0.5)*2, sx, sy };
      setCurX(sx); setCurY(sy);

      // Star interaction — screen space proximity
      const fov = 900, cx = W/2, cy = H/2;
      const cameraZ = scrollSmooth.current * CAM_SPD;
      starsRef.current.forEach(s => {
        let relZ = s.baseZ + cameraZ;
        relZ = ((relZ % LOOP) + LOOP) % LOOP;
        if (relZ > 800) relZ -= LOOP;
        if (relZ <= -fov*1.5) return;
        const scale = fov / (fov - relZ);
        const px = cx + s.x * scale;
        const py = cy + s.y * scale;
        const dx = sx - px, dy = sy - py;
        const dist = Math.sqrt(dx*dx+dy*dy);
        const R = 90;
        if (dist < R) {
          const force = (R - dist) / R;
          const angle = Math.atan2(s.y - (sy-cy)/scale, s.x - (sx-cx)/scale);
          s.vx += Math.cos(angle) * force * 280;
          s.vy += Math.sin(angle) * force * 280;
          s.lit = Math.min(1, s.lit + force * 1.2); // brighter lamp effect
        }
      });
    };
    const onClick = () => { setCurClick(true); setTimeout(()=>setCurClick(false),180); };

    window.addEventListener("wheel",      onWheel,      {passive:true});
    window.addEventListener("touchstart", onTouchStart, {passive:true});
    window.addEventListener("touchmove",  onTouchMove,  {passive:true});
    window.addEventListener("mousemove",  onMouseMove);
    window.addEventListener("click",      onClick);

    // Resize canvas
    const resize = () => {
      if (canvasRef.current) {
        canvasRef.current.width  = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    resize();
    window.addEventListener("resize", resize);

    let last = performance.now();
    const loop = (now:number) => {
      const dt = Math.min((now-last)/1000, 0.05);
      last = now;

      // Physics update
      starsRef.current.forEach(s => {
        s.x  += s.vx * dt;
        s.y  += s.vy * dt;
        s.vx *= 0.85;
        s.vy *= 0.85;
        // Return to origin
        s.x += (s.ox - s.x) * 0.018;
        s.y += (s.oy - s.y) * 0.018;
        s.lit *= 0.94;
      });

      const diff = targetScroll.current - scrollSmooth.current;
      scrollSmooth.current += diff * 0.072;
      velSmooth.current    += (diff*0.072 - velSmooth.current)*0.1;
      setScroll(scrollSmooth.current);
      setVel(velSmooth.current);

      drawStars(scrollSmooth.current * CAM_SPD);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      clearTimeout(t1); clearTimeout(t2);
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("wheel",      onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove",  onTouchMove);
      window.removeEventListener("mousemove",  onMouseMove);
      window.removeEventListener("click",      onClick);
      window.removeEventListener("resize",     resize);
    };
  }, [drawStars]);

  const cameraZ = scroll * CAM_SPD;
  const absVel  = Math.abs(vel);
  const fov     = Math.max(320, 1000 - absVel*14);
  const tiltX   = vel * -0.16;
  const heroVisible = heroPhase==="in"||heroPhase==="visible";
  const heroOut     = heroPhase==="out";


  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        html,body{width:100%;height:100%;overflow:hidden;background:#000;cursor:none;}
        @keyframes hero-in{0%{opacity:0;transform:translateY(55px);letter-spacing:0.4em;}100%{opacity:1;transform:translateY(0);letter-spacing:0.06em;}}
        @keyframes hero-sub{0%{opacity:0;transform:translateY(18px);}100%{opacity:1;transform:translateY(0);}}
        @keyframes scroll-hint{0%,100%{opacity:0.35;transform:translateY(0);}50%{opacity:0.75;transform:translateY(7px);}}
        @keyframes scanmove{0%{transform:translateY(-100vh);}100%{transform:translateY(100vh);}}
        @keyframes cur-ring{0%,100%{transform:translate(-50%,-50%) scale(1);}50%{transform:translate(-50%,-50%) scale(1.15);}}
        .card-link{text-decoration:none;display:block;}
        .card-link:hover .cbox{border-color:var(--ca)!important;box-shadow:0 0 55px var(--cg),inset 0 0 20px rgba(0,0,0,0.3)!important;transform:scale(1.03);}
        .card-link:hover .gobtn{background:var(--ca)!important;color:#000!important;}
        .cbox{transition:border-color 0.3s,box-shadow 0.3s,transform 0.3s;}
        .gobtn{transition:background 0.25s,color 0.25s;}
      `}</style>

      <div style={{position:"fixed",inset:0,background:"#000",overflow:"hidden"}}>

        {/* Canvas — stars with physics */}
        <canvas ref={canvasRef} style={{position:"absolute",inset:0,zIndex:1,pointerEvents:"none"}} />

        {/* Scanline */}
        <div style={{position:"absolute",inset:0,zIndex:2,pointerEvents:"none",overflow:"hidden"}}>
          <div style={{position:"absolute",left:0,right:0,height:"2px",background:"linear-gradient(transparent,rgba(255,0,40,0.04),transparent)",animation:"scanmove 8s linear infinite"}} />
        </div>

        {/* CRT */}
        <div style={{position:"absolute",inset:0,zIndex:3,pointerEvents:"none",backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.06) 3px,rgba(0,0,0,0.06) 4px)"}} />

        {/* Hero text */}
        <div style={{position:"absolute",inset:0,zIndex:10,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",pointerEvents:"none",opacity:heroOut?0:1,transform:heroOut?"translateY(-70px) scale(0.93)":"none",transition:heroOut?"opacity 0.5s,transform 0.5s":"none"}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(5rem,19vw,20rem)",lineHeight:0.82,letterSpacing:"0.06em",color:"rgba(255,255,255,0.93)",textAlign:"center",textShadow:"0 0 120px rgba(200,0,0,0.25)",opacity:heroVisible?1:0,animation:heroVisible?"hero-in 0.8s cubic-bezier(0.16,1,0.3,1) forwards":"none",userSelect:"none"}}>ROOT</div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(5rem,19vw,20rem)",lineHeight:0.82,letterSpacing:"0.06em",color:"rgba(200,0,0,0.9)",textAlign:"center",textShadow:"0 0 120px rgba(255,0,0,0.45)",opacity:heroVisible?1:0,animation:heroVisible?"hero-in 0.8s 0.1s cubic-bezier(0.16,1,0.3,1) forwards":"none",userSelect:"none"}}>VISION</div>
          <div style={{marginTop:"1.8rem",fontFamily:"'Inter',sans-serif",fontWeight:300,fontSize:"clamp(0.55rem,1.1vw,0.8rem)",letterSpacing:"0.48em",color:"rgba(180,0,0,0.5)",textTransform:"uppercase",textAlign:"center",opacity:heroVisible?1:0,animation:heroVisible?"hero-sub 0.6s 0.5s ease forwards":"none"}}>Cyber Security — Independent — 2026</div>
          {heroPhase==="visible"&&(
            <div style={{position:"absolute",bottom:"8vh",display:"flex",flexDirection:"column",alignItems:"center",gap:"8px",animation:"scroll-hint 2s ease-in-out infinite"}}>
              <span style={{fontFamily:"'Inter',sans-serif",fontSize:"0.52rem",letterSpacing:"0.42em",color:"rgba(180,0,0,0.38)",textTransform:"uppercase"}}>Scroll</span>
              <svg width="16" height="24" viewBox="0 0 16 24" fill="none"><rect x="1" y="1" width="14" height="22" rx="7" stroke="rgba(180,0,0,0.28)" strokeWidth="1.5"/><rect x="6.5" y="5" width="3" height="6" rx="1.5" fill="rgba(180,0,0,0.45)"/></svg>
            </div>
          )}
        </div>

        {/* 3D viewport */}
        <div style={{position:"absolute",inset:0,zIndex:5,perspective:`${fov}px`,overflow:"hidden"}}>
          <div style={{position:"absolute",top:"50%",left:"50%",transformStyle:"preserve-3d",transform:`rotateX(${tiltX}deg)`,willChange:"transform"}}>

            {/* Social cards */}
            {mounted && SOCIALS.map((card,i)=>{
              const baseZ = -i*Z_GAP;
              let relZ = baseZ+cameraZ;
              relZ = ((relZ%LOOP)+LOOP)%LOOP;
              if(relZ>800) relZ-=LOOP;
              const alpha = relZ<-4000?0:relZ<-2200?(relZ+4000)/1800:relZ>250?Math.max(0,1-(relZ-250)/450):1;
              const side  = i%2===0?-1:1;
              const xOff  = side*(100+i%3*35);
              const yOff  = (seeded(i*7)-0.5)*70;
              const rot   = side*(2+seeded(i*13)*4);
              return (
                <div key={i} style={{position:"absolute",opacity:alpha,transform:`translate3d(${xOff}px,${yOff}px,${relZ}px) rotateZ(${rot}deg)`,willChange:"transform,opacity"}}>
                  <a className="card-link" href={card.link} target="_blank" rel="noopener noreferrer" style={{"--ca":card.accent,"--cg":card.accent+"33"} as React.CSSProperties}>
                    <div className="cbox" style={{width:310,height:420,background:card.bg,border:`1px solid ${card.border}`,backdropFilter:"blur(12px)",padding:"1.8rem",display:"flex",flexDirection:"column",justifyContent:"space-between",transform:"translate(-50%,-50%)",position:"relative",boxShadow:`0 0 28px ${card.accent}15`}}>
                      <div style={{position:"absolute",top:-1,left:-1,width:14,height:14,borderTop:`1.5px solid ${card.accent}`,borderLeft:`1.5px solid ${card.accent}`,opacity:0.7}}/>
                      <div style={{position:"absolute",bottom:-1,right:-1,width:14,height:14,borderBottom:`1.5px solid ${card.accent}`,borderRight:`1.5px solid ${card.accent}`,opacity:0.7}}/>
                      <div>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${card.border}`,paddingBottom:"0.8rem",marginBottom:"1rem"}}>
                          <card.Logo/>
                          <span style={{fontFamily:"'Inter',sans-serif",fontWeight:300,fontSize:"0.55rem",letterSpacing:"0.38em",color:"rgba(255,255,255,0.22)",textTransform:"uppercase"}}>{String(i+1).padStart(2,"0")} / 05</span>
                        </div>
                        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"2.4rem",letterSpacing:"0.05em",color:"rgba(255,255,255,0.9)",lineHeight:1,marginBottom:"0.3rem"}}>{card.platform}</div>
                        <div style={{fontFamily:"'Inter',sans-serif",fontWeight:300,fontSize:"0.62rem",letterSpacing:"0.2em",color:card.accent,opacity:0.8,marginBottom:"1rem"}}>{card.handle}</div>
                        <p style={{fontFamily:"'Inter',sans-serif",fontWeight:400,fontSize:"0.72rem",lineHeight:1.75,color:"rgba(240,235,235,0.88)",textShadow:"0 0 12px rgba(255,255,255,0.15)"}}>{card.desc}</p>
                      </div>
                      <div className="gobtn" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",padding:"0.7rem",border:`1px solid ${card.border}`,fontFamily:"'Inter',sans-serif",fontWeight:400,fontSize:"0.62rem",letterSpacing:"0.28em",color:"rgba(255,255,255,0.5)",textTransform:"uppercase",background:"transparent",cursor:"none"}}>
                        <span>Ochish</span><span style={{fontSize:"1rem",lineHeight:1}}>↗</span>
                      </div>
                    </div>
                  </a>
                </div>
              );
            })}

            {/* ROOT VISION in loop — slot 5 */}
            {mounted&&(()=>{
              const baseZ = -SOCIALS.length*Z_GAP;
              let relZ = baseZ+cameraZ;
              relZ = ((relZ%LOOP)+LOOP)%LOOP;
              if(relZ>800) relZ-=LOOP;
              const alpha = relZ<-4000?0:relZ<-2200?(relZ+4000)/1800:relZ>250?Math.max(0,1-(relZ-250)/450):1;
              return (
                <div style={{position:"absolute",opacity:alpha,transform:`translate3d(0px,0px,${relZ}px)`,willChange:"transform,opacity",pointerEvents:"none",userSelect:"none"}}>
                  <div style={{transform:"translate(-50%,-50%)",textAlign:"center"}}>
                    <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(4rem,16vw,18rem)",lineHeight:0.82,letterSpacing:"0.06em",color:"rgba(255,255,255,0.92)",textShadow:"0 0 100px rgba(200,0,0,0.3)"}}>ROOT</div>
                    <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(4rem,16vw,18rem)",lineHeight:0.82,letterSpacing:"0.06em",color:"rgba(200,0,0,0.88)",textShadow:"0 0 100px rgba(255,0,0,0.5)"}}>VISION</div>
                    <div style={{marginTop:"1.2rem",fontFamily:"'Inter',sans-serif",fontWeight:300,fontSize:"clamp(0.5rem,0.9vw,0.7rem)",letterSpacing:"0.48em",color:"rgba(180,0,0,0.4)",textTransform:"uppercase"}}>Cyber Security — Independent — 2026</div>
                  </div>
                </div>
              );
            })()}

          </div>
        </div>

        {/* Vignette */}
        <div style={{position:"absolute",inset:0,zIndex:8,pointerEvents:"none",background:"radial-gradient(ellipse 70% 65% at 50% 50%, transparent 30%, rgba(0,0,0,0.42) 65%, rgba(0,0,0,0.94) 100%)"}} />

        {/* Custom cursor — mouse shape with physics trail */}
        {mounted&&(
          <>
            {/* Outer ring — slow follow */}
            <div style={{position:"fixed",left:curX,top:curY,width:curClick?22:38,height:curClick?22:38,border:"1.5px solid rgba(200,0,0,0.6)",borderRadius:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none",zIndex:100,transition:"width 0.18s,height 0.18s,border-color 0.15s",boxShadow:curClick?"0 0 16px rgba(255,0,0,0.5)":"0 0 8px rgba(200,0,0,0.2)",animation:"cur-ring 3s ease-in-out infinite"}} />
            {/* Inner dot */}
            <div style={{position:"fixed",left:curX,top:curY,width:curClick?8:5,height:curClick?8:5,background:curClick?"rgba(255,60,60,1)":"rgba(220,0,0,0.95)",borderRadius:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none",zIndex:101,boxShadow:curClick?"0 0 18px rgba(255,0,0,1)":"0 0 8px rgba(200,0,0,0.7)",transition:"width 0.1s,height 0.1s,background 0.1s"}} />
            {/* Crosshair */}
            {[[-18,0,10,1],[8,0,10,1],[0,-18,1,10],[0,8,1,10]].map(([dx,dy,w,h],ci)=>(
              <div key={ci} style={{position:"fixed",left:curX+(dx as number),top:curY+(dy as number),width:w as number,height:h as number,background:"rgba(200,0,0,0.4)",pointerEvents:"none",zIndex:100}} />
            ))}
          </>
        )}

      </div>
    </>
  );
}
