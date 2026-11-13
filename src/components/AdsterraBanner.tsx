import { useEffect, useRef } from 'react';

const AdsterraBanner = () => {
  const banner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (banner.current && !banner.current.firstChild) {
      // 1. atOptions wali script banayein
      const conf = document.createElement('script');
      conf.innerHTML = `
        atOptions = {
          'key' : 'b6972541ae06134cf835e2f096d0a41e',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      `;
      
      // 2. Main Adsterra invoke wali script banayein
      const script = document.createElement('script');
      script.src = "https://bellnewyork.org/22/b6972541ae06134cf835e2f096d0a41e"; 
      script.async = true;
      
      // Dono scripts ko div ke andar add karein
      banner.current.appendChild(conf);
      banner.current.appendChild(script);
    }
  }, []);

  // Banner ko center mein dikhane ke liye flex use kiya gaya hai
  return <div ref={banner} className="flex justify-center my-6 w-full overflow-hidden" />;
};

export default AdsterraBanner;