"use client";

import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

interface Project {
  id: string;
  title: string;
  category: string;
  note: string;
  type: "image" | "video";
  src: string;
  poster?: string;
  alt?: string;
}

interface PortfolioData {
  heroTitle: string;
  heroDescription: string;
  aboutText: string;
  contactEmail: string;
  contactPhone: string;
  projects: Project[];
}

interface HomeContentProps {
  serviceOptions: string[];
  defaultData: PortfolioData;
}

export function HomeContent({ serviceOptions, defaultData }: HomeContentProps) {
  const { t } = useLanguage();
  const [feedback, setFeedback] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(defaultData);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem("portfolioData");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setPortfolioData({
          ...defaultData,
          ...parsed,
          projects: parsed.projects || defaultData.projects,
        });
      }
    } catch (error) {
      console.error("Error loading portfolio data:", error);
    }
  }, []);

  useEffect(() => {
    const revealItems = document.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const selectedServices = formData.getAll("service").map(String);
    const clientName = formData.get("clientName")?.toString().trim() ?? "";
    const clientPhone = formData.get("clientPhone")?.toString().trim() ?? "";
    const clientEmail = formData.get("clientEmail")?.toString().trim() ?? "";
    const projectBrief = formData.get("projectBrief")?.toString().trim() ?? "";

    if (!selectedServices.length) {
      setFeedback("Please select at least one service before sending.");
      return;
    }

    // Clear any previous error
    setFeedback("");

    const inquiry = {
      clientName,
      clientPhone,
      clientEmail,
      services: selectedServices,
      projectBrief,
      isRead: false,
      createdAt: Date.now(),
    };

    try {
      // Save to Firebase Firestore
      await addDoc(collection(db, "inquiries"), inquiry);

      // Also send email notification
      fetch("/api/send-client-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          clientPhone,
          clientEmail,
          services: selectedServices,
          projectBrief,
        }),
      }).catch((error) => console.error("Error sending email:", error));

      // Show popup below button, reset all fields, auto-hide after 5 seconds
      setShowPopup(true);
      setFeedback("");
      if (formRef.current) formRef.current.reset();
      setTimeout(() => setShowPopup(false), 5000);
    } catch (error) {
      console.error("Error saving inquiry:", error);
      setFeedback("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Hamza Teha home">
          <span className="brand-mark">HT</span>
          <span className="brand-copy">
            <strong>Hamza Teha</strong>
            <small>TEHA TECH company</small>
          </span>
        </a>
        <nav className="nav">
          <a href="#home">{t("nav.home")}</a>
          <a href="#about">{t("nav.about")}</a>
          <a href="#services">{t("nav.services")}</a>
          <a href="#work">{t("nav.work")}</a>
          <a href="#contact">{t("nav.contact")}</a>
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <a className="button button-solid" href="#contact">
            {t("btn.hire")}
          </a>
        </div>
      </header>

      <main>
        <section className="hero section" id="home">
          <div className="hero-copy reveal">
            <p className="eyebrow">{t("hero.eyebrow")}</p>
            <h1>{portfolioData.heroTitle}</h1>
            <p className="lead">{portfolioData.heroDescription}</p>
            <div className="hero-actions">
              <a className="button button-solid" href="#work">
                {t("hero.btn.work")}
              </a>
              <a className="button button-ghost" href="#contact">
                {t("hero.btn.contact")}
              </a>
            </div>
            <div className="hero-meta">
              <div>
                <span>{t("hero.meta.focus")}</span>
                <strong>{t("hero.meta.focus.value")}</strong>
              </div>
              <div>
                <span>{t("hero.meta.status")}</span>
                <strong>{t("hero.meta.status.value")}</strong>
              </div>
            </div>
          </div>

          <div className="hero-visual reveal">
            <div className="media-frame media-frame-large" style={{ width: "100%" }}>
              <video controls poster="/images/hero-placeholder.png" style={{ width: "100%" }}>
                <source src="/videos/hero-reel-placeholder.mp4" type="video/mp4" />
              </video>
              <div className="media-note">
                five strategy to learn video editing  <code>public/videos/hero-reel.mp4</code>
              </div>
            </div>
          </div>
        </section>

        <section className="brand-strip reveal" aria-label="Trust and social proof">
          <span>{t("brand.workflow")}</span>
          <span>{t("brand.portfolio")}</span>
          <span>{t("brand.storytelling")}</span>
          <span>{t("brand.logos")}</span>
          <span>{t("brand.awards")}</span>
        </section>

        <section className="section about-grid" id="about">
          <div className="section-heading reveal">
            <p className="eyebrow">{t("about.eyebrow")}</p>
            <h2>{t("about.title")}</h2>
          </div>
          <div className="about-story reveal">
            <p>{portfolioData.aboutText}</p>
            <p>{t("about.text2")}</p>
            <div className="value-points">
              <article className="value-card">
                <h3>{t("about.vision")}</h3>
                <p>{t("about.vision.desc")}</p>
              </article>
              <article className="value-card">
                <h3>{t("about.editing")}</h3>
                <p>{t("about.editing.desc")}</p>
              </article>
              <article className="value-card">
                <h3>{t("about.story")}</h3>
                <p>{t("about.story.desc")}</p>
              </article>
            </div>
          </div>
          <aside className="profile-card reveal">
            <div className="profile-image-wrap">
              <img src="/images/profile-placeholder.png" alt="Hamza Teha profile placeholder" />
            </div>
            <div className="profile-details">
              <p className="eyebrow">{t("about.brand")}</p>
              <h3>{t("about.name")}</h3>
              <p>{t("about.title.brand")}</p>
              <ul>
                <li>Based for remote creative work</li>
                <li>Open to freelance and collaboration</li>
                <li>Focused on premium edits and digital services</li>
              </ul>
            </div>
          </aside>
        </section>

        <section className="section" id="services">
          <div className="section-heading reveal">
            <p className="eyebrow">{t("services.eyebrow")}</p>
            <h2>{t("services.title")}</h2>
          </div>
          <div className="service-grid">
            <article className="service-card reveal">
              <div className="service-icon">01</div>
              <h3>{t("services.video")}</h3>
              <p>{t("services.video.desc")}</p>
            </article>
            <article className="service-card reveal">
              <div className="service-icon">02</div>
              <h3>{t("services.web")}</h3>
              <p>{t("services.web.desc")}</p>
            </article>
            <article className="service-card reveal">
              <div className="service-icon">03</div>
              <h3>{t("services.thumbnail")}</h3>
              <p>{t("services.thumbnail.desc")}</p>
            </article>
            <article className="service-card reveal">
              <div className="service-icon">04</div>
              <h3>{t("services.tech")}</h3>
              <p>{t("services.tech.desc")}</p>
            </article>
          </div>
        </section>

        <section className="section work-section" id="work">
          <div className="section-heading reveal">
            <p className="eyebrow">{t("work.eyebrow")}</p>
            <h2>{t("work.title")}</h2>
          </div>
          <div className="project-grid">
            {portfolioData.projects.map((project) => (
              <article className="project-card reveal" key={project.id}>
                <div className="project-media" style={{ width: "100%" }}>
                  {project.type === "video" ? (
                    <video controls poster={project.poster} style={{ width: "100%" }}>
                      <source src={project.src} type="video/mp4" />
                    </video>
                  ) : (
                    <img src={project.src} alt={project.alt} style={{ width: "100%" }} />
                  )}
                </div>
                <div className="project-copy">
                  <h3>{project.title}</h3>
                  <p>{project.category}</p>
                  <small>{project.note}</small>
                </div>
              </article>
            ))}
          </div>
          <div className="section-action reveal">
            <a className="button button-ghost" href="#case-studies">
              {t("work.more")}
            </a>
          </div>
        </section>

        <section className="section case-study-layout" id="case-studies">
          <div className="section-heading reveal">
            <p className="eyebrow">{t("case.eyebrow")}</p>
            <h2>{t("case.title")}</h2>
          </div>
          <article className="case-study-card reveal">
            <div className="case-study-copy">
              <span className="case-tag">{t("case.tag")}</span>
              <h3>{t("case.heading")}</h3>
              <p>{t("case.desc")}</p>
            </div>
            <div className="case-study-media" style={{ width: "100%" }}>
              <img src="/images/case-study-placeholder.png" alt="Case study placeholder" style={{ width: "100%" }} />
              <span className="media-status"></span>
            </div>
          </article>
        </section>

        <section className="section tools-layout" id="tools">
          <div className="section-heading reveal">
            <p className="eyebrow">{t("tools.eyebrow")}</p>
            <h2>{t("tools.title")}</h2>
          </div>
          <div className="tools-grid reveal">
            <div className="tool-group">
              <h3>{t("tools.editing")}</h3>
              <div className="tool-list">
                <span>Adobe Photoshop</span>
                <span>CapCut</span>
                <span>DaVinci Resolve</span>
              </div>
            </div>
            <div className="tool-group">
              <h3>{t("tools.motion")}</h3>
              <div className="tool-list">
                <span>After Effects</span>
                <span>Animation Basics</span>
                <span>Typography Motion</span>
              </div>
            </div>
            <div className="tool-group">
              <h3>{t("tools.color")}</h3>
              <div className="tool-list">
                <span>Color Cleanup</span>
                <span>Audio Polish</span>
                <span>Delivery Formatting</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section testimonials-layout" id="testimonials">
          <div className="section-heading reveal">
            <p className="eyebrow">{t("testimonials.eyebrow")}</p>
            <h2>{t("testimonials.title")}</h2>
          </div>
          <div className="testimonial-grid">
            <article className="testimonial-card reveal">
              <p>Client quote placeholder. Add a short result-focused testimonial here later.</p>
              <strong>Future Client Name</strong>
            </article>
            <article className="testimonial-card reveal">
              <p>Client quote placeholder. Keep this area open for stronger proof as work grows.</p>
              <strong>Future Brand Name</strong>
            </article>
            <article className="testimonial-card reveal">
              <p>Client quote placeholder. Designed to scale without crowding the section.</p>
              <strong>Future Collaboration</strong>
            </article>
          </div>
        </section>

        <section className="section cta-band reveal">
          <p className="eyebrow">{t("cta.eyebrow")}</p>
          <h2>{t("cta.title")}</h2>
          <p>{t("cta.desc")}</p>
          <div className="hero-actions">
            <a className="button button-solid" href="#contact">
              {t("cta.btn.start")}
            </a>
            <a
              className="button button-ghost"
              href="https://t.me/teha_creative"
              target="_blank"
              rel="noreferrer"
            >
              {t("cta.btn.message")}
            </a>
          </div>
        </section>

        <section className="section contact-layout" id="contact">
          <div className="section-heading reveal">
            <p className="eyebrow">{t("contact.eyebrow")}</p>
            <h2>{t("contact.title")}</h2>
          </div>
          <div className="contact-grid">
            <aside className="contact-card reveal">
              <h3>{t("contact.heading")}</h3>
              <div className="contact-points">
                <div>
                  <span>{t("contact.phone")}</span>
                  <strong>{portfolioData.contactPhone}</strong>
                </div>
                <div>
                  <span>{t("contact.email")}</span>
                  <strong>{portfolioData.contactEmail}</strong>
                </div>
                <div>
                  <span>{t("contact.brand")}</span>
                  <strong>Teha Tech</strong>
                </div>
              </div>
              <p className="contact-note">
                {t("contact.note")}
              </p>
              <div className="social-icons" aria-label="Social media links">
                <a
                  href="https://t.me/teha_creative"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Telegram"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M21.6 4.2 2.9 11.4c-1.3.5-1.3 1.2-.2 1.5l4.8 1.5 1.9 5.9c.2.7.1 1 1 1l2.8-2.7 5.8 4.3c1.1.6 1.8.3 2.1-1L23.8 5c.4-1.6-.6-2.3-2.2-1.7Zm-12 10.1-.4 4.2-.1.7c-.2 0-.3-.1-.4-.3l-1.5-4.9 11-6.9c.5-.3 1-.1.6.2" />
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/@TehaTechofficial100k"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M23.5 7.2a3 3 0 0 0-2.1-2.1C19.4 4.5 12 4.5 12 4.5s-7.4 0-9.4.6A3 3 0 0 0 .5 7.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c2 .6 9.4.6 9.4.6s7.4 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-4.8ZM9.6 15.7V8.3l6.5 3.7" />
                  </svg>
                </a>
                <a href={`mailto:${portfolioData.contactEmail}`} aria-label="Email">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 5.5h18A1.5 1.5 0 0 1 22.5 7v10A1.5 1.5 0 0 1 21 18.5H3A1.5 1.5 0 0 1 1.5 17V7A1.5 1.5 0 0 1 3 5.5Zm0 2v.2l9 5.8 9-5.8v-.2Zm18 9V9.9l-8.4 5.4a1 1 0 0 1-1.2 0L3 9.9v6.6Z" />
                  </svg>
                </a>
              </div>
            </aside>

            <form className="inquiry-form reveal" id="inquiry-form" ref={formRef} onSubmit={handleSubmit}>
              <div className="form-header">
                <h3>{t("contact.form.title")}</h3>
                <p>{t("contact.form.desc")}</p>
              </div>
              <div className="checkbox-grid">
                {serviceOptions.map((service) => (
                  <label key={service}>
                    <input type="checkbox" name="service" value={service} /> {service}
                  </label>
                ))}
              </div>
              <div className="field-grid">
                <label>
                  <span>{t("contact.form.name")}</span>
                  <input type="text" name="clientName" placeholder={t("contact.form.name.placeholder")} required />
                </label>
                <label>
                  <span>{t("contact.form.phone")}</span>
                  <input type="tel" name="clientPhone" placeholder={t("contact.form.phone.placeholder")} required />
                </label>
              </div>
              <label>
                <span>{t("contact.form.email")}</span>
                <input type="email" name="clientEmail" placeholder={t("contact.form.email.placeholder")} required />
              </label>
              <label>
                <span>{t("contact.form.brief")}</span>
                <textarea
                  name="projectBrief"
                  rows={5}
                  placeholder={t("contact.form.brief.placeholder")}
                />
              </label>
              <div className="form-actions">
                <button className="button button-solid" type="submit">
                  {t("contact.form.submit")}
                </button>
                {feedback && (
                  <p aria-live="polite" style={{ color: "red", marginTop: "8px", fontSize: "0.9rem" }}>
                    {feedback}
                  </p>
                )}
                {showPopup && (
                  <p aria-live="polite" style={{
                    marginTop: "14px",
                    fontFamily: "var(--font-quicksand), 'Quicksand', sans-serif",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "#05F244",
                    letterSpacing: "0.02em",
                  }}>
                    ✅ {t("contact.form.success")}
                  </p>
                )}
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div>
          <strong>Hamza Teha</strong>
          <p>{t("footer.desc")}</p>
        </div>
        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#work">Work</a>
          <a href="#contact">Contact</a>
          <LanguageToggle />
          <a href="/admin/login" title="Admin Dashboard" style={{ fontSize: "18px" }}>
            ⚙️
          </a>
        </div>
      </footer>
    </div>
  );
}
