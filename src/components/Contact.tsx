"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, CalendarDays } from "lucide-react";
import { budgetOptions, siteConfig } from "@/lib/data";

type FormData = {
  name: string;
  email: string;
  budget: string;
  message: string;
};

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

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

  const inputClass = (hasError?: boolean) =>
    `w-full bg-transparent border-b ${hasError ? "border-red-500" : "border-zinc-300"} px-0 py-3 text-[15px] text-black placeholder-zinc-400 focus:outline-none focus:border-black transition-colors`;

  return (
    <section id="contact" className="bg-white py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-20 pb-8 border-b border-zinc-200">
          <p className="text-[11px] tracking-[0.3em] uppercase text-zinc-400 font-medium mb-4">
            Get in touch
          </p>
          <h2 className="text-[clamp(36px,5vw,60px)] font-black text-black leading-tight tracking-tight">
            Let&apos;s build
            <br />
            something great.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-20 items-start">
          {/* Left */}
          <div>
            <p className="text-zinc-500 text-[15px] leading-relaxed mb-12">
              Have a project in mind? Fill out the form and I&apos;ll get back to you within 1–2 business days. Or reach out directly below.
            </p>

            <div className="space-y-6">
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-4 group"
              >
                <div className="w-10 h-10 border border-zinc-200 flex items-center justify-center group-hover:border-black transition-colors">
                  <Mail size={15} className="text-zinc-400 group-hover:text-black transition-colors" />
                </div>
                <span className="text-[14px] text-zinc-500 group-hover:text-black transition-colors">{siteConfig.email}</span>
              </a>
              <a
                href={siteConfig.calendlyUrl}
                className="flex items-center gap-4 group"
              >
                <div className="w-10 h-10 border border-zinc-200 flex items-center justify-center group-hover:border-black transition-colors">
                  <CalendarDays size={15} className="text-zinc-400 group-hover:text-black transition-colors" />
                </div>
                <span className="text-[14px] text-zinc-500 group-hover:text-black transition-colors">Book a free 30-min discovery call</span>
              </a>
            </div>
          </div>

          {/* Right — form */}
          <div>
            {status === "success" ? (
              <div className="border border-zinc-200 p-12 text-center">
                <p className="text-4xl mb-4 font-black">✓</p>
                <h3 className="text-lg font-black text-black tracking-tight mb-2">Message received!</h3>
                <p className="text-zinc-500 text-[14px]">
                  Thanks for reaching out. I&apos;ll be in touch within 1–2 business days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div>
                  <label className="block text-[11px] tracking-widest uppercase text-zinc-400 font-medium mb-3">Name</label>
                  <input
                    type="text"
                    placeholder="Jane Smith"
                    className={inputClass(!!errors.name)}
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && <p className="text-red-500 text-[12px] mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-[11px] tracking-widest uppercase text-zinc-400 font-medium mb-3">Email</label>
                  <input
                    type="email"
                    placeholder="jane@example.com"
                    className={inputClass(!!errors.email)}
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                    })}
                  />
                  {errors.email && <p className="text-red-500 text-[12px] mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-[11px] tracking-widest uppercase text-zinc-400 font-medium mb-3">Budget range</label>
                  <select
                    className={`w-full bg-transparent border-b ${errors.budget ? "border-red-500" : "border-zinc-300"} px-0 py-3 text-[15px] text-black focus:outline-none focus:border-black transition-colors`}
                    {...register("budget", { required: "Please select a budget range" })}
                  >
                    <option value="">Select a range…</option>
                    {budgetOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  {errors.budget && <p className="text-red-500 text-[12px] mt-1">{errors.budget.message}</p>}
                </div>

                <div>
                  <label className="block text-[11px] tracking-widest uppercase text-zinc-400 font-medium mb-3">Project details</label>
                  <textarea
                    rows={4}
                    placeholder="What do you need built? What's the goal?"
                    className={`w-full bg-transparent border-b ${errors.message ? "border-red-500" : "border-zinc-300"} px-0 py-3 text-[15px] text-black placeholder-zinc-400 focus:outline-none focus:border-black transition-colors resize-none`}
                    {...register("message", { required: "Please describe your project" })}
                  />
                  {errors.message && <p className="text-red-500 text-[12px] mt-1">{errors.message.message}</p>}
                </div>

                {status === "error" && (
                  <p className="text-red-500 text-[13px]">
                    Something went wrong. Email me at{" "}
                    <a href={`mailto:${siteConfig.email}`} className="underline">{siteConfig.email}</a>.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="text-[12px] tracking-widest uppercase font-semibold bg-black text-white px-8 py-4 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {status === "loading" ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
