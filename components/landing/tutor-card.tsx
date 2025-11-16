import Image from "next/image";
import type { TutorProfile } from "@/lib/types/database";

interface TutorCardProps {
  tutor: TutorProfile & {
    stats?: {
      total_verified_hours: number;
      total_students: number;
      average_rating: number;
    };
  };
  onClick: () => void;
}

export function TutorCard({ tutor, onClick }: TutorCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 text-left w-full"
    >
      {/* Cover Image or Gradient */}
      <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600 relative">
        {tutor.avatar_photo_url && (
          <Image
            src={tutor.avatar_photo_url}
            alt={tutor.display_name}
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Avatar */}
        <div className="flex items-start gap-3 mb-3">
          <div className="relative w-12 h-12 rounded-full border-2 border-white -mt-8 bg-gray-100 flex-shrink-0 overflow-hidden">
            {tutor.avatar_photo_url ? (
              <Image
                src={tutor.avatar_photo_url}
                alt={tutor.display_name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg font-bold text-gray-600">
                {tutor.display_name[0]}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
              {tutor.display_name}
            </h3>
            {tutor.location && (
              <p className="text-xs text-muted-foreground">📍 {tutor.location}</p>
            )}
          </div>
        </div>

        {/* Subjects */}
        {tutor.subjects && tutor.subjects.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tutor.subjects.slice(0, 3).map((subject) => (
              <span
                key={subject}
                className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium"
              >
                {subject}
              </span>
            ))}
            {tutor.subjects.length > 3 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                +{tutor.subjects.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Bio Preview */}
        {tutor.bio && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {tutor.bio}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground border-t pt-3">
          {tutor.stats?.total_verified_hours ? (
            <div className="flex items-center gap-1">
              <span>⏱️</span>
              <span>{tutor.stats.total_verified_hours}h</span>
            </div>
          ) : null}
          {tutor.stats?.total_students ? (
            <div className="flex items-center gap-1">
              <span>👨‍🎓</span>
              <span>{tutor.stats.total_students}</span>
            </div>
          ) : null}
          {tutor.stats?.average_rating ? (
            <div className="flex items-center gap-1">
              <span>⭐</span>
              <span>{tutor.stats.average_rating.toFixed(1)}</span>
            </div>
          ) : null}
          {tutor.years_experience && (
            <div className="flex items-center gap-1">
              <span>📚</span>
              <span>{tutor.years_experience}年</span>
            </div>
          )}
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 border-2 border-primary rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </button>
  );
}

