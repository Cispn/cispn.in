import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState, useRef } from "react";
import {
  Volume2,
  VolumeX,
  Github,
  Instagram,
  Youtube,
  Gamepad2,
  Eye,
  SkipForward,
} from "lucide-react";

// --- Types & Constants ---

interface LanyardData {
  data: {
    discord_status: string;
    listening_to_spotify: boolean;
    spotify: {
      album_art_url: string;
      song: string;
      artist: string;
    };
    activities: {
      name: string;
      details?: string;
      state?: string;
      type: number;
    }[];
  };
}

const DISCORD_ID = "1304871527249874957";

const STATIC_DATA = {
  username: "cispn",
  avatar: "56c42ad139c52057e2cb20b933f7726e",
  banner: "192f81f7e3dc03825f74a6fc9581d797",
  id: DISCORD_ID,
};

const AVATAR_URL = `https://cdn.discordapp.com/avatars/${STATIC_DATA.id}/${STATIC_DATA.avatar}.png`;
const BANNER_URL = `https://cdn.discordapp.com/banners/${STATIC_DATA.id}/${STATIC_DATA.banner}.png`;

const BACKGROUND_VIDEOS = [
  "/vid/snaptik_7629726366056959265_hd.mp4",
  "/vid/castezy.edits_14050206_102711184.mp4",
  "/vid/Video%20Project%201.mp4",
  "/vid/3118cf8c-7575-4f26-aac2-d9e37e61bc46.mp4",
  "/vid/SaveTik.io_7605545859903769864.mp4",
  "/vid/Video%20Project%201%20%281%29.mp4",
];

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(true);
  const [lanyard, setLanyard] = useState<LanyardData | null>(null);
  const [viewCount, setViewCount] = useState(67);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // 🔥 UPDATED CLICK ENTER
  const handleEnter = () => {
    setHasEntered(true);
    setIsMuted(false);

    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.volume = volume;
      videoRef.current.play().catch(() => {});
    }
  };

  // Fetch Lanyard
  useEffect(() => {
    const fetchLanyard = async () => {
      const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
      const data = await res.json();
      setLanyard(data);
    };

    fetchLanyard();
    const i = setInterval(fetchLanyard, 30000);
    return () => clearInterval(i);
  }, []);

  const primaryActivity = lanyard?.data?.activities?.find(
    (a) => a.type === 0 || a.type === 2
  );

  return (
    <div className="relative h-screen w-screen overflow-hidden text-white">

      {/* VIDEO */}
      {hasEntered && (
        <motion.video
          key={currentBgIndex}
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src={BACKGROUND_VIDEOS[currentBgIndex]}
          autoPlay
          loop
          muted={isMuted}
          playsInline
        />
      )}

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* 🔥 NEW CLICK TO ENTER */}
      <AnimatePresence>
        {!hasEntered && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8 }}
            onClick={handleEnter}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xl cursor-pointer group"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-sm tracking-[0.5em] uppercase text-white/50 mb-4 group-hover:text-white/80">
                Welcome
              </p>
              <h2 className="text-5xl italic group-hover:text-white">
                Click to Enter
              </h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN */}
      {hasEntered && (
        <div className="relative z-10 flex h-full items-center justify-center">

          {/* SKIP */}
          <button
            onClick={() =>
              setCurrentBgIndex((p) => (p + 1) % BACKGROUND_VIDEOS.length)
            }
            className="absolute top-6 right-6"
          >
            <SkipForward />
          </button>

          {/* CARD */}
          <div className="w-[380px] bg-black/40 rounded-xl overflow-hidden">

            {/* BANNER */}
            <div className="relative h-28">
              <img src={BANNER_URL} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 px-2 py-1 rounded text-xs">
                <Eye size={14} />
                {viewCount}
              </div>
            </div>

            {/* CONTENT */}
            <div className="p-5">

              <img src={AVATAR_URL} className="w-20 h-20 rounded-full -mt-10" />

              <p className="mt-3 text-sm text-white/60">
                {primaryActivity?.name || "Online"}
              </p>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
