import { useEffect, useState } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  format?: (value: number) => string;
  className?: string;
}

export function AnimatedCounter({ 
  value, 
  duration = 1500, 
  format = (val) => val.toString(),
  className = "" 
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    setDisplayValue(0);
    
    const startTime = Date.now();
    const endValue = value;
    
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation (easeOutQuart)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(endValue * easeOutQuart);
      
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
        setIsAnimating(false);
      }
    };
    
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [value, duration]);

  return (
    <span className={`${className} ${isAnimating ? 'animate-pulse' : ''}`}>
      {format(displayValue)}
    </span>
  );
}

// Specialized components for different formats
export function AnimatedNumber({ value, ...props }: Omit<AnimatedCounterProps, 'format'>) {
  return (
    <AnimatedCounter 
      value={value} 
      format={(val) => val.toLocaleString()} 
      {...props} 
    />
  );
}

export function AnimatedCurrency({ value, ...props }: Omit<AnimatedCounterProps, 'format'>) {
  return (
    <AnimatedCounter 
      value={value} 
      format={(val) => `$${val.toFixed(2)}`} 
      {...props} 
    />
  );
}

export function AnimatedPercentage({ value, ...props }: Omit<AnimatedCounterProps, 'format'>) {
  return (
    <AnimatedCounter 
      value={value} 
      format={(val) => `${val}%`} 
      {...props} 
    />
  );
}