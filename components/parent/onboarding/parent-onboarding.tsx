"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AvailabilitySelector } from "./availability-selector";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface ParentOnboardingProps {
  user: any;
}

export function ParentOnboarding({ user }: ParentOnboardingProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    parentName: "",
    phone: "",
    studentName: "",
    grade: "",
    notes: "",
    availability: [] as { day: number; startTime: string; endTime: string }[]
  });

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      // 1. Update/Create Parent Profile with onboarding_completed = true
      const { data: parentProfile, error: parentError } = await supabase
        .from("parent_profiles")
        .upsert({
          user_id: user.id,
          name: formData.parentName,
          phone: formData.phone,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })
        .select()
        .single();

      if (parentError) throw parentError;

      // 2. Create Student Profile
      const { error: studentError } = await supabase
        .from("students")
        .insert({
          parent_id: parentProfile.id,
          name: formData.studentName,
          grade_level: formData.grade,
          notes: formData.notes,
        });

      if (studentError) throw studentError;

      // 3. Save Availability
      if (formData.availability.length > 0) {
        const availabilityData = formData.availability.map(slot => ({
          parent_id: parentProfile.id,
          day_of_week: slot.day,
          start_time: slot.startTime,
          end_time: slot.endTime,
          is_available: true
        }));

        const { error: availError } = await supabase
          .from("parent_availability")
          .insert(availabilityData);

        if (availError) throw availError;
      }

      // Redirect to dashboard
      router.push("/parent/dashboard");
      router.refresh();

    } catch (error) {
      console.error("Error saving parent profile:", error);
      // @ts-ignore
      alert(`發生錯誤: ${error?.message || "請稍後再試"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-black transition-all duration-500 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
          <span className={step >= 1 ? "text-black" : ""}>基本資料</span>
          <span className={step >= 2 ? "text-black" : ""}>學生資訊</span>
          <span className={step >= 3 ? "text-black" : ""}>方便時間</span>
        </div>
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2">歡迎來到 PinPin</h1>
            <p className="text-gray-500">讓我們花點時間認識您</p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="parentName">家長姓名</Label>
              <Input 
                id="parentName" 
                placeholder="您的稱呼" 
                value={formData.parentName}
                onChange={e => setFormData({...formData, parentName: e.target.value})}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">聯絡電話</Label>
              <Input 
                id="phone" 
                placeholder="09xx-xxx-xxx" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="h-12"
              />
            </div>
          </div>

          <Button 
            onClick={handleNext} 
            className="w-full h-12 bg-black text-white rounded-xl mt-8"
            disabled={!formData.parentName || !formData.phone}
          >
            下一步
          </Button>
        </div>
      )}

      {/* Step 2: Student Info */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2">學生的學習狀況</h1>
            <p className="text-gray-500">幫助老師了解學生的需求</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="studentName">學生姓名（或暱稱）</Label>
              <Input 
                id="studentName" 
                value={formData.studentName}
                onChange={e => setFormData({...formData, studentName: e.target.value})}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">目前年級</Label>
              <Input 
                id="grade" 
                placeholder="例如：國二、高一" 
                value={formData.grade}
                onChange={e => setFormData({...formData, grade: e.target.value})}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">學習需求或備註</Label>
              <Textarea 
                id="notes" 
                placeholder="例如：數學基礎較弱，希望能加強幾何觀念..." 
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
                className="min-h-[120px] resize-none"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <Button variant="outline" onClick={handleBack} className="flex-1 h-12 rounded-xl">
              上一步
            </Button>
            <Button 
              onClick={handleNext} 
              className="flex-1 h-12 bg-black text-white rounded-xl"
              disabled={!formData.studentName || !formData.grade}
            >
              下一步
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Availability */}
      {step === 3 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2">設定方便時間</h1>
            <p className="text-gray-500">這能幫助系統為您媒合時間相符的教師</p>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 text-sm text-blue-700 flex items-start gap-3">
            <span className="text-xl">💡</span>
            <p className="leading-relaxed">
              請在下方表格中「拖曳」選取您方便上課的時段。<br/>
              設定後，您在瀏覽教師個人頁面時，系統會自動標示出你們的共同空檔。
            </p>
          </div>

          <AvailabilitySelector 
            value={formData.availability}
            onChange={val => setFormData({...formData, availability: val})}
          />

          <div className="flex gap-4 mt-8">
            <Button variant="outline" onClick={handleBack} className="flex-1 h-12 rounded-xl">
              上一步
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading}
              className="flex-1 h-12 bg-black text-white rounded-xl"
            >
              {isLoading ? "設定中..." : "完成設定"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
