"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, CalendarDays } from "lucide-react";
import { budgetOptions, siteConfig } from "@/lib/data";
import Reveal from "./Reveal";

type FormData = {
  name: string;
  email: string;
  websiteType: string;
  websiteTypeCustom: string;
  budget: string;
  launchDate: string;
  message: string;
};

function getDateFromOption(option: string): string {
  const d = new Date();
  if (option === '2weeks') d.setDate(d.getDate() + 14);
  else if (option === '1month') d.setMonth(d.getMonth() + 1);
  else if (option === '3months') d.setMonth(d.getMonth() + 3);
  else return '';
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [launchOption, setLaunchOption] = useState<string>('');
  const [customDate, setCustomDate] = useState('');
  const [websiteTypeValue, setWebsiteTypeValue] = useState('');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>();

  const selectLaunch = (option: string) => {
    setLaunchOption(option);
    if (option !== 'custom') {
      setValue('launchDate', `${option} — ${getDateFromOption(option)}`);
    } else {
      setValue('launchDate', '');
    }
  };

  const onSubmit = async (data: FormData) => {
    const submitData = { ...data, launchDate: launchOption === 'custom' ? customDate : data.launchDate };
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      reset();
      setLaunchOption('');
      setCustomDate('');
      setWebsiteTypeValue('');
    } catch {
      setStatus("error");
    }
  };

  const inputClass = (hasError?: boolean) =>
    `w-full bg-white border ${hasError ? 'border-red-400' : 'border-[#E5E4DF]'} rounded-xl px-4 py-3.5 text-[14px] text-[#1A1A1A] placeholder-[#CECCC6] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition`;

  return (
    <section id="contact" className="bg-[#FAFAF7] py-16 sm:py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
        {/* Header banner */}
        <Reveal>
          <div className="bg-[#2563EB] rounded-2xl px-5 sm:px-8 md:px-12 py-8 sm:py-10 mb-10 sm:mb-16 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6">
            <div>
              <p className="text-white/60 text-[12px] font-semibold tracking-widest uppercase mb-2">Get In Touch</p>
              <h2 className="text-[clamp(28px,4vw,48px)] font-black text-white leading-tight tracking-tight">
                Let&apos;s build something great.
              </h2>
            </div>
            <p className="text-white/70 text-[15px] leading-relaxed max-w-xs">
              Fill out the form and I&apos;ll get back to you within 1–2 business days.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-10 sm:gap-16 items-start">
          {/* Left */}
          <Reveal delay={100}>
            <p className="text-[#737373] text-[15px] leading-relaxed mb-10">
              Have a vision for your next website? I&apos;m more than happy to help bring your <span className="text-[#1A1A1A] font-semibold">blueprint</span> to life — whether you&apos;re starting from scratch, leveling up an existing site, or just exploring the possibilities. No pressure, no jargon.
            </p>
            <div className="space-y-3">
              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-4 group p-4 rounded-xl hover:bg-[#F2F1EC] transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center group-hover:bg-[#2563EB] transition-colors flex-shrink-0">
                  <Mail size={16} className="text-[#2563EB] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-[11px] text-[#AEACA6] uppercase tracking-wide font-medium">Email Me Directly</p>
                  <p className="text-[#1A1A1A] text-[14px] font-medium">{siteConfig.email}</p>
                </div>
              </a>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#F2F1EC]">
                <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                  <CalendarDays size={16} className="text-[#2563EB]" />
                </div>
                <div>
                  <p className="text-[11px] text-[#AEACA6] uppercase tracking-wide font-medium">Response Time</p>
                  <p className="text-[#1A1A1A] text-[14px] font-medium">Within 1–2 business days</p>
                </div>
              </div>
            </div>

            {/* Process map */}
            <div className="mt-10">
              <p className="text-[11px] text-[#AEACA6] uppercase tracking-widest font-semibold mb-6">How It Works</p>
              <div className="relative">
                {/* Vertical connector line */}
                <div className="absolute left-[19px] top-8 bottom-8 w-px bg-gradient-to-b from-[#2563EB] via-[#2563EB]/30 to-[#2563EB]/10" />

                <div className="space-y-1">
                  {[
                    {
                      step: '1',
                      icon: '✍️',
                      title: 'Fill Out the Form',
                      desc: 'Tell me about your project, timeline & budget.',
                      active: true,
                    },
                    {
                      step: '2',
                      icon: '📬',
                      title: 'I Respond in 1–2 Days',
                      desc: 'I review your request and we schedule a discovery call.',
                      active: false,
                    },
                    {
                      step: '3',
                      icon: '📞',
                      title: 'Discovery Call',
                      desc: 'We align on goals, design direction & scope.',
                      active: false,
                    },
                    {
                      step: '4',
                      icon: '⚡',
                      title: 'Your Website Gets Built',
                      desc: 'I design & develop your site with regular check-ins.',
                      active: false,
                    },
                    {
                      step: '5',
                      icon: '🚀',
                      title: 'Launch Day',
                      desc: 'Your site goes live. We celebrate. You grow.',
                      active: false,
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 group relative">
                      {/* Step node */}
                      <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-[15px] transition-all duration-300 border-2 ${
                        item.active
                          ? 'bg-[#2563EB] border-[#2563EB] shadow-[0_0_16px_rgba(37,99,235,0.35)]'
                          : 'bg-white border-[#E5E4DF] group-hover:border-[#2563EB]/50 group-hover:shadow-[0_0_12px_rgba(37,99,235,0.15)]'
                      }`}>
                        {item.icon}
                      </div>

                      {/* Content card */}
                      <div className={`flex-1 mb-1 px-4 py-3 rounded-xl transition-all duration-300 ${
                        item.active
                          ? 'bg-[#EFF6FF] border border-[#2563EB]/20'
                          : 'bg-transparent group-hover:bg-[#F2F1EC]'
                      }`}>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[10px] font-bold tracking-widest uppercase ${item.active ? 'text-[#2563EB]' : 'text-[#AEACA6]'}`}>
                            Step {item.step}
                          </span>
                        </div>
                        <p className="text-[13px] font-bold text-[#1A1A1A] leading-snug">{item.title}</p>
                        <p className="text-[12px] text-[#737373] leading-relaxed mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right — form */}
          <Reveal delay={200}>
            {status === "success" ? (
              <div className="bg-[#F2F1EC] rounded-2xl p-10 text-center">
                <div className="w-14 h-14 bg-[#2563EB] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="22" height="22" fill="none" stroke="white" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <h3 className="text-xl font-black text-[#1A1A1A] mb-2">Message received!</h3>
                <p className="text-[#737373] text-[14px]">I&apos;ll get back to you within 1–2 business days.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#1A1A1A] tracking-wide uppercase mb-2">Your Name</label>
                  <input type="text" placeholder="Jane Smith" className={inputClass(!!errors.name)}
                    {...register("name", { required: "Name is required" })} />
                  {errors.name && <p className="text-red-500 text-[12px] mt-1">{errors.name.message}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#1A1A1A] tracking-wide uppercase mb-2">Email Address</label>
                  <input type="email" placeholder="jane@example.com" className={inputClass(!!errors.email)}
                    {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })} />
                  {errors.email && <p className="text-red-500 text-[12px] mt-1">{errors.email.message}</p>}
                </div>

                {/* Type of Website */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#1A1A1A] tracking-wide uppercase mb-2">Type of Website</label>
                  <select
                    className={inputClass(!!errors.websiteType)}
                    {...register("websiteType", { required: "Please select a website type" })}
                    onChange={(e) => { setWebsiteTypeValue(e.target.value); }}
                  >
                    <option value="">Select a type…</option>
                    <option value="Business / Brochure Site">Business / Brochure Site</option>
                    <option value="E-Commerce Store">E-Commerce Store</option>
                    <option value="Portfolio / Personal Brand">Portfolio / Personal Brand</option>
                    <option value="Restaurant / Food & Beverage">Restaurant / Food & Beverage</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Health, Wellness & Fitness">Health, Wellness & Fitness</option>
                    <option value="Blog / Content Site">Blog / Content Site</option>
                    <option value="Landing Page">Landing Page</option>
                    <option value="Non-Profit / Community">Non-Profit / Community</option>
                    <option value="custom">Other — I&apos;ll describe it below</option>
                  </select>
                  {errors.websiteType && <p className="text-red-500 text-[12px] mt-1">{errors.websiteType.message}</p>}
                  {websiteTypeValue === 'custom' && (
                    <input
                      type="text"
                      placeholder="Describe your website type…"
                      className={`${inputClass(!!errors.websiteTypeCustom)} mt-2`}
                      {...register("websiteTypeCustom", {
                        validate: (val) => websiteTypeValue !== 'custom' || !!val || 'Please describe your website type',
                      })}
                    />
                  )}
                  {errors.websiteTypeCustom && <p className="text-red-500 text-[12px] mt-1">{errors.websiteTypeCustom.message}</p>}
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#1A1A1A] tracking-wide uppercase mb-2">Budget Range</label>
                  <select className={inputClass(!!errors.budget)} {...register("budget", { required: "Please select a budget" })}>
                    <option value="">Select a range…</option>
                    {budgetOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  {errors.budget && <p className="text-red-500 text-[12px] mt-1">{errors.budget.message}</p>}
                </div>

                {/* Expected Launch Date */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#1A1A1A] tracking-wide uppercase mb-3">Expected Launch Date</label>
                  <input type="hidden" {...register("launchDate")} />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                    {[
                      { label: '2 Weeks', value: '2weeks' },
                      { label: '1 Month', value: '1month' },
                      { label: '3 Months', value: '3months' },
                      { label: 'Custom', value: 'custom' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => selectLaunch(opt.value)}
                        className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl border text-left transition-all ${
                          launchOption === opt.value
                            ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]'
                            : 'border-[#E5E4DF] text-[#737373] hover:border-[#2563EB]/40 bg-white'
                        }`}
                      >
                        <span className="block text-[12px] sm:text-[13px] font-semibold">{opt.label}</span>
                        {launchOption === opt.value && opt.value !== 'custom' && (
                          <span className="block text-[10px] sm:text-[11px] mt-0.5 opacity-70">{getDateFromOption(opt.value)}</span>
                        )}
                      </button>
                    ))}
                  </div>
                  {launchOption === 'custom' && (
                    <input
                      type="date"
                      value={customDate}
                      onChange={(e) => { setCustomDate(e.target.value); setValue('launchDate', e.target.value); }}
                      className={inputClass()}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#1A1A1A] tracking-wide uppercase mb-2">Tell Me About Your Project</label>
                  <textarea rows={4} placeholder="What do you need built? What's the goal?"
                    className={`w-full bg-white border ${errors.message ? 'border-red-400' : 'border-[#E5E4DF]'} rounded-xl px-4 py-3.5 text-[14px] text-[#1A1A1A] placeholder-[#CECCC6] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition resize-none`}
                    {...register("message", { required: "Please describe your project" })} />
                  {errors.message && <p className="text-red-500 text-[12px] mt-1">{errors.message.message}</p>}
                </div>

                {status === "error" && (
                  <p className="text-red-500 text-[13px]">
                    Something went wrong. Email me at <a href={`mailto:${siteConfig.email}`} className="underline">{siteConfig.email}</a>.
                  </p>
                )}

                <button type="submit" disabled={status === "loading"}
                  className="w-full bg-[#2563EB] text-white font-bold py-4 px-6 rounded-xl hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-[14px] tracking-wide hover:scale-[1.01] active:scale-[0.99]">
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
