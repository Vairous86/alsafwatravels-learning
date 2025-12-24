import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface AudioPlayerProps {
  src: string;
  title: string;
  isActive: boolean;
  onPlay: () => void;
}

const AudioPlayer = ({ src, title, isActive, onPlay }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const isSrcAvailable = Boolean(src);

  useEffect(() => {
    if (!isActive && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (!isSrcAvailable) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      onPlay();
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    if (!audioRef.current) return;
    const newVolume = value[0];
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 1;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`gradient-card rounded-xl p-5 transition-all duration-300 ${
        isActive ? "shadow-gold ring-1 ring-primary/30" : "shadow-card hover:shadow-gold/50"
      }`}
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground mb-4 text-right">{title}</h3>

      {/* Progress bar */}
      <div className="mb-4">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleSeek}
          className="cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Volume */}
        <div className="flex items-center gap-2 w-32">
          <button
            onClick={toggleMute}
            className="p-2 rounded-full text-muted-foreground hover:text-primary transition-colors"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <Slider
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="cursor-pointer"
          />
        </div>

        {/* Play button */}
        <button
          onClick={togglePlay}
          disabled={!isSrcAvailable}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
            isPlaying
              ? "gradient-gold shadow-gold glow-gold"
              : "bg-secondary hover:bg-surface-hover border border-primary/30"
          }`}
        >
          {isPlaying ? (
            <Pause className="text-primary-foreground" size={24} />
          ) : (
            <Play className="text-primary ml-1" size={24} />
          )}
        </button>

        {/* Audio wave visualization */}
        <div className="flex items-center gap-1 w-32 justify-end">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-1 bg-primary rounded-full transition-all duration-300 ${
                isPlaying ? "audio-wave" : "h-2"
              }`}
              style={{
                animationDelay: `${i * 0.1}s`,
                opacity: isPlaying ? 1 : 0.3,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
