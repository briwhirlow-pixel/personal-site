"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, CalendarDays, ClipboardList, Phone, Zap, Rocket, Check, ChevronDown } from "lucide-react";
import { budgetOptions, launchOptions, siteConfig } from "@/lib/data";
import Reveal from "./Reveal";

type FormData = {
  name: string;
  email: string;
  phone: string;
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
    a: "Most sites are done in 2 to 4 weeks. You get a first draft within 5 days of project kickoff so you're never left waiting.",
  },
  {
    q: "Do you offer payment plans?",
    a: "Yes , 50% upfront to start, 50% on delivery. Larger projects can split into thirds at agreed milestones.",
  },
  {
    q: "What if I need changes after launch?",
    a: "Every package includes revision rounds. After launch, my $49/mo managed plan includes 1 hr of edits every month.",
  },
  {
    q: "Do I own the website?",
    a: "Always. You get the full source code delivered to you. Host it anywhere , no lock in, ever.",
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
      setValue("launchDate", `${option} , ${getDateFromOption(option)}`);
    } else {
      setValue("launchDate", "");
    }
  };

  const onSubmit = async (data: FormData) => {
    const submitData = { ...data, websiteType: data.websiteType === "custom" ? data.websiteTypeCustom : data.websiteType, launchDate: launchOption === "custom" ? customDate : data.launchDate };
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
    `w-full bg-paper border ${
      hasError ? "border-clay" : "border-rule"
    } rounded-[6px] px-4 py-3 text-[14px] text-ink placeholder:text-ink-muted focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20 transition font-medium`;

  const hasCalendly = Boolean(siteConfig.calendlyUrl);

  const steps = [
    { Icon: ClipboardList, title: "Fill out this form", time: "2 min", desc: "Tell me what you need, your timeline, and budget.", active: true },
    { Icon: Phone, title: "Free 30 min discovery call", time: "Free", desc: "We align on goals, design direction, and scope , I answer everything.", active: false },
    { Icon: Zap, title: "I build your site", time: "2 to 4 weeks", desc: "Regular check ins so you always know where things stand.", active: false },
    { Icon: Rocket, title: "Launch your way", time: "Go live", desc: "Take your files and host anywhere , or let me manage hosting for $49/mo. Either way, you own it.", active: false },
  ];

  return (
    <section id="contact" className="relative bg-paper text-ink pt-20 pb-24">
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 md:px-12">

        {/* Opening , no kicker. Just the headline. */}
        <Reveal>
          <div className="max-w-3xl mb-14 pt-4">
            <h2 className="font-serif text-[clamp(36px,6vw,72px)] leading-[0.95] tracking-[-0.025em] text-ink font-normal">
              Tell me what you&apos;re building.
            </h2>
            <p className="text-ink-soft text-[16px] sm:text-[17px] mt-5 leading-relaxed font-medium max-w-2xl">
              Fill out the form and I&apos;ll email you back within a day , usually within a few hours. No commitment.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-10 sm:gap-12 items-start">

          {/* Left column */}
          <Reveal delay={100}>
            <p className="text-ink-soft text-[15px] leading-relaxed mb-8 font-medium">
              Tell me what you need. I&apos;ll review your project and reach out personally , no commitment, no fluff.
            </p>

            {/* Contact options */}
            <div className="space-y-2 mb-10">
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-4 group p-4 rounded-[6px] hover:bg-paper-soft border border-transparent hover:border-rule transition-colors"
              >
                <div className="w-10 h-10 rounded-[6px] border border-rule bg-paper-soft flex items-center justify-center group-hover:bg-forest group-hover:border-forest transition-colors flex-shrink-0">
                  <Mail size={15} className="text-forest group-hover:text-paper transition-colors" strokeWidth={1.75} />
                </div>
                <div>
                  <p className="font-serif font-semibold text-[10px] text-ink-muted uppercase tracking-[0.18em] font-semibold">Email Directly</p>
                  <p className="text-ink text-[14px] font-semibold mt-0.5">{siteConfig.email}</p>
                </div>
              </a>

              {hasCalendly ? (
                <a
                  href={siteConfig.calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group p-4 rounded-[6px] hover:bg-paper-soft border border-transparent hover:border-rule transition-colors"
                >
                  <div className="w-10 h-10 rounded-[6px] border border-rule bg-paper-soft flex items-center justify-center group-hover:bg-forest group-hover:border-forest transition-colors flex-shrink-0">
                    <CalendarDays size={15} className="text-forest group-hover:text-paper transition-colors" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="font-serif font-semibold text-[10px] text-ink-muted uppercase tracking-[0.18em] font-semibold">Skip the form</p>
                    <p className="text-ink text-[14px] font-semibold mt-0.5">Book a free 30 min discovery call →</p>
                  </div>
                </a>
              ) : (
                <div className="flex items-center gap-4 p-4 rounded-[6px] bg-paper-soft border border-rule">
                  <div className="w-10 h-10 rounded-[6px] border border-rule bg-paper flex items-center justify-center flex-shrink-0">
                    <CalendarDays size={15} className="text-forest" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="font-serif font-semibold text-[10px] text-ink-muted uppercase tracking-[0.18em] font-semibold">Response Time</p>
                    <p className="text-ink text-[14px] font-semibold mt-0.5">Within 24 hours , usually same day</p>
                  </div>
                </div>
              )}
            </div>

            {/* How it works */}
            <div className="mb-10">
              <p className="font-serif font-semibold text-[10px] text-ink-muted uppercase tracking-[0.22em] font-semibold mb-6">
                How it works
              </p>
              <div className="relative">
                <div className="absolute left-[19px] top-8 bottom-8 w-px bg-rule" />
                <div className="space-y-1">
                  {steps.map((item, i) => (
                    <div key={i} className="flex items-start gap-4 group relative">
                      <div
                        className={`relative z-10 w-10 h-10 rounded-[6px] flex items-center justify-center flex-shrink-0 border transition-all duration-300 ${
                          item.active ? "bg-forest border-forest" : "bg-paper border-rule group-hover:border-forest/50"
                        }`}
                        style={item.active ? { boxShadow: "0 0 0 4px rgba(37,99,235,0.1)" } : undefined}
                      >
                        <item.Icon size={15} className={item.active ? "text-paper" : "text-ink-soft"} strokeWidth={1.75} />
                      </div>
                      <div
                        className={`flex-1 mb-1 px-4 py-3 rounded-[6px] transition-all duration-300 ${
                          item.active ? "bg-forest/5 border border-forest/20" : "bg-transparent group-hover:bg-paper-soft"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-serif font-semibold text-[9.5px] font-semibold tracking-[0.22em] uppercase ${item.active ? "text-forest" : "text-ink-muted"}`}>
                            Step 0{i + 1}
                          </span>
                          <span className="font-serif font-semibold text-[9.5px] font-medium text-forest bg-forest/10 px-1.5 py-0.5 rounded-[3px]">{item.time}</span>
                        </div>
                        <p className="text-[13.5px] font-semibold text-ink leading-snug">{item.title}</p>
                        <p className="text-[12px] text-ink-soft leading-relaxed mt-0.5 font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div>
              <p className="font-serif font-semibold text-[10px] text-ink-muted uppercase tracking-[0.22em] font-semibold mb-3">
                Common questions
              </p>
              <div className="space-y-2">
                {faqs.map((faq, i) => (
                  <div key={i} className="border border-rule rounded-[6px] overflow-hidden bg-paper-soft">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-4 py-3.5 text-left gap-3"
                    >
                      <span className="text-[13px] font-semibold text-ink leading-snug">{faq.q}</span>
                      <ChevronDown
                        size={14}
                        strokeWidth={2}
                        className={`text-ink-muted flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                      />
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4">
                        <p className="text-[13px] text-ink-soft leading-relaxed font-medium">{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </Reveal>

          {/* Right , form */}
          <Reveal delay={200}>
            {status === "success" ? (
              <div className="bg-paper-soft border border-rule rounded-[8px] p-8 sm:p-10" role="status" aria-live="polite">
                <div className="w-12 h-12 bg-forest rounded-full flex items-center justify-center mb-5">
                  <Check size={20} className="text-paper" strokeWidth={2.5} />
                </div>
                <h3 className="font-serif text-[28px] text-ink mb-3 leading-tight">Got it.</h3>
                <p className="text-ink-soft text-[15px] leading-relaxed mb-2 font-medium">
                  I&apos;ll email you back from <span className="font-semibold text-ink">brianwhirlowbusiness@gmail.com</span> by{" "}
                  <span className="font-semibold text-ink">{getTomorrow()}</span> , usually within a few hours.
                </p>
                <p className="text-ink-soft text-[14px] mb-7 font-medium">— Brian</p>
                {hasCalendly && (
                  <a
                    href={siteConfig.calendlyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-forest text-paper font-semibold px-5 py-3 rounded-[6px] hover:bg-forest-deep transition-colors text-[13px] mr-3"
                  >
                    Or grab a call slot →
                  </a>
                )}
                <a href="/work" className="inline-flex items-center gap-1.5 text-forest text-[13px] font-semibold hover:text-forest-bright border-b border-forest/30 pb-0.5">
                  See recent work
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-paper-soft border border-rule rounded-[8px] p-6 sm:p-7">

                {/* Step indicator */}
                <div className="flex items-center gap-2 mb-2">
                  {[1, 2].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-[4px] flex items-center justify-center text-[11px] font-bold font-serif font-semibold transition-all ${formStep >= s ? "bg-forest text-paper" : "bg-paper border border-rule text-ink-muted"}`}>{s}</div>
                      {s < 2 && <div className={`h-px w-8 transition-all ${formStep >= 2 ? "bg-forest" : "bg-rule"}`} />}
                    </div>
                  ))}
                  <span className="font-serif font-semibold text-[10px] tracking-[0.18em] uppercase text-ink-muted ml-1">
                    {formStep === 1 ? "The basics" : "A few more details"}
                  </span>
                </div>

                {/* Step 1 */}
                {formStep === 1 && (
                  <>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-name" className="block font-serif font-semibold text-[10px] font-semibold text-ink tracking-[0.18em] uppercase mb-2">Your Name</label>
                        <input id="contact-name" type="text" placeholder="Jane Smith"
                          className={inputClass(!!errors.name)}
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? "contact-name-error" : undefined}
                          {...register("name", { required: "Name is required" })} />
                        {errors.name && <p id="contact-name-error" className="text-clay text-[12px] mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="block font-serif font-semibold text-[10px] font-semibold text-ink tracking-[0.18em] uppercase mb-2">Email</label>
                        <input id="contact-email" type="email" placeholder="jane@example.com"
                          className={inputClass(!!errors.email)}
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? "contact-email-error" : undefined}
                          {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })} />
                        {errors.email && <p id="contact-email-error" className="text-clay text-[12px] mt-1">{errors.email.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-phone" className="block font-serif font-semibold text-[10px] font-semibold text-ink tracking-[0.18em] uppercase mb-2">
                        Phone <span className="text-ink-muted normal-case font-medium tracking-normal">, optional</span>
                      </label>
                      <input id="contact-phone" type="tel" placeholder="(555) 000-0000" className={inputClass()}
                        {...register("phone")} />
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="block font-serif font-semibold text-[10px] font-semibold text-ink tracking-[0.18em] uppercase mb-2">Tell Me About Your Project</label>
                      <textarea id="contact-message" rows={5} placeholder="What do you need built? What's the goal? Any details help."
                        className={`${inputClass(!!errors.message)} resize-none`}
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? "contact-message-error" : undefined}
                        {...register("message", { required: "Please describe your project" })} />
                      {errors.message && <p id="contact-message-error" className="text-clay text-[12px] mt-1">{errors.message.message}</p>}
                    </div>

                    <button type="button" onClick={goToStep2}
                      className="w-full bg-forest text-paper font-semibold py-3.5 px-6 rounded-[6px] hover:bg-forest-deep transition-colors text-[14px] tracking-wide"
                      style={{ boxShadow: "0 8px 24px -8px rgba(37,99,235,0.4)" }}>
                      Next , Choose Your Budget →
                    </button>
                    <p className="text-center text-[11px] text-ink-muted font-serif font-semibold tracking-wide -mt-1">FREE QUOTE · NO COMMITMENT</p>
                  </>
                )}

                {/* Step 2 */}
                {formStep === 2 && (
                  <>
                    <div>
                      <label htmlFor="contact-type" className="block font-serif font-semibold text-[10px] font-semibold text-ink tracking-[0.18em] uppercase mb-2">Type of Website</label>
                      <select id="contact-type"
                        className={inputClass(!!errors.websiteType)}
                        aria-invalid={!!errors.websiteType}
                        aria-describedby={errors.websiteType ? "contact-type-error" : undefined}
                        {...register("websiteType", { required: "Please select a website type" })}
                        onChange={(e) => setWebsiteTypeValue(e.target.value)}
                      >
                        <option value="">Select a type…</option>
                        <option value="Business / Brochure Site">Business / Brochure Site</option>
                        <option value="Ecommerce Store">Ecommerce Store</option>
                        <option value="Portfolio / Personal Brand">Portfolio / Personal Brand</option>
                        <option value="Restaurant / Food & Beverage">Restaurant / Food & Beverage</option>
                        <option value="Real Estate">Real Estate</option>
                        <option value="Health, Wellness & Fitness">Health, Wellness & Fitness</option>
                        <option value="Blog / Content Site">Blog / Content Site</option>
                        <option value="Landing Page">Landing Page</option>
                        <option value="Nonprofit / Community">Nonprofit / Community</option>
                        <option value="custom">Other , I&apos;ll describe it below</option>
                      </select>
                      {errors.websiteType && <p id="contact-type-error" className="text-clay text-[12px] mt-1">{errors.websiteType.message}</p>}
                      {websiteTypeValue === "custom" && (
                        <input type="text" placeholder="Describe your website type…"
                          className={`${inputClass(!!errors.websiteTypeCustom)} mt-2`}
                          aria-invalid={!!errors.websiteTypeCustom}
                          aria-describedby={errors.websiteTypeCustom ? "contact-typecustom-error" : undefined}
                          {...register("websiteTypeCustom", {
                            validate: (val) => websiteTypeValue !== "custom" || !!val || "Please describe your website type",
                          })} />
                      )}
                      {errors.websiteTypeCustom && <p id="contact-typecustom-error" className="text-clay text-[12px] mt-1">{errors.websiteTypeCustom.message}</p>}
                    </div>

                    <div>
                      <label htmlFor="contact-budget" className="block font-serif font-semibold text-[10px] font-semibold text-ink tracking-[0.18em] uppercase mb-2">Budget Range</label>
                      <select id="contact-budget"
                        className={inputClass(!!errors.budget)}
                        aria-invalid={!!errors.budget}
                        aria-describedby={errors.budget ? "contact-budget-error" : undefined}
                        {...register("budget", { required: "Please select a budget" })}>
                        <option value="">Select a range…</option>
                        {budgetOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                      {errors.budget && <p id="contact-budget-error" className="text-clay text-[12px] mt-1">{errors.budget.message}</p>}
                    </div>

                    <div>
                      <label className="block font-serif font-semibold text-[10px] font-semibold text-ink tracking-[0.18em] uppercase mb-3">Expected Launch Date</label>
                      <input type="hidden" {...register("launchDate")} />
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                        {launchOptions.map((opt) => (
                          <button key={opt.value} type="button" onClick={() => selectLaunch(opt.value)}
                            className={`py-2.5 px-3 rounded-[6px] border text-left transition-all ${
                              launchOption === opt.value
                                ? "border-forest bg-forest/10 text-forest"
                                : "border-rule text-ink-soft hover:border-forest/40 bg-paper"
                            }`}>
                            <span className="block text-[12.5px] font-semibold">{opt.label}</span>
                            {launchOption === opt.value && opt.value !== "custom" && (
                              <span className="block font-serif font-semibold text-[10px] mt-0.5 opacity-70 tracking-wide">{getDateFromOption(opt.value)}</span>
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

                    {/* Testimonial proof */}
                    <div className="bg-paper border border-rule rounded-[6px] p-4 flex gap-3 items-start">
                      <div className="w-9 h-9 rounded-full bg-forest flex items-center justify-center flex-shrink-0">
                        <span className="text-paper text-[10px] font-bold font-serif font-semibold">PS</span>
                      </div>
                      <div>
                        <p className="text-[12px] text-ink-soft leading-relaxed italic font-medium">&ldquo;He designed every page from scratch, handled our SEO setup, and we started showing up in Google searches we never ranked for before. Super professional.&rdquo;</p>
                        <p className="text-[11px] font-semibold text-ink mt-1.5">Priya S. , Ecommerce Client</p>
                      </div>
                    </div>

                    <div role="alert" aria-live="polite">
                      {status === "error" && (
                        <p className="text-clay text-[13px] font-medium">
                          Something went wrong. Email me directly at{" "}
                          <a href={`mailto:${siteConfig.email}`} className="underline">{siteConfig.email}</a>.
                        </p>
                      )}
                    </div>

                    <div>
                      <button type="submit" disabled={status === "loading"}
                        className="w-full bg-forest text-paper font-semibold py-3.5 px-6 rounded-[6px] hover:bg-forest-deep disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[14px] tracking-wide"
                        style={{ boxShadow: "0 8px 24px -8px rgba(37,99,235,0.4)" }}>
                        {status === "loading" ? "Sending…" : "Get My Free Quote →"}
                      </button>
                      <p className="text-center text-[11px] text-ink-muted font-serif font-semibold tracking-wide mt-2.5">
                        NO COMMITMENT · 24-HOUR RESPONSE
                      </p>
                    </div>

                    <button type="button" onClick={() => setFormStep(1)}
                      className="w-full text-center text-[12px] text-ink-muted hover:text-ink-soft transition font-medium">
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
