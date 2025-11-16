import type { University } from "@/lib/data/universities";
import { UniversityLogo } from "./university-logo";
import { HoverCard } from "./hover-card";

interface UniversityCardProps {
  university: University;
  degree: string;
  major: string;
  startYear: number;
  endYear?: number;
  size?: "sm" | "md" | "lg";
}

export function UniversityCard({
  university,
  degree,
  major,
  startYear,
  endYear,
  size = "md",
}: UniversityCardProps) {
  const sizeClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const logoSizes = {
    sm: 48,
    md: 64,
    lg: 80,
  };

  return (
    <div
      className={`${sizeClasses[size]} border rounded-xl hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50 group`}
    >
      <div className="flex items-start gap-4">
        {/* University Logo with Hover Card */}
        <HoverCard
          trigger={
            <a
              href={university.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 hover:scale-105 transition-transform cursor-pointer"
            >
              <UniversityLogo
                university={university}
                size={logoSizes[size]}
                className="ring-2 ring-transparent group-hover:ring-primary/20 transition-all"
              />
            </a>
          }
          content={
            <div className="space-y-3">
              <div>
                <div className="font-semibold text-lg flex items-center gap-2">
                  {university.name}
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                    #{university.ranking}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {university.nameEn}
                </div>
              </div>
              
              <div className="text-sm leading-relaxed">{university.description}</div>
              
              <div className="flex items-center gap-4 text-sm pt-2 border-t">
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">📍</span>
                  <span>{university.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">🏆</span>
                  <span>台灣 #{university.ranking}</span>
                </div>
              </div>
              
              <a
                href={university.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1 pt-2"
              >
                訪問官網
                <span>→</span>
              </a>
            </div>
          }
        />

        {/* Education Details */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-lg mb-1 truncate">
            {university.shortName}
          </div>
          <div className="text-muted-foreground text-sm mb-2">
            {degree} • {major}
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              📅 {startYear} - {endYear || "現在"}
            </span>
          </div>
        </div>

        {/* Ranking Badge */}
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
              <div className="text-center">
                <div className="text-xs font-medium text-white">台灣</div>
                <div className="text-2xl font-bold text-white">#{university.ranking}</div>
              </div>
            </div>
            {university.ranking <= 3 && (
              <div className="absolute -top-1 -right-1 text-2xl animate-bounce">
                🏆
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

