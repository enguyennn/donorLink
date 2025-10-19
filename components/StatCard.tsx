
import React, { useState, useEffect } from 'react';

interface StatCardProps {
  label: string;
  value: number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const duration = 1500; // 1.5 seconds
        const startTime = Date.now();
        
        const animateCount = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            const currentCount = Math.floor(progress * value);
            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(animateCount);
            }
        };

        requestAnimationFrame(animateCount);
    }, [value]);

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
      <p className="text-5xl font-extrabold text-brand-blue">{count.toLocaleString()}</p>
      <p className="mt-2 text-lg font-medium text-gray-600">{label}</p>
    </div>
  );
};

export default StatCard;
