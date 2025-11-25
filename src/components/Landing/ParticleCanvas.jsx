import React, { useRef, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    // Symbols for the "Data Ocean" theme
    const symbols = ['0', '1', '{', '}', '<', '>', '/', '*', 'λ', '∑', '∂', '∇', '∫', '::'];

    const handleResize = () => {
      // High DPI Scaling
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      
      // Scale context to match
      ctx.scale(dpr, dpr);
      
      initParticles();
    };

    const mouse = {
      x: null,
      y: null,
      radius: 150
    };

    class Particle {
      constructor(x, y, directionX, directionY, size, color, symbol) {
        this.x = x;
        this.y = y;
        this.z = Math.random() * 2 + 0.5; // Depth factor
        
        this.baseSize = size;
        this.size = size * this.z; // Font size scales with depth
        
        // Parallax speed
        this.directionX = directionX * this.z;
        this.directionY = directionY * this.z;
        
        this.color = color;
        this.symbol = symbol;
        
        // Physics
        this.vx = 0;
        this.vy = 0;
        this.friction = 0.96; 
      }

      draw() {
        // Opacity based on depth (fog effect)
        // Slightly higher base opacity since we removed glow
        ctx.globalAlpha = Math.min(1, (this.z / 2.5) * 0.85); 
        
        ctx.font = `${Math.max(8, this.size * 8)}px "JetBrains Mono", monospace`; 
        ctx.fillStyle = this.color;
        
        // REMOVED GLOW for cleaner, sharper look
        // ctx.shadowBlur = 15 * this.z;
        // ctx.shadowColor = this.color;
        
        ctx.fillText(this.symbol, this.x, this.y);
        
        ctx.globalAlpha = 1.0; 
      }

      update(canvasWidth, canvasHeight) {
        // Boundary wrap-around
        if (this.x > canvasWidth + 50) this.x = -50;
        if (this.x < -50) this.x = canvasWidth + 50;
        if (this.y > canvasHeight + 50) this.y = -50;
        if (this.y < -50) this.y = canvasHeight + 50;

        // 1. Mouse Repulsion
        if (mouse.x != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          const forceRadius = mouse.radius * this.z;

          if (distance < forceRadius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (forceRadius - distance) / forceRadius; 
            const maxSpeed = 2 * this.z; // Adjusted to 2 (moderate reaction)
            
            this.vx -= forceDirectionX * force * maxSpeed;
            this.vy -= forceDirectionY * force * maxSpeed;
          }
        }
        
        // 2. Hero Text Repulsion
        let centerX = canvasWidth / 2;
        let centerY = canvasHeight / 2;
        let heroRadius = 280 * this.z;
        
        let heroDx = centerX - this.x;
        let heroDy = centerY - this.y;
        let heroDistance = Math.sqrt(heroDx * heroDx + heroDy * heroDy);
        
        if (heroDistance < heroRadius) {
           let angle = Math.atan2(heroDy, heroDx);
           let force = (heroRadius - heroDistance) / heroRadius;
           
           this.vx -= Math.cos(angle) * force * 0.6 * this.z;
           this.vy -= Math.sin(angle) * force * 0.6 * this.z;
        }

        // 3. Physics application
        this.x += this.directionX;
        this.y += this.directionY;
        this.x += this.vx;
        this.y += this.vy;
        
        this.vx *= this.friction;
        this.vy *= this.friction;

        this.draw();
      }
    }

    const initParticles = () => {
      particles = [];
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      let numberOfParticles = (width * height) / 15000;
      let color = theme === 'dark' ? '#64ffda' : '#0071e3'; 

      for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 1.5) + 0.5;
        let x = Math.random() * width;
        let y = Math.random() * height;
        
        let directionX = (Math.random() * 0.2) - 0.1;
        let directionY = (Math.random() * -0.3) - 0.05; 
        
        let symbol = symbols[Math.floor(Math.random() * symbols.length)];
        
        particles.push(new Particle(x, y, directionX, directionY, size, color, symbol));
      }
      
      particles.sort((a, b) => a.z - b.z);
    };

    const animate = () => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update(window.innerWidth, window.innerHeight);
      }
      connect();
    };

    const connect = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          if (Math.abs(particles[a].z - particles[b].z) > 0.2) continue;

          let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x)) +
                         ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
          
          let maxDist = (width/11) * (height/11) * 0.5; 

          if (distance < maxDist) {
            let opacityValue = 1 - (distance / maxDist);
            let depthAlpha = Math.min(1, (particles[a].z / 2.5));
            
            let strokeColor = theme === 'dark' 
              ? `rgba(100, 255, 218, ${opacityValue * 0.2 * depthAlpha})` 
              : `rgba(0, 113, 227, ${opacityValue * 0.15 * depthAlpha})`; 
            
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 0.5; 
            ctx.beginPath();
            ctx.moveTo(particles[a].x + 5, particles[a].y - 5);
            ctx.lineTo(particles[b].x + 5, particles[b].y - 5);
            ctx.stroke();
          }
        }
      }
    };

    window.addEventListener('resize', handleResize);
    
    const handleMouseMove = (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', () => {
      mouse.x = undefined;
      mouse.y = undefined;
    });

    handleResize();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none' 
      }}
    />
  );
};

export default ParticleCanvas;