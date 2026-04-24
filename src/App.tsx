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

const DiscordIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const DISCORD_ID = "1304871527249874957";
const STATIC_DATA = {
  username: "cispn",
  displayName: "",
  avatar: "56c42ad139c52057e2cb20b933f7726e",
  banner: "192f81f7e3dc03825f74a6fc9581d797",
  id: DISCORD_ID,
};

const SOCIALS = [
  { name: "GitHub", url: "https://github.com/cispn", icon: Github },
  { name: "Discord", url: "https://discord.com/users/1304871527249874957", icon: DiscordIcon },
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

const BACKGROUND_VIDEOS = [
  "/vid/snaptik_7629726366056959265_hd.mp4",
  "/vid/LIKE_HIM_-_TYLER_THE_CREATOR_CHROMAKOPIA_MOGRAPH_EDIT.mp4",
  "/vid/Video%20Project%201.mp4",
  "/vid/3118cf8c-7575-4f26-aac2-d9e37e61bc46.mp4",
  "/vid/SaveTik.io_7605545859903769864.mp4",
  "/vid/Video%20Project%201%20%281%29.mp4",
];

// --- Components ---

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(true);
  const [lanyard, setLanyard] = useState<LanyardData | null>(null);
  const [viewCount, setViewCount] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [isBgLoading, setIsBgLoading] = useState(false);

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

  // Handle Views Counter - Locked to 67
  useEffect(() => {
    setViewCount(67);
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
      {/* Static Black Background - prevents white flash during transitions */}
      {hasEntered && (
        <div className="absolute inset-0 bg-black" />
      )}

      {/* Background Video */}
      {hasEntered && (
        <AnimatePresence mode="wait">
          <motion.video
            key={currentBgIndex}
            ref={videoRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 h-full w-full object-cover"
            src={BACKGROUND_VIDEOS[currentBgIndex]}
            loop
            autoPlay
            muted={isMuted}
            playsInline
            onLoadedData={() => setIsBgLoading(false)}
          />
        </AnimatePresence>
      )}

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
            className="absolute inset-0 z-50 flex flex-col cursor-pointer items-center justify-center gap-4 bg-black"
          >
            <div
              className="text-center select-none"
              style={{
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                letterSpacing: '0.35em',
                color: '#fff',
                textTransform: 'uppercase',
                fontWeight: 500,
                userSelect: 'none',
              }}
            >
              CLICK TO CONTINUE
            </div>
            <p
              className="text-center select-none"
              style={{
                fontFamily: 'monospace',
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                color: 'rgba(255, 255, 255, 0.35)',
                textTransform: 'uppercase',
                fontWeight: 400,
                userSelect: 'none',
                maxWidth: '280px',
                lineHeight: 1.6,
              }}
            >
              This space feels distant, like it was never meant to be found
            </p>
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
              {/* Next Background Button */}
              <button
                onClick={() => {
                  setIsBgLoading(true);
                  setCurrentBgIndex((prev) => (prev + 1) % BACKGROUND_VIDEOS.length);
                }}
                className="rounded-full bg-white/10 p-3 backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
                title="Next Background"
              >
                {isBgLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                  />
                ) : (
                  <SkipForward size={20} />
                )}
              </button>
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
                  className="h-full w-full object-cover opacity-0"
                  referrerPolicy="no-referrer"
                />
                {/* Views on Banner */}
                <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white/80 shadow-lg">
                  <Eye size={16} className="opacity-70" />
                  <span>{viewCount.toLocaleString()}</span>
                </div>
              </div>

              <div className="relative px-6 pb-6 pt-16">
                {/* Avatar */}
                <div className="absolute -top-12 left-6 h-24 w-24 rounded-full bg-transparent">
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
                    {STATIC_DATA.displayName && (
                      <h1 className="text-2xl font-bold tracking-tight">
                        {STATIC_DATA.displayName}
                      </h1>
                    )}
                    <p className="text-sm font-medium text-white/0">
                      <span className="hidden">@{STATIC_DATA.username}</span>
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
                  <p className="text-sm font-light leading-relaxed text-white/40">
                    Full-stack dev who enjoys coding and gaming
                        — not too serious just doing stuff I like for fun
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

                  {/* Socials - Inside Card */}
                  <motion.div 
                    className="flex justify-center gap-3 pt-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    {SOCIALS.map((social) => (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link flex items-center justify-center transition-all duration-300 hover:scale-110"
                        title={social.name}
                        tabIndex={0}
                      >
                        <social.icon size={18} className="text-white/40 transition-colors group-hover:text-white" />
                      </a>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Views Counter - Bottom Right */}
            {/* Removed as per user request */}
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
