"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Mail,
  Phone,
  Palette,
  MapPin,
  Ruler,
  FileText,
  Check,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CalendarDays,
  Clock,
  CheckCircle2,
  CircleX,
} from "lucide-react";
import { tattooStyles } from "@/lib/validations/appointment.schema";
import { requestAppointmentAction } from "@/server/actions/appointments.actions";
import { format, parseISO } from "date-fns";
import { enUS, pt } from "date-fns/locale";
import { useLanguage } from "./LanguageProvider";

type PublicSlot = {
  id: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  status: string;
};

type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  slot: PublicSlot | null;
  onSuccess: () => void;
};

export default function BookingModal({
  isOpen,
  onClose,
  slot,
  onSuccess,
}: BookingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientWhatsapp: "",
    tattooStyle: "",
    bodyLocation: "",
    approxSizeCm: "",
    description: "",
    referenceImageUrl: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { language, t } = useLanguage();
  const calendarLocale = language === "en" ? enUS : pt;
  const steps = [
    { title: t("booking.personal"), icon: User },
    { title: t("booking.details"), icon: Palette },
    { title: t("booking.confirmation"), icon: Check },
  ];

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.clientName.trim() || formData.clientName.length < 2)
        newErrors.clientName = t("booking.nameError");
      if (
        !formData.clientEmail.trim() ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)
      )
        newErrors.clientEmail = t("booking.emailError");
      if (
        !formData.clientWhatsapp.trim() ||
        !/^(\+?[1-9]\d{1,14}|\d{9,15})$/.test(formData.clientWhatsapp.replace(/\s/g, ""))
      )
        newErrors.clientWhatsapp = t("booking.whatsappError");
    }

    if (step === 1) {
      if (!formData.tattooStyle)
        newErrors.tattooStyle = t("booking.styleError");
      if (!formData.bodyLocation.trim() || formData.bodyLocation.length < 2)
        newErrors.bodyLocation = t("booking.locationError");
      if (!formData.approxSizeCm.trim())
        newErrors.approxSizeCm = t("booking.sizeError");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!slot) return;
    setIsSubmitting(true);
    setResult(null);

    try {
      const actionResult = await requestAppointmentAction({
        slotId: slot.id,
        clientName: formData.clientName.trim(),
        clientEmail: formData.clientEmail.trim().toLowerCase(),
        clientWhatsapp: formData.clientWhatsapp.replace(/\s/g, ""),
        tattooStyle: formData.tattooStyle,
        bodyLocation: formData.bodyLocation.trim(),
        approxSizeCm: formData.approxSizeCm.trim(),
        description: formData.description.trim() || "",
        referenceImageUrl: formData.referenceImageUrl.trim() || "",
      });

      setResult(actionResult);

      if (actionResult.success) {
        setTimeout(() => {
          onSuccess();
          resetForm();
        }, 2500);
      }
    } catch {
      setResult({
        success: false,
        message: t("booking.unexpectedError"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      clientName: "",
      clientEmail: "",
      clientWhatsapp: "",
      tattooStyle: "",
      bodyLocation: "",
      approxSizeCm: "",
      description: "",
      referenceImageUrl: "",
    });
    setErrors({});
    setCurrentStep(0);
    setResult(null);
  };

  const handleOpenChange = (open: boolean) => {
    if (open) return;

    const hasEnteredData = Object.values(formData).some((value) => value.trim().length > 0);
    if (hasEnteredData && !result && !window.confirm(t("booking.closeWarning"))) {
      return;
    }

    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="rounded-sm border-white/10 bg-[#0c0c0c] max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-edo text-center text-2xl sm:text-3xl tracking-[0.06em] text-white">
            {t("booking.title")}
          </DialogTitle>
        </DialogHeader>

        {/* Slot Info */}
        {slot && (
          <div className="flex flex-wrap items-center justify-center gap-4 border border-white/10 bg-[#141414] px-4 py-3 text-sm">
            <div className="flex items-center gap-2 font-edo tracking-[0.03em] text-white">
              <CalendarDays className="w-4 h-4 text-white" />
              {format(parseISO(slot.date), "d 'de' MMMM, yyyy", { locale: calendarLocale })}
            </div>
            <div className="flex items-center gap-2 font-edo tracking-[0.03em] text-white">
              <Clock className="w-4 h-4 text-white" />
              {slot.timeStart} — {slot.timeEnd}
            </div>
          </div>
        )}

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-2 my-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`flex items-center gap-1.5 rounded-sm border border-white/10 px-3 py-1.5 text-xs font-medium transition-all ${
                index === currentStep
                  ? "bg-white/20 text-white"
                  : index < currentStep
                  ? "bg-status-available/10 text-zinc-300"
                  : "bg-white/5 text-foreground/30"
              }`}
            >
              <step.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{step.title}</span>
              <span className="sm:hidden">{index + 1}</span>
            </div>
          ))}
        </div>

        {/* Form Steps */}
        <AnimatePresence mode="wait">
          {/* Step 1: Personal Data */}
          {currentStep === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="clientName" className="flex items-center gap-1.5 text-foreground/70">
                  <User className="w-3.5 h-3.5" /> {t("booking.fullName")}
                </Label>
                <Input
                  id="clientName"
                  name="name"
                  placeholder={t("booking.namePlaceholder")}
                  value={formData.clientName}
                  onChange={(e) => updateField("clientName", e.target.value)}
                  className="rounded-sm border-white/10 bg-[#141414] focus:border-white/40 focus-visible:border-white/40 focus-visible:ring-0"
                />
                {errors.clientName && (
                  <p className="text-xs text-destructive">{errors.clientName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientEmail" className="flex items-center gap-1.5 text-foreground/70">
                  <Mail className="w-3.5 h-3.5" /> {t("booking.email")}
                </Label>
                <Input
                  id="clientEmail"
                  name="email"
                  type="email"
                  placeholder={t("booking.emailPlaceholder")}
                  value={formData.clientEmail}
                  onChange={(e) => updateField("clientEmail", e.target.value)}
                  className="rounded-sm border-white/10 bg-[#141414] focus:border-white/40 focus-visible:border-white/40 focus-visible:ring-0"
                />
                {errors.clientEmail && (
                  <p className="text-xs text-destructive">{errors.clientEmail}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientWhatsapp" className="flex items-center gap-1.5 text-foreground/70">
                  <Phone className="w-3.5 h-3.5" /> {t("booking.whatsapp")}
                </Label>
                <Input
                  id="clientWhatsapp"
                  name="whatsapp"
                  placeholder={t("booking.whatsappPlaceholder")}
                  value={formData.clientWhatsapp}
                  onChange={(e) => updateField("clientWhatsapp", e.target.value)}
                  className="rounded-sm border-white/10 bg-[#141414] focus:border-white/40 focus-visible:border-white/40 focus-visible:ring-0"
                />
                {errors.clientWhatsapp && (
                  <p className="text-xs text-destructive">{errors.clientWhatsapp}</p>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 2: Tattoo Details */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5 text-foreground/70">
                  <Palette className="w-3.5 h-3.5" /> {t("booking.style")}
                </Label>
                <Select
                  value={formData.tattooStyle}
                  onValueChange={(value) => updateField("tattooStyle", value ?? "")}
                >
                  <SelectTrigger className="rounded-sm border-white/10 bg-[#141414] focus-visible:border-white/40 focus-visible:ring-0">
                    <SelectValue placeholder={t("booking.stylePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10">
                    {tattooStyles.map((style) => (
                      <SelectItem key={style} value={style}>
                        {style}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.tattooStyle && (
                  <p className="text-xs text-destructive">{errors.tattooStyle}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bodyLocation" className="flex items-center gap-1.5 text-foreground/70">
                  <MapPin className="w-3.5 h-3.5" /> {t("booking.bodyLocation")}
                </Label>
                <Input
                  id="bodyLocation"
                  name="location"
                  placeholder={t("booking.bodyPlaceholder")}
                  value={formData.bodyLocation}
                  onChange={(e) => updateField("bodyLocation", e.target.value)}
                  className="rounded-sm border-white/10 bg-[#141414] focus:border-white/40 focus-visible:border-white/40 focus-visible:ring-0"
                />
                {errors.bodyLocation && (
                  <p className="text-xs text-destructive">{errors.bodyLocation}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="approxSizeCm" className="flex items-center gap-1.5 text-foreground/70">
                  <Ruler className="w-3.5 h-3.5" /> {t("booking.size")}
                </Label>
                <Input
                  id="approxSizeCm"
                  name="size"
                  placeholder={t("booking.sizePlaceholder")}
                  value={formData.approxSizeCm}
                  onChange={(e) => updateField("approxSizeCm", e.target.value)}
                  className="rounded-sm border-white/10 bg-[#141414] focus:border-white/40 focus-visible:border-white/40 focus-visible:ring-0"
                />
                {errors.approxSizeCm && (
                  <p className="text-xs text-destructive">{errors.approxSizeCm}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-1.5 text-foreground/70">
                  <FileText className="w-3.5 h-3.5" /> {t("booking.description")} {" "}
                  <span className="text-foreground/30">{t("booking.optional")}</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder={t("booking.descriptionPlaceholder")}
                  value={formData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className="min-h-[100px] rounded-sm border-white/10 bg-[#141414] focus:border-white/40 focus-visible:border-white/40 focus-visible:ring-0"
                  maxLength={500}
                />
                <p className="text-xs text-foreground/30 text-right">
                  {formData.description.length}/500
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {result ? (
                <div
                  className={`border p-6 text-center ${
                    result.success
                      ? "bg-white/5 border border-white/15"
                      : "bg-destructive/10 border border-destructive/30"
                  }`}
                >
                  <p className="mb-2 flex justify-center text-lg font-semibold">
                    {result.success ? <CheckCircle2 className="h-6 w-6 text-white" aria-label="Sucesso" /> : <CircleX className="h-6 w-6 text-zinc-400" aria-label="Erro" />}
                  </p>
                  <p
                    className={
                      result.success ? "text-zinc-300" : "text-destructive"
                    }
                  >
                    {result.message}
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="font-heading text-lg text-center uppercase tracking-[0.12em] text-foreground/80 mb-4">
                    {t("booking.confirmData")}
                  </h3>
                  <div className="space-y-2 border border-white/10 bg-[#141414] p-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground/50">{t("booking.name")}</span>
                      <span className="font-medium">{formData.clientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/50">{t("booking.email")}:</span>
                      <span className="font-medium">{formData.clientEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/50">{t("booking.whatsapp")}:</span>
                      <span className="font-medium">
                        {formData.clientWhatsapp}
                      </span>
                    </div>
                    <div className="border-t border-white/5 my-2" />
                    <div className="flex justify-between">
                      <span className="text-foreground/50">{t("booking.styleSummary")}</span>
                      <span className="font-medium">{formData.tattooStyle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/50">{t("booking.location")}</span>
                      <span className="font-medium">{formData.bodyLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/50">{t("booking.sizeSummary")}</span>
                      <span className="font-medium">{formData.approxSizeCm}</span>
                    </div>
                    {formData.description && (
                      <div className="pt-2">
                        <span className="text-foreground/50 block mb-1">
                          {t("booking.descriptionSummary")}
                        </span>
                        <span className="text-foreground/70">
                          {formData.description}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-foreground/30 text-center">
                    {t("booking.consent")}
                  </p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        {!result && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
            {currentStep > 0 ? (
              <Button
                variant="ghost"
                onClick={handleBack}
                className="text-foreground/60 hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                {t("booking.back")}
              </Button>
            ) : (
              <div />
            )}

            {currentStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                className="border border-white bg-transparent text-white font-semibold hover:bg-white hover:text-black"
              >
                {t("booking.next")}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="border border-white bg-transparent text-white font-semibold hover:bg-white hover:text-black min-w-[140px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    {t("booking.sending")}
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    {t("booking.submit")}
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
