"use client";

import { useEffect, useState } from "react";

const serviceOptions = [
  "Web Development",
  "Video Editing",
  "Thumbnail Design",
  "Online Passport",
  "banner design",
  "Tech Related",
];

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

const defaultData: PortfolioData = {
  heroTitle: "Cinematic Video Editing That Makes Brands Feel Premium",
  heroDescription: "I help creators, brands, and businesses turn raw footage into polished visual stories with clean pacing, strong emotion, and a premium final look.",
  aboutText: "I'm Hamza Teha, a video editor building work that feels cinematic, focused, and valuable. My approach combines creative instinct with strong technical execution so every cut, transition, and pacing choice supports the message.",
  contactEmail: "hamzatehafeko8@gmail.com",
  contactPhone: "+251 965614501",
  projects: [
    {
      id: "1",
      title: "Brand Story Edit",
      category: "Commercial / Identity",
      note: "Placeholder for result, reach, or audience impact.",
      type: "image",
      src: "/images/project-01.png",
      alt: "Project placeholder one",
    },
    {
      id: "2",
      title: "Social Campaign Cut",
      category: "Short-Form / Social Media",
      note: "Space reserved for future metrics and campaign details.",
      type: "video",
      src: "/videos/project-02-placeholder.mp4",
      poster: "/images/project-02.png",
    },
    {
      id: "3",
      title: "YouTube Growth Edit",
      category: "Long-Form / Creator Content",
      note: "Ready for thumbnail, case outcome, and testimonial pairing later.",
      type: "image",
      src: "/images/project-03.png",
      alt: "Project placeholder three",
    },
  ],
};

export default function Home() {
  const [feedback, setFeedback] = useState("");
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(defaultData);

  useEffect(() => {
    // Load portfolio data from localStorage after component mounts
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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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

    // Save inquiry to localStorage
    const inquiry = {
      id: Date.now().toString(),
      clientName,
      clientPhone,
      clientEmail,
      services: selectedServices,
      projectBrief,
      isRead: false,
      createdAt: Date.now(),
    };

    const currentData = JSON.parse(localStorage.getItem("portfolioData") || "{}");
    if (!currentData.inquiries) {
      currentData.inquiries = [];
    }
    currentData.inquiries.push(inquiry);
    localStorage.setItem("portfolioData", JSON.stringify(currentData));

    // Send email to admin
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

    setFeedback("Your inquiry has been sent successfully! We'll get back to you soon.");
    event.currentTarget.reset();
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
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#work">Work</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="button button-solid" href="#contact">
          Hire Me
        </a>
      </header>

      <main>
        <section className="hero section" id="home">
          <div className="hero-copy reveal">
            <p className="eyebrow">Professional Video Editor / Creative Brand Builder</p>
            <h1>{portfolioData.heroTitle}</h1>
            <p className="lead">{portfolioData.heroDescription}</p>
            <div className="hero-actions">
              <a className="button button-solid" href="#work">
                View My Work
              </a>
              <a className="button button-ghost" href="#contact">
                Contact Me
              </a>
            </div>
            <div className="hero-meta">
              <div>
                <span>Focus</span>
                <strong>Editing / Motion / Creative Direction</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>Haramaya University IT Student, 2nd Year</strong>
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
          <span>Premium Workflow</span>
          <span>Scalable Portfolio</span>
          <span>Creative Storytelling</span>
          <span>Future Client Logos</span>
          <span>Awards / Stats Ready</span>
        </section>

        <section className="section about-grid" id="about">
          <div className="section-heading reveal">
            <p className="eyebrow">About Me</p>
            <h2>Creative identity built on story, discipline, and modern visual craft.</h2>
          </div>
          <div className="about-story reveal">
            <p>{portfolioData.aboutText}</p>
            <p>
              I&apos;m also a second year Information Technology student at Haramaya University,
              which strengthens how I think about digital presentation, clean systems, and scalable
              brand experiences for modern clients.
            </p>
            <div className="value-points">
              <article className="value-card">
                <h3>Creative Vision</h3>
                <p>Visual decisions shaped to elevate the identity behind the content.</p>
              </article>
              <article className="value-card">
                <h3>Professional Editing</h3>
                <p>Clean workflow, polished finishing, and dependable attention to detail.</p>
              </article>
              <article className="value-card">
                <h3>Story-Driven Results</h3>
                <p>Edits designed to hold attention and leave a memorable impression.</p>
              </article>
            </div>
          </div>
          <aside className="profile-card reveal">
            <div className="profile-image-wrap">
              <img src="/images/profile-placeholder.png" alt="Hamza Teha profile placeholder" />
            </div>
            <div className="profile-details">
              <p className="eyebrow">Personal Brand</p>
              <h3>Hamza Teha</h3>
              <p>Professional Video Editor / TEHA_TECH</p>
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
            <p className="eyebrow">What I Do</p>
            <h2>Flexible service blocks that can grow as the business expands.</h2>
          </div>
          <div className="service-grid">
            <article className="service-card reveal">
              <div className="service-icon">01</div>
              <h3>Video Editing</h3>
              <p>Brand videos, reels, YouTube edits, promos, and short-form storytelling.</p>
            </article>
            <article className="service-card reveal">
              <div className="service-icon">02</div>
              <h3>Web Development</h3>
              <p>Clean web presentation support for personal brands, landing pages, and showcases.</p>
            </article>
            <article className="service-card reveal">
              <div className="service-icon">03</div>
              <h3>Thumbnail Design</h3>
              <p>Attention-grabbing visual covers that increase clarity, clicks, and content appeal.</p>
            </article>
            <article className="service-card reveal">
              <div className="service-icon">04</div>
              <h3>Online Passport &amp; Tech Related</h3>
              <p>Helpful digital support for online processing and practical tech-related tasks.</p>
            </article>
          </div>
        </section>

        <section className="section work-section" id="work">
          <div className="section-heading reveal">
            <p className="eyebrow">Featured Projects</p>
            <h2>Expandable project cards with room for new edits, campaigns, and outcomes.</h2>
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
              See More Work
            </a>
          </div>
        </section>

        <section className="section case-study-layout" id="case-studies">
          <div className="section-heading reveal">
            <p className="eyebrow">Selected Case Studies</p>
            <h2>A larger content area designed for future deep project breakdowns.</h2>
          </div>
          <article className="case-study-card reveal">
            <div className="case-study-copy">
              <span className="case-tag">Future Case Study Block</span>
              <h3>Project overview, challenge, edit approach, result, and preview can live here.</h3>
              <p>
                This placeholder keeps a premium structure ready for detailed portfolio growth
                later without redesigning the full website.
              </p>
            </div>
            <div className="case-study-media" style={{ width: "100%" }}>
              <img src="/images/case-study-placeholder.png" alt="Case study placeholder" style={{ width: "100%" }} />
              <span className="media-status"></span>
            </div>
          </article>
        </section>

        <section className="section tools-layout" id="tools">
          <div className="section-heading reveal">
            <p className="eyebrow">Tools I Use</p>
            <h2>Organized skill groups that stay clean as your workflow grows.</h2>
          </div>
          <div className="tools-grid reveal">
            <div className="tool-group">
              <h3>Editing</h3>
              <div className="tool-list">
                <span>Adobe Photoshop</span>
                <span>CapCut</span>
                <span>DaVinci Resolve</span>
              </div>
            </div>
            <div className="tool-group">
              <h3>Motion</h3>
              <div className="tool-list">
                <span>After Effects</span>
                <span>Animation Basics</span>
                <span>Typography Motion</span>
              </div>
            </div>
            <div className="tool-group">
              <h3>Color &amp; Sound</h3>
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
            <p className="eyebrow">What Clients Say</p>
            <h2>Placeholder testimonial cards with space for future trust signals.</h2>
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
          <p className="eyebrow">Ready To Start</p>
          <h2>Let&apos;s Turn Your Footage Into Something People Remember.</h2>
          <p>
            Clean editing, creative support, and a polished result built to make your brand feel
            more valuable.
          </p>
          <div className="hero-actions">
            <a className="button button-solid" href="#contact">
              Start a Project
            </a>
            <a
              className="button button-ghost"
              href="https://t.me/teha_creative"
              target="_blank"
              rel="noreferrer"
            >
              Message Me
            </a>
          </div>
        </section>

        <section className="section contact-layout" id="contact">
          <div className="section-heading reveal">
            <p className="eyebrow">Contact</p>
            <h2>A clear contact panel for direct bookings and quick client requests.</h2>
          </div>
          <div className="contact-grid">
            <aside className="contact-card reveal">
              <h3>Direct Contact</h3>
              <div className="contact-points">
                <div>
                  <span>Phone</span>
                  <strong>{portfolioData.contactPhone}</strong>
                </div>
                <div>
                  <span>Email</span>
                  <strong>{portfolioData.contactEmail}</strong>
                </div>
                <div>
                  <span>Brand</span>
                  <strong>Teha Tech</strong>
                </div>
              </div>
              <p className="contact-note">
                Teha Tech is always your first choice if you need to learn and go with 
                degital world
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

            <form className="inquiry-form reveal" id="inquiry-form" onSubmit={handleSubmit}>
              <div className="form-header">
                <h3>Client Inquiry Panel</h3>
                <p>Select the services you need and leave your details.</p>
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
                  <span>Client Name</span>
                  <input type="text" name="clientName" placeholder="Your full name" required />
                </label>
                <label>
                  <span>Phone Number</span>
                  <input type="tel" name="clientPhone" placeholder="+251..." required />
                </label>
              </div>
              <label>
                <span>Email Address</span>
                <input type="email" name="clientEmail" placeholder="your@email.com" required />
              </label>
              <label>
                <span>Project Brief</span>
                <textarea
                  name="projectBrief"
                  rows={5}
                  placeholder="Share what you need, timeline, and any important details."
                />
              </label>
              <div className="form-actions">
                <button className="button button-solid" type="submit">
                  Send Inquiry
                </button>
                <p id="form-feedback" aria-live="polite">
                  {feedback}
                </p>
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div>
          <strong>Hamza Teha</strong>
          <p>Premium video editing and digital creative services under TEHA TECH company.</p>
        </div>
        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#work">Work</a>
          <a href="#contact">Contact</a>
          <a href="/admin/login" title="Admin Dashboard" style={{ fontSize: "18px" }}>
            ⚙️
          </a>
        </div>
      </footer>
    </div>
  );
}
