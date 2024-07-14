import { createContext, useState, useEffect } from "react";

export function useScroll() {
  const content = document.getElementById('root')
  const [data, setData] = useState({
    x: 0,
    y: 0,
    lastX: 0,
    lastY: 0
  });

  // set up event listeners
  useEffect(() => {
    const handleScroll = (e:any) => {
      setData((last) => {
        return {
          x: e.scrollX,
          y: e.scrollY,
          lastX: last.x,
          lastY: last.y
        };
      });
    };

    handleScroll({scrollX:0, scrollY:0});
  
   if(content) content.addEventListener("scroll", handleScroll);

    return () => {
      if(content) content.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return data;
}

export const ScrollContext = createContext(null);
