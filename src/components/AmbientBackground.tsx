import { useEffect, useRef } from 'react';

export default function AmbientBackground() {
  const glowRef = useRef<HTMLDivElement>(null);
  const secondaryGlowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    let secTargetX = targetX;
    let secTargetY = targetY;
    let secCurrentX = targetX;
    let secCurrentY = targetY;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      // Inverse subtle movement for secondary depth orb
      secTargetX = window.innerWidth - e.clientX;
      secTargetY = window.innerHeight - e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animationFrameId: number;
    const render = () => {
      currentX += (targetX - currentX) * 0.04;
      currentY += (targetY - currentY) * 0.04;

      secCurrentX += (secTargetX - secCurrentX) * 0.02;
      secCurrentY += (secTargetY - secCurrentY) * 0.02;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${currentX - 250}px, ${currentY - 250}px, 0)`;
      }

      if (secondaryGlowRef.current) {
        secondaryGlowRef.current.style.transform = `translate3d(${secCurrentX - 300}px, ${secCurrentY - 300}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* Background base tone: Clean Creamy White */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5] via-[#FAF6EE] to-[#F5F1E8]" 
      />

      {/* Layer 1: Atmospheric creamy & champagne luminous clouds */}
      <div 
        className="absolute -top-[15%] -left-[10%] w-[65vw] h-[65vw] rounded-full blur-[140px] pointer-events-none bg-[#EBD08D]/[0.18]" 
      />

      <div 
        className="absolute top-[40%] -right-[15%] w-[60vw] h-[60vw] rounded-full blur-[160px] pointer-events-none bg-[#F2E5C4]/[0.22]" 
      />

      <div 
        className="absolute -bottom-[15%] left-[20%] w-[55vw] h-[55vw] rounded-full blur-[150px] pointer-events-none bg-[#FAF0D6]/[0.25]" 
      />

      {/* Layer 2: Interactive subtle pointer-following liquid light pools (desktop only) */}
      <div
        ref={glowRef}
        className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none bg-[#D6B46A]/[0.08] hidden lg:block"
        style={{ willChange: 'transform' }}
      />

      <div
        ref={secondaryGlowRef}
        className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none bg-[#FFF5DC]/[0.2] hidden lg:block"
        style={{ willChange: 'transform' }}
      />

      {/* Layer 3: Subtle refractive studio mesh texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[radial-gradient(#8A7A56_1px,transparent_1px)] [background-size:28px_28px]" 
      />
    </div>
  );
}

