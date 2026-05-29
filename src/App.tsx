/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Github, 
  Instagram, 
  Disc3, 
  Youtube, 
  Gamepad2, 
  Volume2, 
  VolumeX, 
  SkipForward, 
  Eye,
  ExternalLink,
  Music
} from 'lucide-react';

// --- Constants ---
const BACKGROUND_VIDEOS = [
  "/vid/snaptik_7629726366056959265_hd.mp4",
  "/vid/Video%20Project%201.mp4",
  "/vid/3118cf8c-7575-4f26-aac2-d9e37e61bc46.mp4",
  "/vid/Video%20Project%201%20%281%29.mp4"
];

const SOCIALS = [
  { name: "GitHub", url: "https://github.com/cispn", icon: Github, hoverColor: "hover:text-white" },
  { name: "Instagram", url: "https://instagram.com/cispn", icon: Instagram, hoverColor: "hover:text-[#E4405F]" },
  { 
    name: "Spotify", 
    url: "https://open.spotify.com/user/cispn", 
    icon: (props: any) => (
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth={props.strokeWidth || 1.5} 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        width={props.size || 20} 
        height={props.size || 20}
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14.5c2.5-1 5.5-1 8 0" />
        <path d="M8 11.5c2-1 4.5-1 7 0" />
        <path d="M8.5 8.5c1.5-.75 3.5-.75 5.5 0" />
      </svg>
    ), 
    hoverColor: "hover:text-[#1DB954]" 
  },
  { name: "YouTube", url: "https://youtube.com/@cispn", icon: Youtube, hoverColor: "hover:text-[#FF0000]" },
  { name: "Roblox", url: "https://www.roblox.com/users/profile?username=NekoNoYumee", icon: Gamepad2, hoverColor: "hover:text-white" }
];

const DISCORD_USER_ID = "1304871527249874957";

// --- Types ---
interface LanyardData {
  discord_status: string;
  activities: any[];
  spotify: {
    track_id: string;
    song: string;
    artist: string;
    album: string;
    album_art_url: string;
  } | null;
  discord_user: {
    username: string;
    discriminator: string;
    id: string;
    avatar: string;
    banner: string | null;
    banner_color: string | null;
  };
}

// --- Typewriter Hook ---
function useTypewriter(text: string, speed = 120) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayed, done };
}

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [videoIndex, setVideoIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(true);
  const [views] = useState(67);
  const [lanyard, setLanyard] = useState<LanyardData | null>(null);
  const [lyrics, setLyrics] = useState<{ synced: string | null; plain: string | null } | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [localTime, setLocalTime] = useState(new Date());
  const [aboutLineIndex, setAboutLineIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { displayed: typewriterText, done: typewriterDone } = useTypewriter('CisPn', 150);

  const ABOUT_LINES = [
    "hello sir i am from microsoft support your pc has 47 viruses",
    "professional paste engineer lua skid since day one ctrl+c ctrl+v certified",
    "professional bug creator",
    "67 views your mom refreshed 66 times"
  ];

  // --- About Text Cycle ---
  useEffect(() => {
    const cycleInterval = setInterval(() => {
      setAboutLineIndex((prev) => (prev + 1) % ABOUT_LINES.length);
    }, 10000); // Increased to 10s for slow typing
    return () => clearInterval(cycleInterval);
  }, []);

  // --- Clock Interval ---
  useEffect(() => {
    const timer = setInterval(() => setLocalTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Lanyard Data Fetch ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
        const json = await res.json();
        if (json.success) {
          setLanyard(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch Lanyard data", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Update every 10s
    return () => clearInterval(interval);
  }, []);

  // --- Lyrics Fetch ---
  useEffect(() => {
    if (!lanyard?.spotify) {
      setLyrics(null);
      return;
    }

    const fetchLyrics = async () => {
      try {
        const { song, artist, album } = lanyard.spotify!;
        const query = new URLSearchParams({
          artist_name: artist,
          track_name: song,
          album_name: album
        }).toString();
        
        const res = await fetch(`https://lrclib.net/api/get?${query}`);
        if (res.ok) {
          const data = await res.json();
          setLyrics({
            synced: data.syncedLyrics,
            plain: data.plainLyrics
          });
        } else {
          setLyrics(null);
        }
      } catch (err) {
        console.error("Lyrics fetch failed", err);
        setLyrics(null);
      }
    };

    fetchLyrics();
  }, [lanyard?.spotify?.track_id]);

  // --- Sync Clock ---
  useEffect(() => {
    if (!lanyard?.spotify) return;

    const interval = setInterval(() => {
      // Find the relative progress
      const activity = lanyard.activities.find(a => a.type === 2); // Spotify type
      if (activity?.timestamps?.start) {
        const start = activity.timestamps.start;
        const now = Date.now();
        setCurrentTime((now - start) / 1000);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [lanyard?.spotify?.track_id]);

  // --- Video Controls ---
  const handleEnter = () => {
    setHasEntered(true);
    setIsMuted(false);
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(console.error);
    }
  };

  const handleSkip = () => {
    setVideoIndex((prev) => (prev + 1) % BACKGROUND_VIDEOS.length);
  };

  const handlePrevious = () => {
    setVideoIndex((prev) => (prev - 1 + BACKGROUND_VIDEOS.length) % BACKGROUND_VIDEOS.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleSkip();
      if (e.key === 'ArrowLeft') handlePrevious();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted, videoIndex]);

  // --- UI Helpers ---
  const getAvatar = (data: LanyardData) => {
    if (data.discord_user.avatar) {
      return `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png?size=256`;
    }
    return `https://cdn.discordapp.com/embed/avatars/${parseInt(data.discord_user.id) % 5}.png`;
  };

  const getBanner = (data: LanyardData) => {
    if (data.discord_user.banner) {
      return `https://cdn.discordapp.com/banners/${data.discord_user.id}/${data.discord_user.banner}.png?size=600`;
    }
    return null;
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'dnd': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050505] font-sans text-white overflow-hidden selection:bg-white/20 select-none">
      {/* Background System */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-black to-slate-950/40 z-[-1]" />
        <AnimatePresence mode="wait">
          <motion.video
            key={BACKGROUND_VIDEOS[videoIndex]}
            ref={videoRef}
            src={BACKGROUND_VIDEOS[videoIndex]}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="h-full w-full object-cover brightness-50"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] pointer-events-none" />
      </div>

      {/* Click to Enter Overlay */}
      <AnimatePresence>
        {!hasEntered && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            onClick={handleEnter}
            className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xl cursor-pointer group"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-sm font-medium tracking-[0.5em] uppercase text-neutral-400 mb-4 opacity-70 group-hover:opacity-100 transition-opacity">Welcome</p>
              <h2 className="text-5xl font-light italic font-serif mb-8 text-white/90 group-hover:text-white transition-colors">Click to Enter</h2>
              <div className="w-12 h-12 mx-auto rounded-full border border-white/20 flex items-center justify-center animate-bounce group-hover:border-white/40 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`relative z-10 flex min-h-screen items-center justify-center p-6 transition-all duration-1000 ${!hasEntered ? 'blur-md scale-95' : 'blur-0 scale-100'}`}>
        {/* Controls */}
        <div className="fixed top-8 left-8 right-8 flex justify-between items-center pointer-events-auto">
          {/* Volume Control */}
          <div className="group flex items-center gap-3 bg-black/40 backdrop-blur-md p-2.5 rounded-full border border-white/10 transition-all hover:bg-white/10">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="p-1 cursor-pointer"
            >
              {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <div className="w-0 overflow-hidden group-hover:w-24 transition-all duration-300">
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume} 
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24 h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-white"
              />
            </div>
          </div>

          {/* Center Identity Bar */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: hasEntered ? 1 : 0, y: hasEntered ? 0 : -20 }}
            className="flex items-center gap-3 bg-white/1 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/5 opacity-60 hover:opacity-100 transition-opacity"
          >
            {lanyard && (
              <img 
                src={getAvatar(lanyard)} 
                className="w-5 h-5 rounded-full border border-white/20" 
                alt="Avatar" 
              />
            )}
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-200">
                {typewriterText}<span className={`inline-block w-[1px] h-[10px] bg-neutral-200 ml-0.5 align-middle ${typewriterDone ? 'opacity-0' : 'animate-pulse'}`} />
              </span>
          </motion.div>

          {/* Skip Button */}
          <button 
            onClick={handleSkip}
            className="p-2.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/10 transition-all active:scale-95"
          >
            <SkipForward size={20} />
          </button>
        </div>

        {/* Modular Dashboard Layout (Not a card) */}
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 pointer-events-auto items-start">
          
          {/* Left Column: Profile & Socials */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-3 flex flex-col gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 pt-10 pb-6 flex flex-col items-center justify-center group flex-1 relative overflow-hidden">
                <div className="relative shrink-0">
                  <div className="w-24 h-24 rounded-3xl bg-[#2b2d31] overflow-hidden shadow-2xl relative transition-transform group-hover:scale-105 duration-500">
                    {lanyard ? (
                      <img src={getAvatar(lanyard)} className="w-full h-full object-cover" alt="Avatar" />
                    ) : (
                      <div className="w-full h-full bg-neutral-800 animate-pulse" />
                    )}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-[3px] border-white/10 ${lanyard ? statusColor(lanyard.discord_status) : 'bg-gray-500'}`} />
                </div>

                {/* Integrated Views Badge */}
                <div className="mt-4 bg-white/5 px-3 py-1 rounded-full border border-white/5 flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity duration-300">
                   <Eye size={12} className="text-neutral-400" />
                   <span className="text-[10px] font-bold tracking-widest text-neutral-300">{views}</span>
                </div>
              </div>

              {/* Separate Vertical Socials Strip */}
              <div className="bg-white/5 backdrop-blur-2xl rounded-[2rem] border border-white/10 p-5 flex flex-col gap-6 self-stretch justify-center items-center">
                {SOCIALS.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`opacity-30 hover:opacity-100 transition-all transform hover:scale-125 ${social.hoverColor}`}
                    title={social.name}
                  >
                    <social.icon size={22} strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-6 flex flex-col gap-4">
              <div className="space-y-4">
                <h3 className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest">About</h3>
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={aboutLineIndex}
                    variants={{
                      hidden: { opacity: 1 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.08,
                        },
                      },
                    }}
                    initial="hidden"
                    animate="visible"
                    className="text-[11px] text-neutral-400 leading-relaxed font-medium min-h-[32px]"
                  >
                    {ABOUT_LINES[aboutLineIndex].split("").map((char, index) => (
                      <motion.span
                        key={`${aboutLineIndex}-${index}`}
                        variants={{
                          hidden: { opacity: 0 },
                          visible: { opacity: 1 },
                        }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Middle Column: Music & Synced Lyrics */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 flex flex-col gap-6 group/card"
          >
            <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 overflow-hidden flex flex-col min-h-[500px]">
              {lanyard?.spotify ? (
                <>
                  {/* Spotify Header */}
                  <div className="p-8 pb-4 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#1DB954]/10 flex items-center justify-center">
                        <Music size={18} className="text-[#1DB954]" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold tracking-tight">{lanyard.spotify.song}</span>
                          <div className="flex items-center gap-1.5 opacity-0 group-hover/card:opacity-100 transition-opacity">
                            <button 
                              onClick={handlePrevious}
                              className="p-1 hover:text-white text-neutral-500 transition-colors cursor-pointer"
                              title="Previous Video"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                            </button>
                            <button 
                              onClick={handleSkip}
                              className="p-1 hover:text-white text-neutral-500 transition-colors cursor-pointer"
                              title="Next Video"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                            </button>
                          </div>
                        </div>
                        <span className="text-xs text-neutral-500 italic">{lanyard.spotify.artist}</span>
                      </div>
                    </div>
                    <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg border border-white/10 flex-shrink-0">
                      <img src={lanyard.spotify.album_art_url} className="w-full h-full object-cover" alt="Album Art" />
                    </div>
                  </div>

                  {/* Lyrics Display */}
                  <div className="flex-1 relative overflow-hidden bg-black/20">
                    <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
                    <div className="h-full overflow-hidden flex flex-col items-center justify-center px-10">
                      {lyrics?.synced ? (
                        <div className="space-y-8 py-10 w-full">
                          {(() => {
                            const allLines = lyrics.synced.split('\n');
                            const parsedLines = allLines.map((line, i) => {
                              const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);
                              if (!match) return null;
                              return {
                                time: parseInt(match[1]) * 60 + parseFloat(match[2]),
                                text: match[3].trim(),
                                index: i
                              };
                            }).filter((l): l is {time: number, text: string, index: number} => l !== null && l.text !== "");

                            const activeIndex = parsedLines.findIndex((line, i) => {
                              const nextLine = parsedLines[i + 1];
                              const nextTime = nextLine ? nextLine.time : Infinity;
                              return currentTime >= line.time && currentTime < nextTime;
                            });

                            const displayIndex = activeIndex === -1 ? 0 : activeIndex;
                            const start = Math.max(0, displayIndex - 1);
                            const end = Math.min(parsedLines.length, start + 4);
                            const visibleLines = parsedLines.slice(start, end);

                            return visibleLines.map((line) => {
                              const isActive = line.index === parsedLines[activeIndex]?.index;
                              return (
                                <motion.p 
                                  key={line.index}
                                  layout
                                  initial={{ opacity: 0 }}
                                  animate={{ 
                                    opacity: isActive ? 1 : 0.15,
                                    scale: isActive ? 1.05 : 1,
                                    filter: isActive ? 'blur(0px)' : 'blur(1px)'
                                  }}
                                  transition={{ duration: 0.5 }}
                                  className={`text-xl md:text-2xl font-bold tracking-tight text-center transition-colors duration-500 ${isActive ? 'text-white' : 'text-neutral-500'}`}
                                >
                                  {line.text}
                                </motion.p>
                              );
                            });
                          })()}
                        </div>
                      ) : lyrics?.plain ? (
                        <div className="space-y-4 opacity-40 text-center py-10 max-h-full overflow-y-auto scrollbar-hide">
                          {lyrics.plain.split('\n').slice(0, 4).map((line, i) => (
                            <p key={i} className="text-lg font-medium">{line}</p>
                          ))}
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center opacity-20 gap-4">
                          <Disc3 size={40} className="animate-spin-slow" />
                          <p className="text-xs font-bold uppercase tracking-[0.4em]">Lyrics Unavailable</p>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar Floating at Bottom */}
                    <div className="absolute bottom-8 left-8 right-8 z-20">
                      <div className="bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/5 space-y-2">
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-[#1DB954] rounded-full shadow-[0_0_10px_rgba(29,185,84,0.5)]"
                            style={{
                              width: lanyard.activities.find(a => a.type === 2)?.timestamps 
                                ? `${Math.min(100, (currentTime * 1000) / (lanyard.activities.find(a => a.type === 2).timestamps.end - lanyard.activities.find(a => a.type === 2).timestamps.start) * 100)}%`
                                : '0%'
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-[8px] font-bold text-neutral-500 uppercase tracking-widest px-1">
                          <span>{Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(0).padStart(2, '0')}</span>
                          <span>-</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 opacity-20 min-h-[400px]">
                  <Music size={48} className="text-neutral-500" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.5em]">No Music Detected</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column: Activity & Discord Status */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-3 flex flex-col gap-6"
          >
            <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
                  <Gamepad2 size={16} className="text-indigo-400" />
                </div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Activity</span>
              </div>

              {lanyard?.activities.find((a: any) => a.type === 0) ? (
                (() => {
                  const activity = lanyard.activities.find((a: any) => a.type === 0);
                  const imageUrl = (() => {
                    const largeImage = activity.assets?.large_image;
                    if (!largeImage) return null;
                    if (largeImage.startsWith('mp:external/')) return `https://images-ext-1.discordapp.net/external/${largeImage.replace('mp:external/', '')}`;
                    return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${largeImage}.png`;
                  })();

                  return (
                    <div className="space-y-6 flex flex-col items-center">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-neutral-800">
                          {imageUrl ? <img src={imageUrl} className="w-full h-full object-cover" alt="Game" /> : <Gamepad2 className="w-full h-full p-6 text-white/5" />}
                        </div>
                        {activity.assets?.small_image && (
                          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full border-2 border-[#121212] overflow-hidden shadow-xl">
                            <img src={`https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.small_image}.png`} className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <h4 className="font-bold text-lg leading-tight mb-1">{activity.name}</h4>
                        <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider">{activity.details || 'In-Game'}</p>
                        {activity.state && <p className="text-neutral-600 text-xs mt-2 italic">{activity.state}</p>}
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="py-12 flex flex-col items-center justify-center opacity-20 gap-4">
                  <Disc3 size={24} className="text-neutral-500" />
                  <p className="text-[8px] font-bold uppercase tracking-widest">Idle State</p>
                </div>
              )}
            </div>

            {/* Quick Stats Panel */}
            <div className="bg-white/1 overflow-hidden backdrop-blur-md rounded-3xl border border-white/5 p-6 space-y-4">
               <div className="flex items-center justify-between opacity-50">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Local Time</span>
                  <span className="text-[11px] font-medium tracking-tight">
                    {localTime.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                  </span>
               </div>
               <div className="h-px bg-white/5" />
               <div className="flex items-center justify-between opacity-50">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Status</span>
                  <span className="text-[11px] font-medium tracking-tight flex items-center gap-2 capitalize">
                    <div className={`w-1.5 h-1.5 rounded-full ${lanyard ? statusColor(lanyard.discord_status) : 'bg-gray-500'}`} />
                    {lanyard?.discord_status || 'Offline'}
                  </span>
               </div>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Styles for custom volume slider scrollbar */}
      <style>{`
        input[type='range'] {
          -webkit-appearance: none;
          background: rgba(255, 255, 255, 0.1);
          height: 4px;
          border-radius: 2px;
          transition: all 0.3s;
        }
        input[type='range']:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px;
          height: 12px;
          background: #fff;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
}
