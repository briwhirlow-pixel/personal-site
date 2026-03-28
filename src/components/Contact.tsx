"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, CalendarDays, Phone } from "lucide-react";
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
  if (option === "2weeks") d.setDate(d.getDate() + 14);
  else if (option === "1month") d.setMonth(d.getMonth() + 1);
  else if (option === "3months") d.setMonth(d.getMonth() + 3);
  else return "";
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function getTomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

const faqs = [
  {
    q: "How long does a typical project take?",
    a: "Most sites are done in 2–4 weeks. You get a first draft within 72 hours of project kickoff so you're never left waiting.",
  },
  {
    q: "Do you offer payment plans?",
    a: "Yes — 50% upfront to start, 50% on delivery. Larger projects can split into thirds at agreed milestones.",
  },
  {
    q: "What if I need changes after launch?",
    a: "Every package includes revision rounds. After launch, my $49/mo managed plan includes 1 hr of edits every month.",
  },
  {
    q: "Do I own the website?",
    a: "Always. You get the full source code delivered to you. Host it anywhere — no lock-in, ever.",
  },
];

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formStep, setFormStep] = useState<1 | 2>(1);
  const [launchOption, setLaunchOption] = useState<string>("");
  const [customDate, setCustomDate] = useState("");
  const [websiteTypeValue, setWebsiteTypeValue] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { register, handleSubmit, reset, setValue, trigger, formState: { errors } } = useForm<FormData>();

  const goToStep2 = async () => {
    const valid = await trigger(["name", "email", "message"]);
    if (valid) setFormStep(2);
  };

  const selectLaunch = (option: string) => {
    setLaunchOption(option);
    if (option !== "custom") {
      setValue("launchDate", `${option} — ${getDateFromOption(option)}`);
    } else {
      setValue("launchDate", "");
    }
  };

  const onSubmit = async (data: FormData) => {
    const submitData = { ...data, launchDate: launchOption === "custom" ? customDate : data.launchDate };
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
      setLaunchOption("");
      setCustomDate("");
      setWebsiteTypeValue("");
      setFormStep(1);
    } catch {
      setStatus("error");
    }
  };

  const inputClass = (hasError?: boolean) =>
    `w-full bg-white border ${hasError ? "border-red-400" : "border-[#E5E4DF]"} rounded-xl px-4 py-3.5 text-[14px] text-[#1A1A1A] placeholder-[#CECCC6] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition`;

  const hasCalendly = siteConfig.calendlyUrl && siteConfig.calendlyUrl !== "#";

  return (
    <section id="contact" className="bg-[#FAFAF7] py-16 sm:py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12">

        {/* Header banner */}
        <Reveal>
          <div className="bg-[#2563EB] rounded-2xl px-5 sm:px-8 md:px-12 py-8 sm:py-10 mb-10 sm:mb-16">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 sm:gap-6">
              <div>
                <p className="text-white/60 text-[12px] font-semibold tracking-widest uppercase mb-2">Get In Touch</p>
                <h2 className="text-[clamp(28px,4vw,48px)] font-black text-white leading-tight tracking-tight mb-4">
                  Let&apos;s build something great.
                </h2>
                <div className="flex flex-wrap gap-2">
                  {["Starting at $500", "First draft in 72 hrs", "Free quote — no commitment"].map((tag) => (
                    <span key={tag} className="bg-white/15 text-white text-[12px] font-semibold px-3 py-1 rounded-full border border-white/20">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-white/70 text-[15px] leading-relaxed md:max-w-xs md:text-right">
                Fill out the form below and I&apos;ll get back to you within 24 hours — usually sooner.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-10 sm:gap-16 items-start">

          {/* Left column */}
          <Reveal delay={100}>

            {/* Strong opening copy */}
            <p className="text-[#737373] text-[15px] leading-relaxed mb-8">
              Tell me what you need. I&apos;ll send a custom quote within 24 hours — no commitment, no fluff.
            </p>

            {/* Contact options */}
            <div className="space-y-3 mb-10">
              <a href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-4 group p-4 rounded-xl hover:bg-[#F2F1EC] transition-colors border border-transparent hover:border-[#E5E4DF]">
                <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center group-hover:bg-[#2563EB] transition-colors flex-shrink-0">
                  <Mail size={16} className="text-[#2563EB] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-[11px] text-[#AEACA6] uppercase tracking-wide font-medium">Email Me Directly</p>
                  <p className="text-[#1A1A1A] text-[14px] font-medium">{siteConfig.email}</p>
                </div>
              </a>

              {hasCalendly ? (
                <a href={siteConfig.calendlyUrl}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-4 group p-4 rounded-xl hover:bg-[#F2F1EC] transition-colors border border-transparent hover:border-[#E5E4DF]">
                  <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center group-hover:bg-[#2563EB] transition-colors flex-shrink-0">
                    <CalendarDays size={16} className="text-[#2563EB] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#AEACA6] uppercase tracking-wide font-medium">Skip the Form</p>
                    <p className="text-[#1A1A1A] text-[14px] font-medium">Book a free 30-min discovery call →</p>
                  </div>
                </a>
              ) : (
                <div className="flex items-center gap-4 p-4 rounded-xl bg-[#F2F1EC] border border-[#E5E4DF]">
                  <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                    <CalendarDays size={16} className="text-[#2563EB]" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#AEACA6] uppercase tracking-wide font-medium">Response Time</p>
                    <p className="text-[#1A1A1A] text-[14px] font-medium">Within 24 hours — usually same day</p>
                  </div>
                </div>
              )}
            </div>

            {/* How it works — with timeframes */}
            <div className="mb-10">
              <p className="text-[11px] text-[#AEACA6] uppercase tracking-widest font-semibold mb-6">How It Works</p>
              <div className="relative">
                <div className="absolute left-[19px] top-8 bottom-8 w-px bg-gradient-to-b from-[#2563EB] via-[#2563EB]/30 to-[#2563EB]/10" />
                <div className="space-y-1">
                  {[
                    { icon: "✍️", title: "Fill Out This Form", time: "2 min", desc: "Tell me what you need, your timeline, and budget.", active: true },
                    { icon: "📞", title: "Free 30-Min Discovery Call", time: "Free", desc: "We align on goals, design direction, and scope — I answer everything.", active: false },
                    { icon: "⚡", title: "I Build Your Site", time: "2–4 weeks", desc: "Regular check-ins so you always know where things stand.", active: false },
                    { icon: "🚀", title: "Launch Your Way", time: "You go live", desc: "Take your files and host anywhere — or let me manage hosting for $49/mo. Either way, you own it.", active: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 group relative">
                      <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-[15px] border-2 transition-all duration-300 ${
                        item.active
                          ? "bg-[#2563EB] border-[#2563EB] shadow-[0_0_16px_rgba(37,99,235,0.35)]"
                          : "bg-white border-[#E5E4DF] group-hover:border-[#2563EB]/50"
                      }`}>
                        {item.icon}
                      </div>
                      <div className={`flex-1 mb-1 px-4 py-3 rounded-xl transition-all duration-300 ${
                        item.active ? "bg-[#EFF6FF] border border-[#2563EB]/20" : "bg-transparent group-hover:bg-[#F2F1EC]"
                      }`}>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[10px] font-bold tracking-widest uppercase ${item.active ? "text-[#2563EB]" : "text-[#AEACA6]"}`}>
                            Step {i + 1}
                          </span>
                          <span className="text-[10px] font-semibold text-[#2563EB]/60 bg-[#2563EB]/8 px-2 py-0.5 rounded-full">{item.time}</span>
                        </div>
                        <p className="text-[13px] font-bold text-[#1A1A1A] leading-snug">{item.title}</p>
                        <p className="text-[12px] text-[#737373] leading-relaxed mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div>
              <p className="text-[11px] text-[#AEACA6] uppercase tracking-widest font-semibold mb-4">Common Questions</p>
              <div className="space-y-2">
                {faqs.map((faq, i) => (
                  <div key={i} className="border border-[#E5E4DF] rounded-xl overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-4 py-3.5 text-left gap-3"
                    >
                      <span className="text-[13px] font-semibold text-[#1A1A1A] leading-snug">{faq.q}</span>
                      <svg
                        width="14" height="14" fill="none" stroke="#AEACA6" viewBox="0 0 24 24"
                        className={`flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4">
                        <p className="text-[13px] text-[#737373] leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </Reveal>

          {/* Right — form */}
          <Reveal delay={200}>
            {status === "success" ? (
              <div className="bg-white border border-[#E5E4DF] rounded-2xl p-8 sm:p-10 text-center">
                <div className="w-16 h-16 bg-[#2563EB] rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg width="26" height="26" fill="none" stroke="white" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <h3 className="text-[22px] font-black text-[#1A1A1A] mb-2">You&apos;re in!</h3>
                <p className="text-[#737373] text-[14px] mb-6">
                  I&apos;ll be in touch by <span className="font-bold text-[#1A1A1A]">{getTomorrow()}</span> — usually sooner. Here&apos;s what happens next:
                </p>
                <div className="space-y-3 text-left mb-8">
                  {[
                    { icon: "📋", text: "I review your project details" },
                    { icon: "📬", text: "You get a personal response within 24 hrs" },
                    { icon: "📞", text: "We book a free 30-min discovery call" },
                    { icon: "📄", text: "I send a custom proposal with exact pricing" },
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3 bg-[#FAFAF7] rounded-xl px-4 py-3">
                      <span className="text-lg flex-shrink-0">{step.icon}</span>
                      <p className="text-[13px] font-medium text-[#1A1A1A]">{step.text}</p>
                    </div>
                  ))}
                </div>
                <a href="/work" className="inline-flex items-center gap-1.5 text-[#2563EB] text-[13px] font-semibold hover:underline">
                  In the meantime, check out examples of my work →
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                {/* Step indicator */}
                <div className="flex items-center gap-2 mb-1">
                  {[1, 2].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black transition-all ${formStep >= s ? "bg-[#2563EB] text-white" : "bg-[#E5E4DF] text-[#AEACA6]"}`}>{s}</div>
                      {s < 2 && <div className={`h-px w-8 transition-all ${formStep >= 2 ? "bg-[#2563EB]" : "bg-[#E5E4DF]"}`} />}
                    </div>
                  ))}
                  <span className="text-[11px] text-[#AEACA6] ml-1">{formStep === 1 ? "The basics" : "A few more details"}</span>
                </div>

                {/* ── Step 1 ── */}
                {formStep === 1 && (
                  <>
                    {/* Name + Email row */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[12px] font-semibold text-[#1A1A1A] tracking-wide uppercase mb-2">Your Name</label>
                        <input type="text" placeholder="Jane Smith" className={inputClass(!!errors.name)}
                          {...register("name", { required: "Name is required" })} />
                        {errors.name && <p className="text-red-500 text-[12px] mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="block text-[12px] font-semibold text-[#1A1A1A] tracking-wide uppercase mb-2">Email Address</label>
                        <input type="email" placeholder="jane@example.com" className={inputClass(!!errors.email)}
                          {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })} />
                        {errors.email && <p className="text-red-500 text-[12px] mt-1">{errors.email.message}</p>}
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-[12px] font-semibold text-[#1A1A1A] tracking-wide uppercase mb-2">Tell Me About Your Project</label>
                      <textarea rows={5} placeholder="What do you need built? What's the goal? Any details help."
                        className={`w-full bg-white border ${errors.message ? "border-red-400" : "border-[#E5E4DF]"} rounded-xl px-4 py-3.5 text-[14px] text-[#1A1A1A] placeholder-[#CECCC6] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition resize-none`}
                        {...register("message", { required: "Please describe your project" })} />
                      {errors.message && <p className="text-red-500 text-[12px] mt-1">{errors.message.message}</p>}
                    </div>

                    <button type="button" onClick={goToStep2}
                      className="w-full bg-[#2563EB] text-white font-bold py-4 px-6 rounded-xl hover:bg-[#1D4ED8] transition-all text-[15px] tracking-wide hover:scale-[1.01] active:scale-[0.99]">
                      Next — Choose Your Budget →
                    </button>
                    <p className="text-center text-[12px] text-[#AEACA6] -mt-2">Free quote · No commitment</p>
                  </>
                )}

                {/* ── Step 2 ── */}
                {formStep === 2 && (
                  <>
                    {/* Type of Website */}
                    <div>
                      <label className="block text-[12px] font-semibold text-[#1A1A1A] tracking-wide uppercase mb-2">Type of Website</label>
                      <select
                        className={inputClass(!!errors.websiteType)}
                        {...register("websiteType", { required: "Please select a website type" })}
                        onChange={(e) => setWebsiteTypeValue(e.target.value)}
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
                      {websiteTypeValue === "custom" && (
                        <input type="text" placeholder="Describe your website type…"
                          className={`${inputClass(!!errors.websiteTypeCustom)} mt-2`}
                          {...register("websiteTypeCustom", {
                            validate: (val) => websiteTypeValue !== "custom" || !!val || "Please describe your website type",
                          })} />
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

                    {/* Launch Date */}
                    <div>
                      <label className="block text-[12px] font-semibold text-[#1A1A1A] tracking-wide uppercase mb-3">Expected Launch Date</label>
                      <input type="hidden" {...register("launchDate")} />
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                        {[
                          { label: "2 Weeks", value: "2weeks" },
                          { label: "1 Month", value: "1month" },
                          { label: "3 Months", value: "3months" },
                          { label: "Custom", value: "custom" },
                        ].map((opt) => (
                          <button key={opt.value} type="button" onClick={() => selectLaunch(opt.value)}
                            className={`py-2.5 px-3 rounded-xl border text-left transition-all ${
                              launchOption === opt.value
                                ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]"
                                : "border-[#E5E4DF] text-[#737373] hover:border-[#2563EB]/40 bg-white"
                            }`}>
                            <span className="block text-[12px] sm:text-[13px] font-semibold">{opt.label}</span>
                            {launchOption === opt.value && opt.value !== "custom" && (
                              <span className="block text-[10px] mt-0.5 opacity-70">{getDateFromOption(opt.value)}</span>
                            )}
                          </button>
                        ))}
                      </div>
                      {launchOption === "custom" && (
                        <input type="date" value={customDate}
                          onChange={(e) => { setCustomDate(e.target.value); setValue("launchDate", e.target.value); }}
                          className={inputClass()} min={new Date().toISOString().split("T")[0]} />
                      )}
                    </div>

                    {/* Mini testimonial */}
                    <div className="bg-[#F2F1EC] border border-[#E5E4DF] rounded-xl p-4 flex gap-3 items-start">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-[10px] font-black">PS</span>
                      </div>
                      <div>
                        <p className="text-[12px] text-[#555555] leading-relaxed italic">&ldquo;He designed every page from scratch, handled our SEO setup, and we started showing up in Google searches we never ranked for before. Super professional.&rdquo;</p>
                        <p className="text-[11px] font-bold text-[#1A1A1A] mt-1.5">Priya S. — E-Commerce Client</p>
                      </div>
                    </div>

                    {status === "error" && (
                      <p className="text-red-500 text-[13px]">
                        Something went wrong. Email me directly at{" "}
                        <a href={`mailto:${siteConfig.email}`} className="underline">{siteConfig.email}</a>.
                      </p>
                    )}

                    <div>
                      <button type="submit" disabled={status === "loading"}
                        className="w-full bg-[#2563EB] text-white font-bold py-4 px-6 rounded-xl hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-[15px] tracking-wide hover:scale-[1.01] active:scale-[0.99]">
                        {status === "loading" ? "Sending…" : "Get My Free Quote →"}
                      </button>
                      <p className="text-center text-[12px] text-[#AEACA6] mt-2.5">
                        No commitment. I&apos;ll respond within 24 hours.
                      </p>
                    </div>

                    <button type="button" onClick={() => setFormStep(1)}
                      className="w-full text-center text-[12px] text-[#AEACA6] hover:text-[#737373] transition">
                      ← Back
                    </button>
                  </>
                )}

              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
