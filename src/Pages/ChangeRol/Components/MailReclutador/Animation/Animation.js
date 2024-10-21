import React, { useEffect, useRef } from 'react';
import './Animation.css';

const BackgroundAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width, height;
    const elements = [];
    const numElements = 5; // Ajustado para mayor cantidad de bolas
    const speedMultiplier = 0.7; // Bolas caen más lentamente

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      elements.length = 0;
      for (let i = 0; i < numElements; i++) {
        elements.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 40 + 20, // Bolas de diferentes tamaños
          speed: Math.random() * 0.5 * speedMultiplier,
          color: 'rgba(10, 116, 59, 0.2)', // Color verde con opacidad
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      elements.forEach((el) => {
        ctx.beginPath();
        ctx.arc(el.x, el.y, el.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = el.color;
        ctx.fill();
        el.y += el.speed;
        if (el.y > height) {
          el.y = -el.radius;
        }
      });
      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    // Limpiar eventos al desmontar el componente
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="background-animation"></canvas>;
};

export default BackgroundAnimation;
