/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState, useRef } from "react";
import {
  Volume2,
  VolumeX,
  Github,
  Instagram,
  Youtube,
  Music,
  Gamepad2,
  Eye,
  ExternalLink,
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

const SpotifyIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M8 11.5c2.5-1.5 5.5-1 7.5.5" />
    <path d="M9 14c1.5-1 4-1 5 .5" />
    <path d="M7 9c2-1 6-2 10 .5" />
  </svg>
);

const DISCORD_ID = "1304871527249874957";
const STATIC_DATA = {
  username: "cispn",
  avatar: "a_9aae6dfdc605b58e0138bfd01dffc2e1",
  banner: "192f81f7e3dc03825f74a6fc9581d797",
  id: DISCORD_ID,
};

const SOCIALS = [
  { name: "GitHub", url: "https://github.com/cispn", icon: Github },
  { name: "Instagram", url: "https://instagram.com/cispn", icon: Instagram },
  { name: "Spotify", url: "https://open.spotify.com/user/cispn", icon: SpotifyIcon },
  { name: "YouTube", url: "https://youtube.com/@cispn", icon: Youtube },
  {
    name: "Roblox",
    url: "https://www.roblox.com/users/profile?username=NekoNoYumee",
    icon: Gamepad2,
  },
];

const AVATAR_URL = `https://cdn.discordapp.com/avatars/${STATIC_DATA.id}/${STATIC_DATA.avatar}.png`;
const BANNER_URL = `https://cdn.discordapp.com/banners/${STATIC_DATA.id}/${STATIC_DATA.banner}.png`;

// --- Components ---

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(true);
  const [lanyard, setLanyard] = useState<LanyardData | null>(null);
  const [viewCount, setViewCount] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle Entrance
  const handleEnter = () => {
    setHasEntered(true);
    setIsMuted(false);
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.volume = volume;
      videoRef.current.play().catch(console.error);
    }
  };

  // Sync Volume
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Fetch Discord Activity (Lanyard)
  useEffect(() => {
    const fetchLanyard = async () => {
      try {
        const response = await fetch(
          `https://api.lanyard.rest/v1/users/${DISCORD_ID}`
        );
        const data = await response.json();
        setLanyard(data);
      } catch (error) {
        console.error("Lanyard fetch failed:", error);
      }
    };

    fetchLanyard();
    const interval = setInterval(fetchLanyard, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  // Handle Views Counter
  useEffect(() => {
    const currentViews = parseInt(localStorage.getItem("bio_views") || "0", 10);
    const newViews = currentViews + 1;
    localStorage.setItem("bio_views", newViews.toString());
    setViewCount(newViews);
  }, []);

  const discordStatus = lanyard?.data?.discord_status || "offline";
  const statusColor = {
    online: "bg-green-500",
    idle: "bg-yellow-500",
    dnd: "bg-red-500",
    offline: "bg-gray-500",
  }[discordStatus as keyof typeof statusColor] || "bg-gray-500";

  const primaryActivity = lanyard?.data?.activities?.find(
    (a) => a.type === 0 || a.type === 2 // Game or Spotify
  );

  return (
    <div className="relative h-screen w-screen overflow-hidden font-sans text-white">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="https://raw.githubusercontent.com/cispn/YOUR_REPO/main/YOUR_VIDEO.mp4"
        loop
        autoPlay
        muted
        playsInline
      />

      {/* Dark Overlay for depth */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      {/* Enter Screen Overlay */}
      <AnimatePresence>
        {!hasEntered && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            onClick={handleEnter}
            className="absolute inset-0 z-50 flex cursor-pointer items-center justify-center bg-black/80 backdrop-blur-xl"
          >
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="text-2xl font-light tracking-[0.2em] uppercase"
            >
              Click to Enter
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Area */}
      <AnimatePresence>
        {hasEntered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative z-10 flex h-full flex-col items-center justify-center px-4"
          >
            {/* Volume Control - Top Left */}
            <div className="absolute top-8 left-8 flex items-center gap-3">
              <div className="group relative flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="rounded-full bg-white/10 p-3 backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX size={20} />
                  ) : (
                    <Volume2 size={20} />
                  )}
                </button>
                <div className="flex w-0 items-center overflow-hidden transition-all duration-300 group-hover:w-32 group-hover:pl-2">
                   <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      setIsMuted(false);
                    }}
                    className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-white/20 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Profile Card */}
            <motion.div
              layout
              className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-black/30 shadow-2xl backdrop-blur-2xl"
            >
              {/* Banner */}
              <div className="relative h-32 w-full overflow-hidden">
                <img
                  src={BANNER_URL}
                  alt="Banner"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="relative px-6 pb-6 pt-16">
                {/* Avatar */}
                <div className="absolute -top-12 left-6 h-24 w-24 rounded-full border-4 border-[#121212] bg-[#121212]">
                  <img
                    src={AVATAR_URL}
                    alt="Avatar"
                    className="h-full w-full rounded-full"
                    referrerPolicy="no-referrer"
                  />
                  <div
                    className={`absolute bottom-1 right-1 h-5 w-5 rounded-full border-4 border-[#121212] ${statusColor}`}
                    title={discordStatus}
                  />
                </div>

                {/* Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                      {STATIC_DATA.username}
                    </h1>
                    <p className="text-sm font-medium text-white/50">
                      @{STATIC_DATA.username}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 text-[10px] font-bold tracking-wider uppercase text-white/40 outline outline-1 outline-white/10">
                      Verified
                    </span>
                  </div>
                </div>

                {/* Bio */}
                <div className="mt-4 space-y-3">
                  <p className="text-sm font-light leading-relaxed text-white/80">
                    Full-stack developer from India. Passionate about creating
                    clean, minimal, and performant web experiences.
                  </p>

                  {/* Activity */}
                  <AnimatePresence mode="wait">
                    {primaryActivity && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3 backdrop-blur-md"
                      >
                        <div className="flex h-10 w-10 overflow-hidden items-center justify-center rounded-lg bg-black/20 text-white/40">
                             {primaryActivity.type === 2 && lanyard?.data?.listening_to_spotify ? (
                               <img 
                                 src={lanyard.data.spotify.album_art_url} 
                                 alt="Album Art" 
                                 className="h-full w-full object-cover"
                                 referrerPolicy="no-referrer"
                               />
                             ) : primaryActivity.type === 2 ? (
                               <SpotifyIcon size={20} />
                             ) : (
                               <Gamepad2 size={20} />
                             )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold tracking-wider uppercase text-white/40">
                            {primaryActivity.type === 2 ? "Listening to" : "Playing"}
                          </p>
                          <p className="truncate text-xs font-semibold">
                            {primaryActivity.name}
                          </p>
                          {primaryActivity.details && (
                            <p className="truncate text-[10px] text-white/60">
                              {primaryActivity.details}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Socials */}
            <motion.div 
               className="mt-8 flex flex-wrap justify-center gap-4"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.8 }}
            >
              {SOCIALS.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/5 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                  title={social.name}
                >
                  <social.icon size={22} className="text-white/60 transition-colors group-hover:text-white" />
                  <span className="absolute -bottom-8 scale-0 text-[10px] font-bold tracking-widest uppercase text-white/40 transition-all group-hover:scale-100">
                    {social.name}
                  </span>
                </a>
              ))}
            </motion.div>

            {/* Views Counter - Bottom Right */}
            <div className="absolute bottom-8 right-8 flex items-center gap-2 rounded-full border border-white/5 bg-black/20 px-4 py-2 text-[10px] font-medium tracking-widest uppercase text-white/40 backdrop-blur-md">
              <Eye size={14} className="opacity-50" />
              <span>{viewCount.toLocaleString()} views</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        ::-webkit-scrollbar { width: 0px; }
        * { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
