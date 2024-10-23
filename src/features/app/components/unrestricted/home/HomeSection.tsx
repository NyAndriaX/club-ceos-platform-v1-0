import React, { useEffect, useState } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { Button } from 'primereact/button';
import { storage } from '@/config/firebase';

export const HeroSection: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  async function fetchVideoInFirebase() {
    const videoRef = ref(storage, 'Bg-Home.mp4');
    const url = await getDownloadURL(videoRef);
    setVideoUrl(url);
  }

  useEffect(() => {
    fetchVideoInFirebase();
  }, []);

  return (
    <section
      aria-label="hero"
      style={{ height: `calc(100vh - 4rem)` }}
      className="relative flex flex-col items-center justify-center h-full w-full"
    >
      {videoUrl && (
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <div className="absolute inset-0 bg-blue-900 opacity-40" />
      <div className="flex flex-col items-center justify-center gap-4 max-w-4xl z-10">
        <h1 className="text-white font-semibold text-2xl md:text-4xl text-center">
          L&apos;elite des dirigeants, à portée de main. Rejoignez le réseau qui
          soutient votre succès.
        </h1>
        <Button
          size="small"
          label="Saisir votre invitation privée"
          rounded
          outlined
        />
      </div>
    </section>
  );
};
