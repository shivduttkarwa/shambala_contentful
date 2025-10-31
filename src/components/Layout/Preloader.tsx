import React, { useEffect, useState } from 'react';
import './Preloader.css';

const Preloader: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Hide preloader after page loads
    const handleLoad = () => {
      setIsFading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 500); // Match transition duration
    };

    // Check if page is already loaded
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className={`preloader-overlay ${isFading ? 'fade-out' : ''}`}>
      <div className="load">
        <hr/><hr/><hr/><hr/>
      </div>
    </div>
  );
};

export default Preloader;