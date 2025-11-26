import { useState, useEffect } from 'react';

export function useTaskTimer(selectedAt, durationHours = 48) {
  const calculateTimeLeft = () => {
    if (!selectedAt) return durationHours * 60 * 60;
    
    const startTime = new Date(selectedAt).getTime();
    const endTime = startTime + (durationHours * 60 * 60 * 1000);
    const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
    return remaining;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newVal = calculateTimeLeft();
        if (newVal <= 0) {
          clearInterval(timer);
          return 0;
        }
        return newVal;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedAt, durationHours]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalSeconds = durationHours * 60 * 60;
  const progress = Math.min(100, Math.max(0, (timeLeft / totalSeconds) * 100));

  return { timeLeft, formatTime, progress };
}


