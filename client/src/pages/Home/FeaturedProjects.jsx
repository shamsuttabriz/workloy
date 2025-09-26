import { useState } from "react";

const sampleData = [
  {
    id: 1,
    title: "E-Commerce Replatform",
    thumb:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
    short:
      "Rebuilt an online store to increase checkout conversion by 32% and reduce page load time by 60%.",
    details:
      "We migrated the monolithic storefront to a headless stack, implemented incremental static rendering, optimized images and critical CSS, and integrated a streamlined checkout flow. The result was a better UX, faster loads, and a measurable revenue uplift.",
    tags: ["E-Commerce", "Performance", "Headless"],
    link: "https://example.com/case/ecommerce-replatform",
  },
  {
    id: 2,
    title: "Team Collaboration Platform",
    thumb:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop",
    short:
      "Built a lightweight collaboration tool that helped a small agency cut communication overhead by 45%.",
    details:
      "Delivered features like real-time commenting, task boards, and file previews. Focused on simple onboarding and role-based access which greatly reduced time-to-value for the client.",
    tags: ["Collaboration", "Realtime", "SaaS"],
    link: "https://example.com/case/collab-platform",
  },
  {
    id: 3,
    title: "Inventory Management App",
    thumb:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1200&auto=format&fit=crop",
    short:
      "Created a lightweight inventory app for local retailers — reduced stockouts by ~70%.",
    details:
      "The app included barcode scanning, alerts for low stock, and simple analytics dashboards. Offline-first design allowed continued use in low-connectivity environments.",
    tags: ["Inventory", "Mobile", "Analytics"],
    link: "https://example.com/case/inventory-app",
  },
  {
    id: 4,
    title: "On-demand Tutor Platform",
    thumb:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
    short:
      "Launched a tutor matching platform that doubled monthly active tutors within 3 months.",
    details:
      "Key wins: automated matching algorithm, secure in-platform payments, and a tutor rating system. Focus on trust & safety improved retention.",
    tags: ["Marketplace", "Payments", "Trust"],
    link: "https://example.com/case/tutor-platform",
  },
  {
    id: 5,
    title: "Local Services Directory",
    thumb:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
    short:
      "Designed a local services marketplace that helped small vendors increase leads by 3x.",
    details:
      "Features included vendor profiles, booking widgets, reviews, and SEO-first pages for local discoverability.",
    tags: ["Local", "SEO", "Marketplace"],
    link: "https://example.com/case/local-directory",
  },
  {
    id: 6,
    title: "Healthcare Appointment System",
    thumb:
      "https://railsware.com/blog/wp-content/uploads/2023/10/product-features_image.jpg",
    short:
      "Delivered a secure appointment booking system with reminders — patient no-shows dropped by 28%.",
    details:
      "Built HIPAA-aware flows, SMS/email reminders, and a doctor dashboard for slot management. Focused on privacy and reliability.",
    tags: ["Healthcare", "Security", "UX"],
    link: "https://example.com/case/healthcare-system",
  },
];

export default function FeaturedProjects() {
  const [active, setActive] = useState(null);

  const openModal = (project) => setActive(project);
  const closeModal = () => setActive(null);

  return (
    <section className="py-12 bg-[var(--color-light)]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-brand-dark)] flex items-center gap-3">
              <span className="text-3xl">🏆</span>
              Featured Projects
            </h2>
            <p className="mt-2 text-natural max-w-xl">
              Showcasing real success stories from our community — short case
              studies that highlight how teams solved real problems with
              focused, practical solutions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#all"
              className="btn btn-sm btn-outline border-[var(--color-brand)] text-[var(--color-brand)] hover:bg-[var(--color-brand-light)]/10"
            >
              View all case studies
            </a>
            <a
              href="#submit"
              className="btn btn-sm bg-[var(--color-accant)] text-white hover:bg-[var(--color-accant-dark)]"
            >
              Submit your project
            </a>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleData.map((p) => (
            <article
              key={p.id}
              className="card card-compact bg-white shadow hover:shadow-lg transition rounded-lg overflow-hidden border border-[var(--color-natural-light)]"
            >
              <figure className="h-44 md:h-48 overflow-hidden">
                <img
                  src={p.thumb}
                  alt={p.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition"
                  loading="lazy"
                />
              </figure>
              <div className="card-body p-5">
                <h3 className="text-lg font-semibold text-[var(--color-brand-dark)]">
                  {p.title}
                </h3>
                <p className="text-sm text-natural mt-2 line-clamp-3">
                  {p.short}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-1 text-xs rounded-md bg-[var(--color-brand-light)]/10 text-[var(--color-brand-dark)] border border-[var(--color-brand-light)]/20"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="card-actions mt-4 flex items-center justify-between">
                  <button
                    onClick={() => openModal(p)}
                    className="btn btn-sm bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-dark)]"
                  >
                    Read more
                  </button>

                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--color-brand)] underline hover:text-[var(--color-brand-dark)]"
                  >
                    External case study
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Modal */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          aria-modal="true"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeModal}
            aria-hidden="true"
          />
          <div className="relative bg-white rounded-xl max-w-lg sm:max-w-3xl w-full shadow-xl overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-[var(--color-brand-dark)]">
                    {active.title}
                  </h3>
                  <p className="text-sm text-[var(--color-natural-light)] mt-1">
                    Project highlights
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="btn btn-ghost btn-sm"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4">
                <img
                  src={active.thumb}
                  alt={active.title}
                  className="w-full h-56 sm:h-72 object-cover rounded-md"
                />
              </div>

              <div className="mt-4 text-natural leading-relaxed">
                <p>{active.details}</p>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {active.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-1 text-xs rounded bg-[var(--color-brand-light)]/10 text-[var(--color-brand-dark)] border border-[var(--color-brand-light)]/20"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  <a
                    href={active.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                  >
                    Read full case study
                  </a>
                  <button
                    onClick={closeModal}
                    className="btn bg-[var(--color-accant)] text-white hover:bg-[var(--color-accant-dark)]"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
