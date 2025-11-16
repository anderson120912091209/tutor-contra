import type { Education } from "@/lib/types/database";
import { getUniversityById } from "@/lib/data/universities";
import { UniversityCard } from "@/components/ui/university-card";

interface EducationDisplayProps {
  education: Education[];
}

export function EducationDisplay({ education }: EducationDisplayProps) {
  if (education.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">學歷背景</h2>
        <div className="text-sm text-muted-foreground">
          {education.length} 項學歷
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-1">
        {education.map((edu, index) => {
          let university = getUniversityById(edu.universityId);
          
          // If not in local database but has website, create temporary university object
          if (!university && edu.website) {
            university = {
              id: edu.universityId,
              name: edu.university,
              nameEn: edu.university,
              shortName: edu.university,
              logo: "🎓",
              description: `${edu.university} - ${edu.country || "International University"}`,
              ranking: 0,
              website: edu.website,
              location: edu.country || "International",
            };
          }
          
          if (!university) {
            // Fallback for universities without website
            return (
              <div
                key={index}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 text-4xl">🎓</div>
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{edu.university}</div>
                    <div className="text-muted-foreground">
                      {edu.degree} • {edu.major}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {edu.startYear} - {edu.endYear || "現在"}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <UniversityCard
              key={index}
              university={university}
              degree={edu.degree}
              major={edu.major}
              startYear={edu.startYear}
              endYear={edu.endYear}
              size="lg"
            />
          );
        })}
      </div>
    </section>
  );
}

