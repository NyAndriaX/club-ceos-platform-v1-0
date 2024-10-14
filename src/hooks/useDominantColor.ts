import { useEffect, useState } from 'react';
import ColorThief from 'color-thief-browser';

const useDominantColor = (imageUrl: string) => {
  const [dominantColor, setDominantColor] = useState<string | null>(null);

  useEffect(() => {
    if (!imageUrl) return;

    const image = document.createElement('img') as HTMLImageElement;
    image.src = imageUrl;
    image.crossOrigin = '*';

    image.onload = () => {
      const colorThief = new ColorThief();
      const color = colorThief.getColor(image);

      setDominantColor(`rgb(${color[0]},${color[1]},${color[2]})`);
    };

    image.onerror = error => {
      console.error("Erreur lors du chargement de l'image :", error);
    };

    return () => {
      setDominantColor(null);
    };
  }, [imageUrl]);

  return dominantColor;
};

export default useDominantColor;
