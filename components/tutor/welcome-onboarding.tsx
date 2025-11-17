"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UniversityAutocompleteGlobal } from "./university-autocomplete-global";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const welcomeSchema = z.object({
  fullName: z.string().min(1, "請輸入您的全名"),
  highSchool: z.string().optional(),
  highSchoolSystem: z.enum(["IB", "AP", "學測", "高職", "A-Levels", "其他"]).optional(),
  highSchoolSystemOther: z.string().optional(),
  university: z.string().min(1, "請選擇您的畢業學校"),
  universityWebsite: z.string().optional(),
  universityCountry: z.string().optional(),
  universityVerified: z.boolean().optional(),
});

type WelcomeFormData = z.infer<typeof welcomeSchema>;

interface WelcomeOnboardingProps {
  onComplete: (data: WelcomeFormData) => void;
}

function WelcomeOnboardingContent({ onComplete }: WelcomeOnboardingProps) {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"welcome" | "method" | "form">("welcome");
  const [selectedMethod, setSelectedMethod] = useState<"auto" | "manual" | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<{
    name: string;
    universityId?: string;
    website?: string;
    country?: string;
  } | null>(null);
  const [showSSODialog, setShowSSODialog] = useState(false);
  const [isVerifyingSSO, setIsVerifyingSSO] = useState(false);
  const [universityVerified, setUniversityVerified] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [highSchoolSystem, setHighSchoolSystem] = useState<"IB" | "AP" | "學測" | "高職" | "A-Levels" | "其他" | null>(null);
  const [highSchoolSystemOther, setHighSchoolSystemOther] = useState("");

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
    onComplete({
      ...data,
      highSchoolSystem: highSchoolSystem || undefined,
      highSchoolSystemOther: highSchoolSystem === "其他" ? highSchoolSystemOther : undefined,
      universityVerified: universityVerified,
    });
  };

  // Check for verification callback from email
  useEffect(() => {
    const verification = searchParams?.get("university_verification");
    const message = searchParams?.get("verification_message");
    
    if (verification === "success" && selectedUniversity) {
      setUniversityVerified(true);
      setValue("universityVerified", true);
      setShowSSODialog(false);
      // Clear URL params
      if (typeof window !== "undefined") {
        window.history.replaceState({}, "", window.location.pathname);
      }
    } else if (verification === "error") {
      setEmailError(message ? decodeURIComponent(message) : "驗證失敗");
    }
  }, [searchParams, selectedUniversity, setValue]);

  const handleSSOVerification = async () => {
    if (!selectedUniversity || !verificationEmail) {
      setEmailError("請輸入學校 email");
      return;
    }

    setIsVerifyingSSO(true);
    setEmailError("");

    try {
      const response = await fetch("/api/university/verify/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          universityId: selectedUniversity.universityId || selectedUniversity.name.toLowerCase().replace(/\s+/g, "-"),
          universityName: selectedUniversity.name,
          universityWebsite: selectedUniversity.website,
          email: verificationEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setEmailError(data.error || "發送驗證 email 失敗");
        setIsVerifyingSSO(false);
        return;
      }

      setEmailSent(true);
      setIsVerifyingSSO(false);
    } catch (error: any) {
      setEmailError(error.message || "發生錯誤，請稍後再試");
      setIsVerifyingSSO(false);
    }
  };

  const handleUniversitySelect = (university: {
    name: string;
    universityId: string;
    website: string;
    country?: string;
  }) => {
    setSelectedUniversity({
      name: university.name,
      universityId: university.universityId,
      website: university.website,
      country: university.country,
    });
    setValue("university", university.name, { shouldValidate: true });
    setValue("universityWebsite", university.website);
    if (university.country) {
      setValue("universityCountry", university.country);
    }
    // Reset verification state when university changes
    setUniversityVerified(false);
    setEmailSent(false);
    setVerificationEmail("");
    setEmailError("");
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
    <div className="fixed inset-0 z-50 flex flex-col bg-white" style={{
      background: 'radial-gradient(ellipse at center bottom, rgba(147, 197, 253, 0.12) 0%, rgba(191, 219, 254, 0.06) 25%, rgba(219, 234, 254, 0.02) 50%, transparent 70%, white 100%)'
    }}>
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
            className="w-full max-w-3xl mx-auto px-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="bg-white/80 backdrop-blur-md rounded-xl border border-gray-200/50 p-8 shadow-lg"
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
                {/* Auto Integration Option - Coming Soon */}
                <div className="relative p-8 rounded-xl border-2 border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 flex items-center justify-center opacity-50">
                      <Image
                        src="/integration.svg"
                        alt="自動整合"
                        width={64}
                        height={64}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold" style={{ color: "#737373" }}>
                          自動整合
                        </h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-300 text-gray-600">
                          開發中
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "#737373" }}>
                        上傳履歷、複製貼上文字或整合 LinkedIn，系統將自動提取您的資訊
                      </p>
                    </div>
                  </div>
                </div>

                {/* Manual Option */}
                <button
                  onClick={() => handleMethodSelect("manual")}
                  className={`group relative p-8 rounded-xl border-2 transition-all text-left ${
                    selectedMethod === "manual"
                      ? "border-[#373737] bg-gray-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex flex-col items-center hover:cursor-pointer text-center space-y-4">
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
            className="w-full max-w-3xl mx-auto px-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="w-full max-w-xl mx-auto bg-white/80 backdrop-blur-md rounded-xl border border-gray-200/50 p-8 shadow-lg"
            >
              {/* Progress Indicator */}
              <div className="mb-10">
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
              <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-2" style={{ color: "#373737" }}>
                  認識您
                </h2>
                <p className="text-sm" style={{ color: "#737373" }}>
                  讓我們從基本資料開始
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Full Name */}
                <div className="space-y-3">
                  <Label htmlFor="fullName" className="text-sm font-medium block" style={{ color: "#373737" }}>
                    您的全名 *
                  </Label>
                  <div className="relative">
                    <Input
                      id="fullName"
                      {...register("fullName")}
                      placeholder="例：王小明"
                      className="w-full text-base py-4 px-4 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#373737]/20 transition-all placeholder:text-gray-400"
                      style={{ color: "#373737" }}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* High School */}
                <div className="space-y-3">
                  <Label htmlFor="highSchool" className="text-sm font-medium block" style={{ color: "#373737" }}>
                    高中
                  </Label>
                  <div className="relative">
                    <Input
                      id="highSchool"
                      {...register("highSchool")}
                      placeholder="例：建國中學"
                      className="w-full text-base py-4 px-4 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#373737]/20 transition-all placeholder:text-gray-400"
                      style={{ color: "#373737" }}
                    />
                  </div>
                  
                  {/* High School System Selection */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium block" style={{ color: "#737373" }}>
                      學習體制（選填）
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {(["IB", "AP", "學測", "高職", "A-Levels", "其他"] as const).map((system) => (
                        <button
                          key={system}
                          type="button"
                          onClick={() => {
                            setHighSchoolSystem(system);
                            setValue("highSchoolSystem", system);
                            if (system !== "其他") {
                              setHighSchoolSystemOther("");
                              setValue("highSchoolSystemOther", "");
                            }
                          }}
                          className={`px-3 py-2 text-xs rounded-lg transition-all ${
                            highSchoolSystem === system
                              ? "bg-[#373737] text-white shadow-sm"
                              : "bg-gray-100 hover:bg-gray-200 text-[#373737]"
                          }`}
                        >
                          {system}
                        </button>
                      ))}
                    </div>
                    
                    {/* Custom Input for "其他" */}
                    {highSchoolSystem === "其他" && (
                      <div className="mt-2">
                        <Input
                          {...register("highSchoolSystemOther")}
                          value={highSchoolSystemOther}
                          onChange={(e) => {
                            setHighSchoolSystemOther(e.target.value);
                            setValue("highSchoolSystemOther", e.target.value);
                          }}
                          placeholder="請輸入您的學習體制"
                          className="w-full text-sm py-3 px-4 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#373737]/20 transition-all placeholder:text-gray-400"
                          style={{ color: "#373737" }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* University */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="university" className="text-sm font-medium block" style={{ color: "#373737" }}>
                      大學 *
                    </Label>
                    {selectedUniversity && (
                      <div className="flex items-center gap-2">
                        {!universityVerified && (
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-50/80 border border-amber-100/50">
                            <svg
                              className="w-3 h-3 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              style={{ color: "#f59e0b" }}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            </svg>
                            <span className="text-xs font-medium" style={{ color: "#92400e" }}>
                              驗證學歷，增加檔案曝光度
                            </span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => setShowSSODialog(true)}
                          className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                          style={{ 
                            color: universityVerified ? "#10b981" : "#737373",
                            backgroundColor: universityVerified ? "#d1fae5" : "#f3f4f6"
                          }}
                        >
                          {universityVerified ? (
                            <>
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              已驗證
                            </>
                          ) : (
                            <>
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                              驗證身份
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="relative bg-gray-50 rounded-xl focus-within:bg-white focus-within:ring-2 focus-within:ring-[#373737]/20 transition-all">
                    <UniversityAutocompleteGlobal
                      value={selectedUniversity?.name || ""}
                      onSelect={handleUniversitySelect}
                    />
                  </div>
                  {errors.university && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.university.message}
                    </p>
                  )}
                  {selectedUniversity && (
                    <div className="flex items-center justify-between pt-1">
                      <p className="text-sm flex items-center gap-2" style={{ color: "#10b981" }}>
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
                      {!universityVerified && (
                        <p className="text-xs" style={{ color: "#737373" }}>
                          可稍後驗證
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={!isValid}
                    size="lg"
                    className="w-full bg-[#373737] hover:bg-[#2a2a2a] text-white py-4 text-base rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
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

      {/* SSO Verification Dialog */}
      <Dialog open={showSSODialog} onOpenChange={setShowSSODialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle style={{ color: "#373737" }}>
              驗證大學身份
            </DialogTitle>
            <DialogDescription style={{ color: "#737373" }}>
              透過學校的 SSO 系統驗證您的學生身份，以提升檔案可信度
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {selectedUniversity && (
              <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                <p className="text-sm font-medium mb-1" style={{ color: "#373737" }}>
                  選擇的大學
                </p>
                <p className="text-sm" style={{ color: "#737373" }}>
                  {selectedUniversity.name}
                </p>
              </div>
            )}

            {!emailSent && !universityVerified && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="verificationEmail" className="text-sm font-medium" style={{ color: "#373737" }}>
                    學校 Email *
                  </Label>
                  <Input
                    id="verificationEmail"
                    type="email"
                    value={verificationEmail}
                    onChange={(e) => {
                      setVerificationEmail(e.target.value);
                      setEmailError("");
                    }}
                    placeholder="例：student@ntu.edu.tw"
                    className="text-base py-3 border border-gray-300 focus:border-[#373737] focus:ring-1 focus:ring-[#373737] transition-colors rounded-lg"
                    style={{ color: "#373737" }}
                    disabled={isVerifyingSSO}
                  />
                  {emailError && (
                    <p className="text-sm text-red-500">{emailError}</p>
                  )}
                  <p className="text-xs" style={{ color: "#737373" }}>
                    我們將發送驗證連結到此 email 地址
                  </p>
                </div>
              </div>
            )}

            {emailSent && !universityVerified && (
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1" style={{ color: "#373737" }}>
                      驗證 email 已發送
                    </p>
                    <p className="text-sm" style={{ color: "#737373" }}>
                      我們已發送驗證連結到 <strong>{verificationEmail}</strong>
                    </p>
                    <p className="text-xs mt-2" style={{ color: "#737373" }}>
                      請檢查您的信箱並點擊驗證連結。連結將在 24 小時後過期。
                    </p>
                  </div>
                </div>
              </div>
            )}

            {universityVerified && (
              <div className="p-3 rounded-lg bg-green-50 border border-green-200 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-green-700">
                  身份驗證成功！
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowSSODialog(false);
                setEmailSent(false);
                setVerificationEmail("");
                setEmailError("");
              }}
              className="w-full sm:w-auto"
            >
              {universityVerified ? "關閉" : "稍後驗證"}
            </Button>
            {!universityVerified && !emailSent && (
              <Button
                type="button"
                onClick={handleSSOVerification}
                disabled={isVerifyingSSO || !verificationEmail}
                className="w-full sm:w-auto bg-[#373737] hover:bg-[#2a2a2a] text-white"
              >
                {isVerifyingSSO ? "發送中..." : "發送驗證 Email"}
              </Button>
            )}
            {emailSent && !universityVerified && (
              <Button
                type="button"
                onClick={() => {
                  setEmailSent(false);
                  setVerificationEmail("");
                  setEmailError("");
                }}
                variant="outline"
                className="w-full sm:w-auto"
              >
                重新發送
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function WelcomeOnboarding({ onComplete }: WelcomeOnboardingProps) {
  return (
    <Suspense fallback={<div>載入中...</div>}>
      <WelcomeOnboardingContent onComplete={onComplete} />
    </Suspense>
  );
}

