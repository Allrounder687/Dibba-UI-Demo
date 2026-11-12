"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { enquirySchema, type EnquiryInput } from "@/lib/validations";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

interface EnquiryFormProps {
  dict: Dictionary;
  type: EnquiryInput["type"];
  programOptions?: string[];
  defaultSubject?: string;
  showAgeField?: boolean;
  prefilledProgram?: string;
  prefilledSubject?: string;
  prefilledMessage?: string;
}

export function EnquiryForm({
  dict,
  type,
  programOptions,
  defaultSubject = "",
  showAgeField = false,
  prefilledProgram,
  prefilledSubject,
  prefilledMessage,
}: EnquiryFormProps) {
  const [serverSuccess, setServerSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      type,
      fullName: "",
      email: "",
      phone: "",
      subject: defaultSubject,
      program: programOptions?.[0] ?? "",
      playerAge: "",
      message: "",
      consent: false,
    },
  });

  useEffect(() => {
    if (prefilledProgram) setValue("program", prefilledProgram);
    if (prefilledSubject) setValue("subject", prefilledSubject);
    if (prefilledMessage) setValue("message", prefilledMessage);
  }, [prefilledProgram, prefilledSubject, prefilledMessage, setValue]);

  async function onSubmit(data: EnquiryInput) {
    setServerError(null);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error || dict.forms.errorGeneric);
        return;
      }
      setServerSuccess(true);
      reset();
    } catch {
      setServerError(dict.forms.errorGeneric);
    }
  }

  if (serverSuccess) {
    return (
      <div
        role="status"
        className="rounded-xl border border-emerald-500/35 bg-emerald-50 p-6 text-start text-[#071426]"
      >
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-600" />
          <div>
            <h3 className="text-base font-bold text-emerald-950">{dict.forms.successTitle}</h3>
            <p className="mt-1 text-sm text-emerald-800">{dict.forms.successBody}</p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="mt-4"
              onClick={() => setServerSuccess(false)}
            >
              {dict.forms.submit}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 text-start">
      <input type="hidden" {...register("type")} />

      {serverError && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
            {dict.forms.fullName} *
          </label>
          <Input type="text" {...register("fullName")} />
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
            {dict.forms.email} *
          </label>
          <Input type="email" dir="ltr" {...register("email")} />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
            {dict.forms.phone} *
          </label>
          <Input type="tel" dir="ltr" placeholder="+971 50 000 0000" {...register("phone")} />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
            {dict.forms.subject} *
          </label>
          <Input type="text" {...register("subject")} />
          {errors.subject && (
            <p className="mt-1 text-xs text-red-600">{errors.subject.message}</p>
          )}
        </div>
      </div>

      {(programOptions || showAgeField) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {programOptions && (
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                {dict.forms.program}
              </label>
              <select
                {...register("program")}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {programOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          )}

          {showAgeField && (
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                {dict.forms.playerAge}
              </label>
              <Input type="text" {...register("playerAge")} />
            </div>
          )}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
          {dict.forms.message} *
        </label>
        <Textarea rows={4} {...register("message")} />
        {errors.message && (
          <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>
        )}
      </div>

      <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
        <input
          type="checkbox"
          {...register("consent")}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#2678FF]"
        />
        <span>{dict.forms.consent}</span>
      </label>
      {errors.consent && (
        <p className="text-xs text-red-600">{errors.consent.message}</p>
      )}

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        <span>{isSubmitting ? dict.forms.submitting : dict.forms.submit}</span>
      </Button>
    </form>
  );
}
