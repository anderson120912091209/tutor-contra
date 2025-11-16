"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UniversityAutocompleteGlobal } from "./university-autocomplete-global";
import Image from "next/image";

const welcomeSchema = z.object({
  fullName: z.string().min(1, "請輸入您的全名"),
  university: z.string().min(1, "請選擇您的畢業學校"),
  universityWebsite: z.string().optional(),
  universityCountry: z.string().optional(),
});

type WelcomeFormData = z.infer<typeof welcomeSchema>;

interface WelcomeOnboardingProps {
  onComplete: (data: WelcomeFormData) => void;
}

export function WelcomeOnboarding({ onComplete }: WelcomeOnboardingProps) {
  const [step, setStep] = useState<"welcome" | "method" | "form">("welcome");
  const [selectedMethod, setSelectedMethod] = useState<"auto" | "manual" | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<{
    name: string;
    website?: string;
    country?: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<WelcomeFormData>({
    resolver: zodResolver(welcomeSchema),
    mode: "onChange",
  });

  const onSubmit = (data: WelcomeFormData) => {
    onComplete(data);
  };

  const handleUniversitySelect = (university: {
    name: string;
    universityId: string;
    website: string;
    country?: string;
  }) => {
    setSelectedUniversity({
      name: university.name,
      website: university.website,
      country: university.country,
    });
    setValue("university", university.name, { shouldValidate: true });
    setValue("universityWebsite", university.website);
    if (university.country) {
      setValue("universityCountry", university.country);
    }
  };

  const steps: Array<"welcome" | "method" | "form"> = ["welcome", "method", "form"];
  const currentStepIndex = steps.indexOf(step);
  const canGoBack = currentStepIndex > 0;
  const canGoForward = currentStepIndex < steps.length - 1;

  const handlePrevious = () => {
    if (canGoBack) {
      const prevStep = steps[currentStepIndex - 1];
      setStep(prevStep);
    }
  };

  const handleNext = () => {
    if (step === "method" && !selectedMethod) {
      return; // Don't proceed if method not selected
    }
    if (canGoForward) {
      const nextStep = steps[currentStepIndex + 1];
      setStep(nextStep);
    }
  };

  const handleMethodSelect = (method: "auto" | "manual") => {
    setSelectedMethod(method);
    // Auto proceed to next step after selection
    setTimeout(() => {
      if (method === "manual") {
        setStep("form");
      } else {
        // For auto method, you might want to show a different flow
        // For now, also go to form
        setStep("form");
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Navigation Arrows */}
      <div className="absolute top-6 left-0 right-0 flex justify-between items-center px-6 z-10">
        {/* Previous Arrow */}
        <button
          onClick={handlePrevious}
          disabled={!canGoBack}
          className={`p-2 rounded-lg transition-all ${
            canGoBack
              ? "hover:bg-gray-100 cursor-pointer"
              : "opacity-30 cursor-not-allowed"
          }`}
          aria-label="上一步"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: canGoBack ? "#373737" : "#737373" }}
          >
            <path
              d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64038 12.0535 8.32396 12.0433 8.1351 11.8419L4.3851 7.84188C4.20055 7.64955 4.20055 7.35027 4.3851 7.15794L8.1351 3.15794C8.32396 2.95649 8.64038 2.94628 8.84182 3.13514Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Step Indicator */}
        <div className="flex items-center gap-2">
          {steps.map((s, index) => (
            <div
              key={s}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                index === currentStepIndex
                  ? "bg-[#373737] w-6"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Next Arrow */}
        <button
          onClick={handleNext}
          disabled={!canGoForward}
          className={`p-2 rounded-lg transition-all ${
            canGoForward
              ? "hover:bg-gray-100 cursor-pointer"
              : "opacity-30 cursor-not-allowed"
          }`}
          aria-label="下一步"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: canGoForward ? "#373737" : "#737373" }}
          >
            <path
              d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7997 7.3502 10.7997 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64038 5.95694 3.32396 6.1584 3.13508Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
        {step === "welcome" ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center max-w-md mx-auto px-6"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="mb-12 flex justify-center"
            >
              <Image
                src="/pinpinlogo-fortutor.png"
                alt="PinPin"
                width={200}
                height={67}
                priority
                className="w-auto h-25"
              />
            </motion.div>

            {/* Welcome Text */}
            

            {/* Continue Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            > 
              <Button
                onClick={handleNext}
                size="lg"
                className="bg-[#373737] hover:bg-[#2a2a2a] text-white px-4 py-2
                 text-base rounded-xl transition-colors"
              >
                開始建立教師檔案
              </Button>
            </motion.div>
          </motion.div>
        ) : step === "method" ? (
          <motion.div
            key="method"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-4xl mx-auto px-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="bg-white rounded-lg border border-gray-200 p-8"
            >
              {/* Progress Indicator */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium" style={{ color: "#373737" }}>
                    步驟 2 / 3
                  </span>
                  <span className="text-sm" style={{ color: "#737373" }}>
                    選擇方式
                  </span>
                </div>
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "33.33%" }}
                    animate={{ width: "66.66%" }}
                    transition={{ duration: 0.4 }}
                    className="h-full bg-[#373737]"
                  />
                </div>
              </div>

              {/* Title */}
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-semibold mb-2" style={{ color: "#373737" }}>
                  選擇建立檔案的方式
                </h2>
                <p className="text-sm" style={{ color: "#737373" }}>
                  您可以選擇自動整合或手動輸入
                </p>
              </div>

              {/* Method Selection */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Auto Integration Option */}
                <button
                  onClick={() => handleMethodSelect("auto")}
                  className={`group relative p-8 rounded-xl border-2 transition-all text-left ${
                    selectedMethod === "auto"
                      ? "border-[#373737] bg-gray-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 flex items-center justify-center">
                      <Image
                        src="/integration.svg"
                        alt="自動整合"
                        width={64}
                        height={64}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2" style={{ color: "#373737" }}>
                        自動整合
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: "#737373" }}>
                        上傳履歷、複製貼上文字或整合 LinkedIn，系統將自動提取您的資訊
                      </p>
                    </div>
                  </div>
                  {selectedMethod === "auto" && (
                    <div className="absolute top-4 right-4">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: "#373737" }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </button>

                {/* Manual Option */}
                <button
                  onClick={() => handleMethodSelect("manual")}
                  className={`group relative p-8 rounded-xl border-2 transition-all text-left ${
                    selectedMethod === "manual"
                      ? "border-[#373737] bg-gray-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 flex items-center justify-center">
                      <Image
                        src="/manual.svg"
                        alt="手動輸入"
                        width={64}
                        height={64}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2" style={{ color: "#373737" }}>
                        手動輸入
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: "#737373" }}>
                        逐步填寫您的個人資料和教學經驗 
                      </p>
                    </div>
                  </div>
                  {selectedMethod === "manual" && (
                    <div className="absolute top-4 right-4">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: "#373737" }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-xl mx-auto px-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="bg-white rounded-lg border border-gray-200 p-8"
            >
              {/* Progress Indicator */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium" style={{ color: "#373737" }}>
                    步驟 3 / 3
                  </span>
                  <span className="text-sm" style={{ color: "#737373" }}>
                    基本資料
                  </span>
                </div>
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "66.66%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.4 }}
                    className="h-full bg-[#373737]"
                  />
                </div>
              </div>

              {/* Title */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-2" style={{ color: "#373737" }}>
                  認識您
                </h2>
                <p className="text-sm" style={{ color: "#737373" }}>
                  讓我們從基本資料開始
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium" style={{ color: "#373737" }}>
                    您的全名 *
                  </Label>
                  <Input
                    id="fullName"
                    {...register("fullName")}
                    placeholder="例：王小明"
                    className="text-base py-3 border border-gray-300 focus:border-[#373737] focus:ring-1 focus:ring-[#373737] transition-colors rounded-lg"
                    style={{ color: "#373737" }}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-500">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* University */}
                <div className="space-y-2">
                  <Label htmlFor="university" className="text-sm font-medium" style={{ color: "#373737" }}>
                    畢業學校 *
                  </Label>
                  <div className="border border-gray-300 focus-within:border-[#373737] focus-within:ring-1 focus-within:ring-[#373737] transition-colors rounded-lg p-1">
                    <UniversityAutocompleteGlobal
                      value={selectedUniversity?.name || ""}
                      onSelect={handleUniversitySelect}
                    />
                  </div>
                  {errors.university && (
                    <p className="text-sm text-red-500">
                      {errors.university.message}
                    </p>
                  )}
                  {selectedUniversity && (
                    <p className="text-sm flex items-center gap-2" style={{ color: "#737373" }}>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      已選擇：{selectedUniversity.name}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={!isValid}
                    size="lg"
                    className="w-full bg-[#373737] hover:bg-[#2a2a2a] text-white py-3 text-base rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    繼續
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}

