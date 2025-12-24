import { useState } from "react";
import AudioPlayer from "./AudioPlayer";
import { Globe, Plane, BookOpen, Users, MapPin, Info } from "lucide-react";

interface AudioTrack {
  id: string;
  title: string;
  fileName: string;
  icon: React.ReactNode;
  category: string;
}

const audioFiles = import.meta.glob("./sounds/*.m4a", { eager: true, as: "url" }) as Record<string, string>;

const getLocalAudioUrl = (fileName: string) => {
  return audioFiles[`./sounds/${fileName}`] ?? "";
};

const audioTracks: AudioTrack[] = [
  {
    id: "1",
    title: "مقدمة للباكجات السياحية",
    fileName: "مقدمة للباكدجات السياحية.m4a",
    icon: <BookOpen size={20} />,
    category: "أساسيات",
  },
  {
    id: "2",
    title: "شرح الباكج السياحي",
    fileName: "شرح الباكدج السياحي.m4a",
    icon: <Info size={20} />,
    category: "أساسيات",
  },
  {
    id: "3",
    title: "التقفيل وهندلة العملاء",
    fileName: "التقفيل وهندلة العملاء.m4a",
    icon: <Users size={20} />,
    category: "مهارات",
  },
  {
    id: "4",
    title: "تركيا",
    fileName: "تركيا.m4a",
    icon: <MapPin size={20} />,
    category: "وجهات",
  },
  {
    id: "5",
    title: "ماليزيا",
    fileName: "ماليزيا.m4a",
    icon: <Globe size={20} />,
    category: "وجهات",
  },
  {
    id: "6",
    title: "إندونيسيا",
    fileName: "إندونيسيا.m4a",
    icon: <Plane size={20} />,
    category: "وجهات",
  },
  {
    id: "7",
    title: "تايلاند",
    fileName: "تايلاند.m4a",
    icon: <Plane size={20} />,
    category: "وجهات",
  },
  {
    id: "8",
    title: "فيتنام",
    fileName: "فيتنام.m4a",
    icon: <Plane size={20} />,
    category: "وجهات",
  },
  {
    id: "9",
    title: "روسيا",
    fileName: "روسيا.m4a",
    icon: <Globe size={20} />,
    category: "وجهات",
  },
  {
    id: "10",
    title: "موريشوس",
    fileName: "موريشوس.m4a",
    icon: <Globe size={20} />,
    category: "وجهات",
  },
];

const AudioList = () => {
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");

  const categories = ["الكل", "أساسيات", "مهارات", "وجهات"];

  const filteredTracks =
    selectedCategory === "الكل"
      ? audioTracks
      : audioTracks.filter((track) => track.category === selectedCategory);

  const handlePlay = (trackId: string) => {
    setActiveTrackId(trackId);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      {/* Category filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedCategory === category
                ? "gradient-gold text-primary-foreground shadow-gold"
                : "bg-secondary text-secondary-foreground hover:bg-surface-hover border border-border"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Track count */}
      <div className="text-center text-muted-foreground mb-6">
        {filteredTracks.length} ملف صوتي
      </div>

      {/* Audio tracks grid */}
      <div className="grid gap-4">
        {filteredTracks.map((track, index) => (
          <div
            key={track.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start gap-4">
              {/* Track icon */}
              <div className="flex-shrink-0 w-12 h-12 gradient-gold rounded-xl flex items-center justify-center shadow-gold">
                <span className="text-primary-foreground">{track.icon}</span>
              </div>

              {/* Audio player */}
              <div className="flex-1">
                <AudioPlayer
                  src={getLocalAudioUrl(track.fileName)}
                  title={track.title}
                  isActive={activeTrackId === track.id}
                  onPlay={() => handlePlay(track.id)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          © جميع الحقوق محفوظة - المحتوى للاستخدام التعليمي فقط
        </p>
      </div>
    </div>
  );
};

export default AudioList;
