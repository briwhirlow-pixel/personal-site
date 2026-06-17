"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, CalendarDays, Check, ChevronDown } from "lucide-react";
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

const contactFaqs = [
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
    } px-4 py-3 text-[14px] text-ink placeholder:text-ink-muted focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20 transition font-medium`;

  const hasCalendly = Boolean(siteConfig.calendlyUrl);

  return (
    <section id="contact" className="relative bg-paper text-ink pt-20 pb-24">
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 md:px-12">

        <Reveal>
          <div className="max-w-3xl mb-14 pt-4">
            <h2
              className="font-display font-extrabold leading-[0.95] tracking-[-0.025em] text-ink"
              style={{ fontSize: 'clamp(36px, 6vw, 72px)' }}
            >
              Tell me what you&apos;re building.
            </h2>
            <p className="text-ink-soft text-[16px] sm:text-[17px] mt-5 leading-relaxed font-medium max-w-2xl">
              Fill out the form and I&apos;ll email you back within a day , usually within a few hours. No commitment.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-10 sm:gap-12 items-start">

          {/* Left column — contact options + FAQ only, no step sequence */}
          <Reveal delay={100}>
            <div className="space-y-2 mb-10">
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-4 group p-4 hover:bg-paper-soft border border-transparent hover:border-rule transition-colors"
                style={{ minHeight: 48 }}
              >
                <div className="w-10 h-10 border border-rule bg-paper-soft flex items-center justify-center group-hover:bg-forest group-hover:border-forest transition-colors flex-shrink-0">
                  <Mail size={15} className="text-forest group-hover:text-paper transition-colors" strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-[10px] text-ink-muted uppercase tracking-[0.12em] font-semibold">Email directly</p>
                  <p className="text-ink text-[14px] font-semibold mt-0.5">{siteConfig.email}</p>
                </div>
              </a>

              {hasCalendly ? (
                <a
                  href={siteConfig.calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group p-4 hover:bg-paper-soft border border-transparent hover:border-rule transition-colors"
                  style={{ minHeight: 48 }}
                >
                  <div className="w-10 h-10 border border-rule bg-paper-soft flex items-center justify-center group-hover:bg-forest group-hover:border-forest transition-colors flex-shrink-0">
                    <CalendarDays size={15} className="text-forest group-hover:text-paper transition-colors" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-[10px] text-ink-muted uppercase tracking-[0.12em] font-semibold">Skip the form</p>
                    <p className="text-ink text-[14px] font-semibold mt-0.5">Book a free 30 min discovery call →</p>
                  </div>
                </a>
              ) : (
                <div className="flex items-center gap-4 p-4 bg-paper-soft border border-rule">
                  <div className="w-10 h-10 border border-rule bg-paper flex items-center justify-center flex-shrink-0">
                    <CalendarDays size={15} className="text-forest" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-[10px] text-ink-muted uppercase tracking-[0.12em] font-semibold">Response time</p>
                    <p className="text-ink text-[14px] font-semibold mt-0.5">Within 24 hours , usually same day</p>
                  </div>
                </div>
              )}
            </div>

            {/* FAQ */}
            <div>
              <p className="text-[10px] text-ink-muted uppercase tracking-[0.12em] font-semibold mb-3">
                Common questions
              </p>
              <div className="space-y-2">
                {contactFaqs.map((faq, i) => (
                  <div key={i} className="border border-rule overflow-hidden bg-paper-soft">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-4 py-3.5 text-left gap-3"
                      style={{ minHeight: 44 }}
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
              <div className="bg-paper-soft border border-rule p-8 sm:p-10" role="status" aria-live="polite">
                <div className="w-12 h-12 bg-forest flex items-center justify-center mb-5">
                  <Check size={20} className="text-paper" strokeWidth={2.5} />
                </div>
                <h3 className="font-display font-bold text-[28px] text-ink mb-3 leading-tight">Got it.</h3>
                <p className="text-ink-soft text-[15px] leading-relaxed mb-2 font-medium">
                  I&apos;ll email you back from <span className="font-semibold text-ink">brianwhirlowbusiness@gmail.com</span> by{" "}
                  <span className="font-semibold text-ink">{getTomorrow()}</span> , usually within a few hours.
                </p>
                <p className="text-ink-muted text-[14px] mb-7 font-display font-bold">Brian</p>
                {hasCalendly && (
                  <a
                    href={siteConfig.calendlyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-forest text-paper font-semibold px-5 py-3 hover:bg-forest-deep transition-colors text-[13px] mr-3"
                    style={{ minHeight: 44 }}
                  >
                    Or grab a call slot →
                  </a>
                )}
                <a href="/work" className="inline-flex items-center gap-1.5 text-forest text-[13px] font-semibold hover:text-forest-bright border-b border-forest/30 pb-0.5">
                  See recent work
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-paper-soft border border-rule p-6 sm:p-7">

                {/* Step indicator — no numbers, just progress bar */}
                <div className="flex items-center gap-3 mb-2">
                  <div className={`h-1 flex-1 transition-colors ${formStep >= 1 ? "bg-forest" : "bg-rule"}`} />
                  <div className={`h-1 flex-1 transition-colors ${formStep >= 2 ? "bg-forest" : "bg-rule"}`} />
                  <span className="text-[10px] tracking-[0.12em] uppercase text-ink-muted font-semibold ml-1">
                    {formStep === 1 ? "The basics" : "A few more details"}
                  </span>
                </div>

                {formStep === 1 && (
                  <>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-name" className="block text-[10px] font-semibold text-ink tracking-[0.12em] uppercase mb-2">Your Name</label>
                        <input id="contact-name" type="text" placeholder="Jane Smith"
                          className={inputClass(!!errors.name)}
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? "contact-name-error" : undefined}
                          {...register("name", { required: "Name is required" })} />
                        {errors.name && <p id="contact-name-error" className="text-clay text-[12px] mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="block text-[10px] font-semibold text-ink tracking-[0.12em] uppercase mb-2">Email</label>
                        <input id="contact-email" type="email" placeholder="jane@example.com"
                          className={inputClass(!!errors.email)}
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? "contact-email-error" : undefined}
                          {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })} />
                        {errors.email && <p id="contact-email-error" className="text-clay text-[12px] mt-1">{errors.email.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-phone" className="block text-[10px] font-semibold text-ink tracking-[0.12em] uppercase mb-2">
                        Phone <span className="text-ink-muted normal-case font-medium tracking-normal">, optional</span>
                      </label>
                      <input id="contact-phone" type="tel" placeholder="(555) 000-0000" className={inputClass()}
                        {...register("phone")} />
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="block text-[10px] font-semibold text-ink tracking-[0.12em] uppercase mb-2">Tell Me About Your Project</label>
                      <textarea id="contact-message" rows={5} placeholder="What do you need built? What's the goal? Any details help."
                        className={`${inputClass(!!errors.message)} resize-none`}
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? "contact-message-error" : undefined}
                        {...register("message", { required: "Please describe your project" })} />
                      {errors.message && <p id="contact-message-error" className="text-clay text-[12px] mt-1">{errors.message.message}</p>}
                    </div>

                    <button type="button" onClick={goToStep2}
                      className="w-full bg-clay text-ink font-semibold py-4 px-6 hover:bg-clay-deep transition-colors text-[14px] active:scale-[0.98]"
                      style={{ boxShadow: "0 8px 24px -8px rgba(232,88,58,0.4)", minHeight: 48 }}>
                      Next , Choose Your Budget →
                    </button>
                    <p className="text-center text-[11px] text-ink-muted font-semibold tracking-[0.1em] uppercase -mt-1">Free quote · No commitment</p>
                  </>
                )}

                {formStep === 2 && (
                  <>
                    <div>
                      <label htmlFor="contact-type" className="block text-[10px] font-semibold text-ink tracking-[0.12em] uppercase mb-2">Type of Website</label>
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
                      <label htmlFor="contact-budget" className="block text-[10px] font-semibold text-ink tracking-[0.12em] uppercase mb-2">Budget Range</label>
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
                      <label className="block text-[10px] font-semibold text-ink tracking-[0.12em] uppercase mb-3">Expected Launch Date</label>
                      <input type="hidden" {...register("launchDate")} />
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                        {launchOptions.map((opt) => (
                          <button key={opt.value} type="button" onClick={() => selectLaunch(opt.value)}
                            className={`py-2.5 px-3 border text-left transition-all ${
                              launchOption === opt.value
                                ? "border-forest bg-forest/10 text-forest"
                                : "border-rule text-ink-soft hover:border-forest/40 bg-paper"
                            }`}
                            style={{ minHeight: 44 }}
                          >
                            <span className="block text-[12.5px] font-semibold">{opt.label}</span>
                            {launchOption === opt.value && opt.value !== "custom" && (
                              <span className="block text-[10px] mt-0.5 opacity-70 tracking-wide">{getDateFromOption(opt.value)}</span>
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

                    <div className="bg-paper border border-rule p-4 flex gap-3 items-start">
                      <div className="w-9 h-9 bg-forest flex items-center justify-center flex-shrink-0">
                        <span className="text-paper text-[10px] font-bold font-display">PS</span>
                      </div>
                      <div>
                        <p className="text-[12px] text-ink-soft leading-relaxed font-medium">&ldquo;He designed every page from scratch, handled our SEO setup, and we started showing up in Google searches we never ranked for before. Super professional.&rdquo;</p>
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
                        className="w-full bg-clay text-ink font-semibold py-4 px-6 hover:bg-clay-deep disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[14px] active:scale-[0.98]"
                        style={{ boxShadow: "0 8px 24px -8px rgba(232,88,58,0.4)", minHeight: 48 }}>
                        {status === "loading" ? "Sending…" : "Get My Free Quote →"}
                      </button>
                      <p className="text-center text-[11px] text-ink-muted font-semibold tracking-[0.1em] uppercase mt-2.5">
                        No commitment · 24-hour response
                      </p>
                    </div>

                    <button type="button" onClick={() => setFormStep(1)}
                      className="w-full text-center text-[12px] text-ink-muted hover:text-ink-soft transition font-medium"
                      style={{ minHeight: 44 }}
                    >
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
