import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import animationData from '../public/scroll.json'

const Scroll = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const animation = lottie.loadAnimation({
      container: container,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animationData
    });

    return () => {
      animation.destroy(); // Cleanup on unmount
    };
  }, []);

  return <div ref={containerRef}></div>;
};

export default Scroll;
