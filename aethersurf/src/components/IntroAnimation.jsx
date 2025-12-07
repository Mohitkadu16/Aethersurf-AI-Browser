import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const IntroAnimation = () => {
  const introRef = useRef(null);

  useEffect(() => {
    const initializeAnimation = () => {
      const intro = introRef.current;

      // Cursor tracking
      const handleMouseMove = (e) => {
        const moveX = (e.clientX / window.innerWidth - 0.5) * 30;
        const moveY = (e.clientY / window.innerHeight - 0.5) * 30;
        gsap.to(intro, {
          x: moveX,
          y: moveY,
          duration: 0.6,
          ease: 'power2.out'
        });
      };

      // Zoom to cursor position on click
      const handleClick = (e) => {
        const rect = intro.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Set transform origin to mouse position
        intro.style.transformOrigin = `${mouseX}px ${mouseY}px`;
        
        gsap.to(intro, {
          scale: 5,
          opacity: 0,
          duration: 1,
          ease: "power2.inOut",
          onComplete: () => {
            intro.style.display = 'none';
          }
        });
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('click', handleClick);
    };

    initializeAnimation();

    // Cleanup
    return () => {
      if (introRef.current) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('click', handleClick);
      }
    };
  }, []);

  return (
    <div 
      ref={introRef}
      className="intro fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-50 pointer-events-none transition-all duration-800 ease-in-out" 
      style={{ 
        backgroundImage: "url('/images/aethersurf logo (2).png')",
        willChange: 'transform'
      }}
    />
  );
};

export default IntroAnimation;
