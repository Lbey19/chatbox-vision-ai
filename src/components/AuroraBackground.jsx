import { useEffect, useRef } from "react";

export default function AuroraBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const cvs = ref.current;
    const ctx = cvs.getContext("2d");
    let w = (cvs.width = window.innerWidth);
    let h = (cvs.height = window.innerHeight);

    const mouse = { x: w / 2, y: h / 2, lerpX: w / 2, lerpY: h / 2 };


    const ribbons = Array.from({ length: 4 }, (_, i) => ({
      phase: Math.random() * Math.PI * 2,
      speed: 0.0005 + i * 0.00015,
      amp: 60 + i * 20,
      hue: [160, 180, 200, 210][i], 
      sat: 70,
      light: 55,
      alpha: 0.5,
    }));

    const dust = Array.from({ length: 100 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 0.5,
      v: Math.random() * 0.3 + 0.05,
      a: Math.random() * 0.4 + 0.3,
      hue: Math.random() > 0.5 ? 160 : 200,
    }));

    function resize() {
      w = cvs.width = window.innerWidth;
      h = cvs.height = window.innerHeight;
    }

    function onMove(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);

    let raf;
    function frame(t) {
      raf = requestAnimationFrame(frame);

      mouse.lerpX += (mouse.x - mouse.lerpX) * 0.06;
      mouse.lerpY += (mouse.y - mouse.lerpY) * 0.06;

      
      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, "#e9f7ff");
      bg.addColorStop(1, "#e6fff3");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      
      ribbons.forEach((r, idx) => {
        const yBase = (h * (idx + 1)) / (ribbons.length + 1);
        ctx.beginPath();
        for (let x = 0; x <= w; x += 10) {
          const p = r.phase + x * 0.012 + t * r.speed;
          const y =
            yBase +
            Math.sin(p) * r.amp +
            ((mouse.lerpY - h / 2) * (0.04 + idx * 0.015));
          const xParallax = x + (mouse.lerpX - w / 2) * (0.015 + idx * 0.008);
          if (x === 0) ctx.moveTo(xParallax, y);
          else ctx.lineTo(xParallax, y);
        }
        const grad = ctx.createLinearGradient(0, yBase - 80, 0, yBase + 80);
        grad.addColorStop(0, `hsla(${r.hue}, ${r.sat}%, ${r.light + 15}%, ${r.alpha})`);
        grad.addColorStop(0.5, `hsla(${r.hue}, ${r.sat}%, ${r.light}%, ${r.alpha * 0.7})`);
        grad.addColorStop(1, `hsla(${r.hue}, ${r.sat}%, ${r.light - 10}%, 0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 28 - idx * 5;
        ctx.lineCap = "round";
        ctx.stroke();
      });

      // Particules
      ctx.globalCompositeOperation = "lighter";
      for (const s of dust) {
        s.y -= s.v;
        if (s.y < -10) {
          s.y = h + 10;
          s.x = Math.random() * w;
        }
        ctx.beginPath();
        ctx.fillStyle = `hsla(${s.hue}, 80%, 65%, ${s.a})`;
        ctx.arc(
          s.x + (mouse.lerpX - w / 2) * 0.015,
          s.y + (mouse.lerpY - h / 2) * 0.01,
          s.r,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      
      const v = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, Math.max(w, h));
      v.addColorStop(0, "rgba(255,255,255,0)");
      v.addColorStop(1, "rgba(0,0,0,0.06)");
      ctx.fillStyle = v;
      ctx.fillRect(0, 0, w, h);
    }

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return <canvas ref={ref} className="aurora-canvas" />;
}
