"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, CalendarDays } from "lucide-react";
import { budgetOptions, siteConfig } from "@/lib/data";
import { clsx } from "clsx";

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

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left column */}
          <div>
            <p className="text-indigo-600 font-medium text-sm uppercase tracking-widest mb-3">
              Get in touch
            </p>
            <h2 className="text-4xl font-bold text-zinc-900 tracking-tight mb-4">
              Let&apos;s build something great.
            </h2>
            <p className="text-zinc-500 text-lg leading-relaxed mb-8">
              Have a project in mind? Fill out the form and I&apos;ll get back
              to you within 1–2 business days.
            </p>

            <div className="space-y-4">
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-3 text-zinc-600 hover:text-indigo-600 transition-colors"
              >
                <Mail size={18} className="text-zinc-400" />
                <span className="text-sm">{siteConfig.email}</span>
              </a>
              <a
                href={siteConfig.calendlyUrl}
                className="flex items-center gap-3 text-zinc-600 hover:text-indigo-600 transition-colors"
              >
                <CalendarDays size={18} className="text-zinc-400" />
                <span className="text-sm">Book a free 30-min discovery call</span>
              </a>
            </div>
          </div>

          {/* Right column — form */}
          <div>
            {status === "success" ? (
              <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-8 text-center">
                <p className="text-2xl mb-2">✓</p>
                <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                  Message received!
                </h3>
                <p className="text-zinc-500 text-sm">
                  Thanks for reaching out. I&apos;ll be in touch within 1–2 business days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Jane Smith"
                    className={clsx(
                      "w-full rounded-lg border px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition",
                      errors.name ? "border-red-400" : "border-zinc-300"
                    )}
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="jane@example.com"
                    className={clsx(
                      "w-full rounded-lg border px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition",
                      errors.email ? "border-red-400" : "border-zinc-300"
                    )}
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                    })}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                    Budget range
                  </label>
                  <select
                    className={clsx(
                      "w-full rounded-lg border px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white",
                      errors.budget ? "border-red-400" : "border-zinc-300"
                    )}
                    {...register("budget", { required: "Please select a budget range" })}
                  >
                    <option value="">Select a range…</option>
                    {budgetOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  {errors.budget && (
                    <p className="text-red-500 text-xs mt-1">{errors.budget.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                    Tell me about your project
                  </label>
                  <textarea
                    rows={4}
                    placeholder="What do you need built? What's the goal?"
                    className={clsx(
                      "w-full rounded-lg border px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none",
                      errors.message ? "border-red-400" : "border-zinc-300"
                    )}
                    {...register("message", { required: "Please describe your project" })}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
                  )}
                </div>

                {status === "error" && (
                  <p className="text-red-500 text-sm">
                    Something went wrong. Please email me directly at{" "}
                    <a href={`mailto:${siteConfig.email}`} className="underline">
                      {siteConfig.email}
                    </a>
                    .
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-indigo-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {status === "loading" ? "Sending…" : "Send message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
