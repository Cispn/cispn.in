import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, HelpCircle, Play, SkipBack, SkipForward, Maximize2, Volume2, Mic2 } from 'lucide-react';

const Stars = () => {
  const [stars, setStars] = useState<{ id: number; top: string; left: string; size: string; opacity: number }[]>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2}px`,
      opacity: Math.random() * 0.5 + 0.1,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="stars-container">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [volume, setVolume] = useState(0.5);
  const [showLyrics, setShowLyrics] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const tabs = ['home', 'projects', 'biolinks', 'socials'];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const formatTime = (time: number) => {
      if (isNaN(time)) return '0:00';
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const updateProgress = () => {
      const current = audio.currentTime;
      const total = audio.duration;
      setProgress((current / total) * 100 || 0);
      setCurrentTime(formatTime(current));
    };

    const updateDuration = () => {
      setDuration(formatTime(audio.duration));
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime('0:00');
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    audio.currentTime = percentage * audio.duration;
    setProgress(percentage * 100);
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newVolume = Math.max(0, Math.min(1, x / rect.width));
    setVolume(newVolume);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <Stars />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md bg-black/30 backdrop-blur-sm rounded-xl border border-zinc-800/30 overflow-visible shadow-2xl"
      >
        <div className="flex items-center p-2 border-b border-zinc-800/30 gap-2">
          <div className="flex min-w-0 overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${activeTab === tab ? 'text-white' : 'text-gray-500'} px-2 py-1 text-xs transition-colors whitespace-nowrap flex-shrink-0 hover:text-white`}
                style={{opacity: 1}}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-auto flex-shrink-0">
            <button className="relative flex items-center gap-1 bg-zinc-900/60 hover:bg-zinc-800/60 transition-colors rounded-full px-2 py-0.5 text-[0.65rem] text-gray-400" tabIndex={0} style={{transform: "none"}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye text-gray-500"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              <span>11,089</span>
            </button>
            <button className="text-xs text-gray-400 hover:text-white transition-colors ">[?]</button>
          </div>
        </div>
        <div className="p-4">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6">
                  <h1 className="text-3xl text-white mb-0 font-proggy leading-none">cardinal</h1>
                  <p className="text-gray-400 text-xs leading-none">full stack developer specializing in modern web technologies</p>
                </div>
                <div className="bg-zinc-900/20 rounded border border-zinc-800/30 mb-6 p-2" style={{opacity: 1}}>
                  <div className="flex gap-2 relative overflow-hidden rounded-lg p-1 items-start">
                    <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none" style={{opacity: 1}}>
                      <video className="w-full h-full object-cover scale-105" loop playsInline autoPlay muted preload="auto" src="https://cdn.discordapp.com/media/v1/collectibles-shop/1377377712028516443/video" style={{opacity: 1}}></video>
                    </div>
                    <div className="absolute inset-0 rounded-lg pointer-events-none" style={{background: "linear-gradient(90deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.3) 100%)", boxShadow: "rgba(255, 255, 255, 0.15) 0px 0px 0px 1px inset"}}></div>
                    <div className="relative flex-shrink-0 z-10 mt-0.5">
                      <img src="https://i.ibb.co/rXdmmJW/image.png" alt="avatar" className="w-[30px] h-[30px] rounded-full" />
                      <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full border border-zinc-900 z-20 bg-gray-500"></div>
                    </div>
                    <div className="flex flex-col flex-1 relative z-10 min-w-0 ">
                      <div className="flex items-center gap-1">
                        <span className="text-[0.75rem] text-gray-200">Cardinal</span>
                        <span className="flex items-center gap-1">
                          <div className="relative flex-shrink-0">
                            <img src="https://cdn.discordapp.com/badge-icons/2ba85e8026a8614b640c2837bcdfe21b.png" alt="Subscriber since Mar 31, 2026" className="w-4 h-4 object-contain opacity-80 hover:opacity-100 transition-opacity" />
                          </div>
                        </span>
                      </div>
                      <button className="group relative w-fit outline-none select-none cursor-pointer">
                        <span className="relative block text-[0.7rem] leading-none -mt-px">
                          <span className="relative block text-gray-400">@_cardinal._<span className="absolute bottom-0 left-0 w-full h-px bg-gray-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span></span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'projects' && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-3 mb-6"
                style={{opacity: 1, transform: "none"}}
              >
                <h2 className="text-lg font-semibold mb-3">projects</h2>
                <div className="relative rounded-lg border border-zinc-800/40 overflow-hidden" style={{background: "radial-gradient(at left top, rgba(80, 80, 180, 0.18) 0%, transparent 55%), radial-gradient(at right bottom, rgba(80, 80, 180, 0.13) 0%, transparent 55%), rgba(10, 10, 10, 0.5)", backdropFilter: "blur(24px)", boxShadow: "rgba(255, 255, 255, 0.05) 0px 1px 0px inset, rgba(80, 80, 180, 0.07) 0px 0px 0px 1px inset", transition: "background 1.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 1.4s cubic-bezier(0.16, 1, 0.3, 1)", opacity: 1, transform: "none"}}>
                  <div className="relative z-10 p-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <img src="https://picsum.photos/seed/heist/200/200" alt="Heist" className="w-9 h-9 rounded-lg" style={{boxShadow: "rgba(255, 255, 255, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.4) 0px 4px 12px"}} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-white">Heist</span>
                            <span className="text-[0.62rem] px-1.5 py-0.5 rounded-full border text-gray-300" style={{background: "rgba(255, 255, 255, 0.05)", borderColor: "rgba(255, 255, 255, 0.1)", opacity: 1, transform: "none"}}>555k+ users</span>
                          </div>
                          <a href="https://heist.lol" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link "><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg>
                          </a>
                        </div>
                        <p className="text-[0.7rem] text-gray-400 leading-relaxed mb-2">Discord App focused on enhancing your chats.</p>
                        <div className="flex gap-1.5 flex-wrap">
                          <a href="https://python.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[0.6rem] px-1.5 py-0.5 rounded border transition-opacity hover:opacity-70" style={{background: "transparent", borderColor: "rgba(106, 176, 212, 0.2)", color: "rgb(106, 176, 212)"}}>
                            <svg width="9" height="9" viewBox="0 0 256 255" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M126.9 0C56.8 0 60.8 30.8 60.8 30.8l.1 31.9h67.3v9.6H38.3S0 67.8 0 138.5s33.4 67.9 33.4 67.9H54v-32.7s-1.1-33.4 32.9-33.4h56.7s31.8.5 31.8-30.7V32.2S181 0 126.9 0zM92.5 18.5c5.7 0 10.3 4.6 10.3 10.3S98.2 39 92.5 39s-10.3-4.6-10.3-10.3 4.6-10.2 10.3-10.2z" fill="#6ab0d4"></path><path d="M129.1 254.8c70.1 0 66.1-30.8 66.1-30.8l-.1-31.9h-67.3v-9.6h89.9s38.3 4.5 38.3-66.2-33.4-67.9-33.4-67.9H202v32.7s1.1 33.4-32.9 33.4h-56.7s-31.8-.5-31.8 30.7v63.4s-4.8 46.2 48.5 46.2zm34.4-18.5c-5.7 0-10.3-4.6-10.3-10.3s4.6-10.3 10.3-10.3 10.3 4.6 10.3 10.3-4.6 10.3-10.3 10.3z" fill="#ffd845"></path></svg>
                            Python
                          </a>
                          <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[0.6rem] px-1.5 py-0.5 rounded border transition-opacity hover:opacity-70" style={{background: "transparent", borderColor: "rgba(255, 255, 255, 0.2)", color: "rgba(255, 255, 255, 0.7)"}}>
                            <svg width="9" height="9" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><path d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64c11.2 0 21.7-2.9 30.8-7.9L48.4 55.3v36.6H35.1V41.5h27.5l67.5 84.2c-11.9 7.6-26 12.3-41.3 12.3-41.8 0-75.7-33.9-75.7-75.7S22.2 0 64 0zm23.1 41.5h13.1v41.6L87.1 68.2V41.5zm22.7 77.1l-55.5-69h16.3l55.4 69.1c-5.1 3.5-10.7 6.3-16.2 8z" fill="currentColor"></path></svg>
                            Next.js
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3" style={{borderTop: "1px solid rgba(255, 255, 255, 0.06)"}}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src="https://cdn.discordapp.com/icons/1443723893234728993/532a059635b1f585cb8d999edd58c1e1.webp?size=32" alt="Server" className="w-5 h-5 rounded-full" style={{boxShadow: "rgba(255, 255, 255, 0.08) 0px 0px 0px 1px"}} />
                          <div>
                            <a href="https://discord.gg/heistbot" target="_blank" rel="noopener noreferrer" className="text-[0.62rem] text-gray-300 hover:text-white transition-colors leading-none block">Heist App</a>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="flex items-center gap-1 text-[0.55rem] text-gray-500"><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>1,709 online</span>
                              <span className="flex items-center gap-1 text-[0.55rem] text-gray-500"><span className="w-1.5 h-1.5 rounded-full bg-gray-600 inline-block"></span>9,231 members</span>
                            </div>
                          </div>
                        </div>
                        <a href="https://discord.gg/heistbot" target="_blank" rel="noopener noreferrer" className="text-[0.6rem] px-2 py-0.5 rounded border text-gray-400 hover:text-white hover:border-white/20 transition-colors flex-shrink-0" style={{background: "rgba(255, 255, 255, 0.04)", borderColor: "rgba(255, 255, 255, 0.08)"}}>join</a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'biolinks' && (
              <motion.div
                key="biolinks"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-3 mb-6"
              >
                <h2 className="text-lg font-semibold mb-3">biolinks</h2>
                <a href="https://guns.lol/_cardinal._" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg border p-2.5 cursor-pointer block" tabIndex={0} style={{background: "linear-gradient(160deg, rgba(120, 80, 180, 0.42) 0%, rgba(120, 80, 180, 0.18) 50%, rgba(10, 10, 10, 0.12) 100%)", borderColor: "rgba(120, 80, 180, 0.35)", backdropFilter: "blur(24px)", boxShadow: "rgba(120, 80, 180, 0.14) 0px 4px 32px 0px, rgba(255, 255, 255, 0.06) 0px 1px 0px inset, rgba(0, 0, 0, 0.1) 0px -1px 0px inset", transition: "box-shadow 1.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 1.4s cubic-bezier(0.16, 1, 0.3, 1)", textDecoration: "none", opacity: 1, transform: "none"}}>
                  <img src="https://cursi.ng/guns.lol" alt="guns.lol" className="w-7 h-7 rounded-md flex-shrink-0" style={{opacity: 1, transform: "none"}} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[0.72rem] font-medium text-gray-100 leading-tight" style={{opacity: 1, transform: "none"}}>guns.lol</div>
                    <div className="flex items-center gap-1 mt-0.5" style={{opacity: 1, transform: "none"}}>
                      <span className="text-[0.6rem] text-gray-400 leading-tight">@_cardinal._</span>
                      <svg width="11" height="11" viewBox="0 0 22 22" style={{flexShrink: 0, display: "block", willChange: "filter", filter: "drop-shadow(rgba(120, 80, 180, 0.9) 0px 0px 3px)"}}>
                        <circle cx="11" cy="11" r="11" fill="rgb(120, 80, 180)"></circle>
                        <polyline points="6,11 9.5,14.5 16,8" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"></polyline>
                      </svg>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-gray-500" style={{opacity: 1}}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 17L17 7M7 7h10v10"></path>
                    </svg>
                  </div>
                </a>
              </motion.div>
            )}

            {activeTab === 'socials' && (
              <motion.div
                key="socials"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-3 mb-6"
              >
                <h2 className="text-lg font-semibold mb-3">socials</h2>
                <p className="text-gray-400 text-xs">Coming soon...</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6">
            <audio ref={audioRef} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" loop preload="auto" />
            <div className="rounded-lg border overflow-hidden" style={{background: "linear-gradient(160deg, rgba(20, 20, 20, 0.42) 0%, rgba(20, 20, 20, 0.18) 50%, rgba(10, 10, 10, 0.12) 100%)", borderColor: "rgba(20, 20, 20, 0.35)", backdropFilter: "blur(24px)", boxShadow: "rgba(255, 255, 255, 0.06) 0px 1px 0px inset, rgba(0, 0, 0, 0.1) 0px -1px 0px inset", transition: "box-shadow 1.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 1.4s cubic-bezier(0.16, 1, 0.3, 1)"}}>
              <div className="flex items-center gap-2.5 px-2 pt-2 pb-1.5">
                <div className="relative cursor-pointer rounded-sm overflow-hidden flex-shrink-0" style={{height: "36px", pointerEvents: "auto", width: "36px", opacity: 1}}>
                  <img src="https://picsum.photos/seed/duel/200/200" alt="Duel (Versus Reprise)" className="absolute inset-0 w-9 h-9 object-cover rounded-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{opacity: 1, transform: "none"}}>
                    <p className="text-[0.7rem] text-gray-200 truncate leading-tight cursor-pointer hover:text-white transition-colors">Duel (Versus Reprise)</p>
                    <p className="text-[0.58rem] text-gray-400 truncate leading-tight mt-0.5">Heaven Pierce Her</p>
                  </div>
                </div>
                <span className="text-[0.52rem] text-zinc-600 tabular-nums flex-shrink-0">01/09</span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="text-zinc-600 hover:text-zinc-300 transition-colors" tabIndex={0}><svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor"><rect x="0" y="0" width="2" height="11" rx="1"></rect><polygon points="10,0.8 3,5.5 10,10.2"></polygon></svg></button>
                  <button onClick={togglePlay} className="w-[14px] h-[14px] rounded-full flex items-center justify-center text-white active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none bg-white/10 hover:bg-white/20 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
                    <svg width="11" height="11" viewBox="0 0 10 10" fill="currentColor">
                      {isPlaying ? (
                        <g><rect x="2.5" y="2" width="1.5" height="6" /><rect x="6" y="2" width="1.5" height="6" /></g>
                      ) : (
                        <polygon points="2.5,1.5 2.5,8.5 8.5,5"></polygon>
                      )}
                    </svg>
                  </button>
                  <button className="text-zinc-600 hover:text-zinc-300 transition-colors" tabIndex={0}><svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor"><rect x="9" y="0" width="2" height="11" rx="1"></rect><polygon points="1,0.8 8,5.5 1,10.2"></polygon></svg></button>
                  <button className="text-zinc-700 hover:text-zinc-400 transition-colors ml-0.5" tabIndex={0} style={{transform: "none"}}><svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"><polyline points="6,1 9,1 9,4"></polyline><polyline points="4,9 1,9 1,6"></polyline><line x1="9" y1="1" x2="5.5" y2="4.5"></line><line x1="1" y1="9" x2="4.5" y2="5.5"></line></svg></button>
                </div>
              </div>
              <div className="h-[2px] bg-zinc-800 cursor-pointer relative group mx-2" onClick={handleSeek}>
                <div className="h-full absolute top-0 left-0 transition-colors duration-100 bg-zinc-500 group-hover:bg-zinc-300" style={{width: `${progress}%`}}></div>
                <div className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1/2 pointer-events-none" style={{left: `${progress}%`}}></div>
              </div>
              <div className="flex items-center justify-between px-2 pt-1 pb-2">
                <span className="text-[0.52rem] text-zinc-600 tabular-nums">{currentTime} / {duration}</span>
                <div className="flex gap-[3px] items-center">
                  <button className="rounded-full transition-all w-3 h-1 bg-zinc-400"></button>
                  <button className="rounded-full transition-all w-1 h-1 bg-zinc-700 hover:bg-zinc-500"></button>
                  <button className="rounded-full transition-all w-1 h-1 bg-zinc-700 hover:bg-zinc-500"></button>
                  <button className="rounded-full transition-all w-1 h-1 bg-zinc-700 hover:bg-zinc-500"></button>
                  <button className="rounded-full transition-all w-1 h-1 bg-zinc-700 hover:bg-zinc-500"></button>
                  <button className="rounded-full transition-all w-1 h-1 bg-zinc-700 hover:bg-zinc-500"></button>
                  <button className="rounded-full transition-all w-1 h-1 bg-zinc-700 hover:bg-zinc-500"></button>
                  <button className="rounded-full transition-all w-1 h-1 bg-zinc-700 hover:bg-zinc-500"></button>
                  <button className="rounded-full transition-all w-1 h-1 bg-zinc-700 hover:bg-zinc-500"></button>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setShowLyrics(!showLyrics)} className={`text-zinc-600 hover:text-zinc-300 transition-colors ${showLyrics ? 'text-zinc-300' : ''}`}>
                    <Mic2 size={11} />
                  </button>
                  <span className="text-zinc-600"><svg width="10" height="9" viewBox="0 0 10 9" fill="currentColor"><polygon points="0,3 3,3 5.5,1 5.5,8 3,6 0,6"></polygon><path d="M7 2.5 Q9 4.5 7 6.5" stroke="currentColor" strokeWidth="0.9" fill="none" strokeLinecap="round"></path></svg></span>
                  <div className="group w-10 h-[2px] bg-zinc-800 cursor-pointer relative" onClick={handleVolumeChange}><div className="h-full absolute top-0 left-0 bg-zinc-500 group-hover:bg-zinc-300 transition-colors" style={{width: `${volume * 100}%`}}></div></div>
                </div>
              </div>
              <div style={{overflow: "hidden", height: "0px"}}>
                <div className="flex border-t" style={{height: "88px", borderColor: "rgba(20, 20, 20, 0.18)"}}>
                  <div className="relative flex-shrink-0 cursor-pointer" tabIndex={0} style={{width: "88px", height: "88px"}}>
                    <img src="https://picsum.photos/seed/duel/200/200" alt="Duel (Versus Reprise)" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0" style={{height: "88px", overflowY: "auto", scrollbarWidth: "none"}}>
                    <button className="w-full flex items-center gap-2 px-2 py-[5px] text-left transition-colors bg-zinc-800/40"><span className="text-[0.5rem] tabular-nums flex-shrink-0 text-zinc-400">01</span><span className="text-[0.62rem] truncate flex-1 text-gray-100">Duel (Versus Reprise)</span><span className="flex-shrink-0 text-zinc-600"><svg width="6" height="7" viewBox="0 0 6 7" fill="currentColor"><polygon points="0,0 6,3.5 0,7"></polygon></svg></span></button>
                    <button className="w-full flex items-center gap-2 px-2 py-[5px] text-left transition-colors hover:bg-zinc-800/20"><span className="text-[0.5rem] tabular-nums flex-shrink-0 text-zinc-700">02</span><span className="text-[0.62rem] truncate flex-1 text-zinc-500">Yayo</span></button>
                    <button className="w-full flex items-center gap-2 px-2 py-[5px] text-left transition-colors hover:bg-zinc-800/20"><span className="text-[0.5rem] tabular-nums flex-shrink-0 text-zinc-700">03</span><span className="text-[0.62rem] truncate flex-1 text-zinc-500">Inside Out</span></button>
                    <button className="w-full flex items-center gap-2 px-2 py-[5px] text-left transition-colors hover:bg-zinc-800/20"><span className="text-[0.5rem] tabular-nums flex-shrink-0 text-zinc-700">04</span><span className="text-[0.62rem] truncate flex-1 text-zinc-500">Highway Patrol</span></button>
                    <button className="w-full flex items-center gap-2 px-2 py-[5px] text-left transition-colors hover:bg-zinc-800/20"><span className="text-[0.5rem] tabular-nums flex-shrink-0 text-zinc-700">05</span><span className="text-[0.62rem] truncate flex-1 text-zinc-500">Bleach</span></button>
                    <button className="w-full flex items-center gap-2 px-2 py-[5px] text-left transition-colors hover:bg-zinc-800/20"><span className="text-[0.5rem] tabular-nums flex-shrink-0 text-zinc-700">06</span><span className="text-[0.62rem] truncate flex-1 text-zinc-500">Snowmen</span></button>
                    <button className="w-full flex items-center gap-2 px-2 py-[5px] text-left transition-colors hover:bg-zinc-800/20"><span className="text-[0.5rem] tabular-nums flex-shrink-0 text-zinc-700">07</span><span className="text-[0.62rem] truncate flex-1 text-zinc-500">Dolemite</span></button>
                    <button className="w-full flex items-center gap-2 px-2 py-[5px] text-left transition-colors hover:bg-zinc-800/20"><span className="text-[0.5rem] tabular-nums flex-shrink-0 text-zinc-700">08</span><span className="text-[0.62rem] truncate flex-1 text-zinc-500">Side by Side</span></button>
                    <button className="w-full flex items-center gap-2 px-2 py-[5px] text-left transition-colors hover:bg-zinc-800/20"><span className="text-[0.5rem] tabular-nums flex-shrink-0 text-zinc-700">09</span><span className="text-[0.62rem] truncate flex-1 text-zinc-500">dcdcdc</span></button>
                  </div>
                </div>
                <div className="h-[2px] bg-zinc-800 cursor-pointer relative group " onClick={handleSeek}>
                  <div className="h-full absolute top-0 left-0 transition-colors duration-100 bg-zinc-500 group-hover:bg-zinc-300" style={{width: `${progress}%`}}></div>
                  <div className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1/2 pointer-events-none" style={{left: `${progress}%`}}></div>
                </div>
                <div className="flex items-center gap-2 px-2" style={{height: "32px"}}>
                  <button className="text-zinc-600 hover:text-zinc-300 transition-colors" tabIndex={0}><svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor"><rect x="0" y="0" width="2" height="11" rx="1"></rect><polygon points="10,0.8 3,5.5 10,10.2"></polygon></svg></button>
                  <button onClick={togglePlay} className="w-[14px] h-[14px] rounded-full flex items-center justify-center text-white active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none bg-white/10 hover:bg-white/20 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
                    <svg width="11" height="11" viewBox="0 0 10 10" fill="currentColor">
                      {isPlaying ? (
                        <g><rect x="2.5" y="2" width="1.5" height="6" /><rect x="6" y="2" width="1.5" height="6" /></g>
                      ) : (
                        <polygon points="2.5,1.5 2.5,8.5 8.5,5"></polygon>
                      )}
                    </svg>
                  </button>
                  <button className="text-zinc-600 hover:text-zinc-300 transition-colors" tabIndex={0}><svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor"><rect x="9" y="0" width="2" height="11" rx="1"></rect><polygon points="1,0.8 8,5.5 1,10.2"></polygon></svg></button>
                  <span className="text-[0.52rem] text-zinc-600 tabular-nums ml-0.5">{currentTime} / {duration}</span>
                  <div className="flex-1"></div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setShowLyrics(!showLyrics)} className={`text-zinc-600 hover:text-zinc-300 transition-colors ${showLyrics ? 'text-zinc-300' : ''}`}>
                      <Mic2 size={11} />
                    </button>
                    <span className="text-zinc-600"><svg width="10" height="9" viewBox="0 0 10 9" fill="currentColor"><polygon points="0,3 3,3 5.5,1 5.5,8 3,6 0,6"></polygon><path d="M7 2.5 Q9 4.5 7 6.5" stroke="currentColor" strokeWidth="0.9" fill="none" strokeLinecap="round"></path></svg></span>
                    <div className="group w-10 h-[2px] bg-zinc-800 cursor-pointer relative" onClick={handleVolumeChange}><div className="h-full absolute top-0 left-0 bg-zinc-500 group-hover:bg-zinc-300 transition-colors" style={{width: `${volume * 100}%`}}></div></div>
                  </div>
                </div>
              </div>
              <div style={{overflow: "hidden", height: showLyrics ? "120px" : "0px", transition: "height 0.3s ease"}}>
                <div className="flex flex-col border-t p-3" style={{height: "120px", borderColor: "rgba(20, 20, 20, 0.18)", overflowY: "auto", scrollbarWidth: "none"}}>
                  <p className="text-[0.65rem] text-gray-400 text-center italic mb-2">Duel (Versus Reprise) - Heaven Pierce Her</p>
                  <p className="text-[0.65rem] text-gray-300 text-center leading-relaxed">
                    [Instrumental Intro]<br/>
                    <br/>
                    (This track is an instrumental piece from the ULTRAKILL soundtrack.)<br/>
                    <br/>
                    [Intense Breakbeat]<br/>
                    <br/>
                    [Guitar Solo]<br/>
                    <br/>
                    [Outro]
                  </p>
                </div>
              </div>
            </div>
          </div>
          <audio src="sounds/Yayo.mp3" preload="auto"></audio>
        </div>
      </motion.div>

      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
}
