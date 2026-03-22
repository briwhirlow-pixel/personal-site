"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, CalendarDays } from "lucide-react";
import { budgetOptions, siteConfig } from "@/lib/data";
import Reveal from "./Reveal";

type FormData = {
  name: string;
  email: string;
  budget: string;
  message: string;
};

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="bg-[#FAFAF7] py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Section header with coral bg strip */}
        <Reveal>
          <div className="bg-[#FF5733] rounded-2xl px-8 md:px-12 py-10 mb-16 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-white/60 text-[12px] font-semibold tracking-widest uppercase mb-2">Get in touch</p>
              <h2 className="text-[clamp(28px,4vw,48px)] font-black text-white leading-tight tracking-tight">
                Let&apos;s build something great.
              </h2>
            </div>
            <p className="text-white/70 text-[15px] leading-relaxed max-w-xs">
              Fill out the form below and I&apos;ll get back to you within 1–2 business days.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <Reveal delay={100}>
            <p className="text-[#737373] text-[15px] leading-relaxed mb-10">
              Have a project in mind? Tell me about it. Whether you need a full custom build or just want to refresh an existing site, I&apos;m here to help.
            </p>

            <div className="space-y-4">
              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-4 group p-4 rounded-xl hover:bg-[#F2F1EC] transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#FF5733]/10 flex items-center justify-center group-hover:bg-[#FF5733] transition-colors flex-shrink-0">
                  <Mail size={16} className="text-[#FF5733] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-[11px] text-[#AEACA6] uppercase tracking-wide font-medium">Email</p>
                  <p className="text-[#1A1A1A] text-[14px] font-medium">{siteConfig.email}</p>
                </div>
              </a>

              <a href={siteConfig.calendlyUrl} className="flex items-center gap-4 group p-4 rounded-xl hover:bg-[#F2F1EC] transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#FF5733]/10 flex items-center justify-center group-hover:bg-[#FF5733] transition-colors flex-shrink-0">
                  <CalendarDays size={16} className="text-[#FF5733] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-[11px] text-[#AEACA6] uppercase tracking-wide font-medium">Discovery Call</p>
                  <p className="text-[#1A1A1A] text-[14px] font-medium">Book a free 30-min call</p>
                </div>
              </a>
            </div>
          </Reveal>

          {/* Right — form */}
          <Reveal delay={200}>
            {status === "success" ? (
              <div className="bg-[#F2F1EC] rounded-2xl p-10 text-center">
                <div className="w-14 h-14 bg-[#FF5733] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="22" height="22" fill="none" stroke="white" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <h3 className="text-xl font-black text-[#1A1A1A] mb-2">Message received!</h3>
                <p className="text-[#737373] text-[14px]">I&apos;ll get back to you within 1–2 business days.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {[
                  { id: "name", label: "Your Name", type: "text", placeholder: "Jane Smith", reg: register("name", { required: "Name is required" }), error: errors.name },
                  { id: "email", label: "Email Address", type: "email", placeholder: "jane@example.com", reg: register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } }), error: errors.email },
                ].map((field) => (
                  <div key={field.id}>
                    <label className="block text-[12px] font-semibold text-[#1A1A1A] tracking-wide uppercase mb-2">{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      className={`w-full bg-white border rounded-xl px-4 py-3.5 text-[14px] text-[#1A1A1A] placeholder-[#CECCC6] focus:outline-none focus:ring-2 focus:ring-[#FF5733] focus:border-transparent transition ${field.error ? "border-red-400" : "border-[#E5E4DF]"}`}
                      {...field.reg}
                    />
                    {field.error && <p className="text-red-500 text-[12px] mt-1">{field.error.message}</p>}
                  </div>
                ))}

                <div>
                  <label className="block text-[12px] font-semibold text-[#1A1A1A] tracking-wide uppercase mb-2">Budget Range</label>
                  <select
                    className={`w-full bg-white border rounded-xl px-4 py-3.5 text-[14px] text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#FF5733] focus:border-transparent transition ${errors.budget ? "border-red-400" : "border-[#E5E4DF]"}`}
                    {...register("budget", { required: "Please select a budget" })}
                  >
                    <option value="">Select a range…</option>
                    {budgetOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  {errors.budget && <p className="text-red-500 text-[12px] mt-1">{errors.budget.message}</p>}
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-[#1A1A1A] tracking-wide uppercase mb-2">Tell Me About Your Project</label>
                  <textarea
                    rows={4}
                    placeholder="What do you need built? What's the goal?"
                    className={`w-full bg-white border rounded-xl px-4 py-3.5 text-[14px] text-[#1A1A1A] placeholder-[#CECCC6] focus:outline-none focus:ring-2 focus:ring-[#FF5733] focus:border-transparent transition resize-none ${errors.message ? "border-red-400" : "border-[#E5E4DF]"}`}
                    {...register("message", { required: "Please describe your project" })}
                  />
                  {errors.message && <p className="text-red-500 text-[12px] mt-1">{errors.message.message}</p>}
                </div>

                {status === "error" && (
                  <p className="text-red-500 text-[13px]">
                    Something went wrong. Email me at <a href={`mailto:${siteConfig.email}`} className="underline">{siteConfig.email}</a>.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-[#FF5733] text-white font-bold py-4 px-6 rounded-xl hover:bg-[#E64A2A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[14px] tracking-wide"
                >
                  {status === "loading" ? "Sending…" : "Send Message →"}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
