import { useState } from "react";

// Sample blog data
const blogPosts = [
  {
    id: 1,
    title: "React Performance Optimization Tips",
    category: "React",
    date: "2025-08-20",
    excerpt:
      "Learn how to optimize your React apps for performance: lazy loading, memoization, and code splitting.",
  },
  {
    id: 2,
    title: "Effective Career Advice for Developers",
    category: "Career",
    date: "2025-08-15",
    excerpt:
      "Discover actionable tips to grow your career as a developer, from building strong portfolios to networking.",
  },
  {
    id: 3,
    title: "Productivity Hacks for Developers",
    category: "Productivity",
    date: "2025-08-10",
    excerpt:
      "Maximize your coding efficiency using time management, automation, and the right tools.",
  },
  {
    id: 4,
    title: "Understanding React Hooks Deeply",
    category: "React",
    date: "2025-08-05",
    excerpt:
      "A deep dive into React Hooks, including useEffect, useMemo, custom hooks, and best practices.",
  },
  {
    id: 5,
    title: "How to Write Clean Code",
    category: "Productivity",
    date: "2025-08-01",
    excerpt:
      "Clean code is essential for maintainability. Learn principles, naming conventions, and structure tips.",
  },
  {
    id: 6,
    title: "Preparing for Tech Interviews",
    category: "Career",
    date: "2025-07-28",
    excerpt:
      "Step-by-step guide to prepare for coding interviews, system design, and behavioral questions.",
  },
];

export default function DeveloperResources() {
  const [filter, setFilter] = useState("All");

  const categories = ["All", "React", "Career", "Productivity"];

  const filteredPosts =
    filter === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.category === filter);

  return (
    <section className="py-12 mt-10 mb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-brand-dark)]">
            <p className="mb-2">📚</p>
            <p>Developer Resources</p>
          </h2>
          <p className="mt-2 text-natural max-w-2xl mx-auto">
            Explore helpful blogs, guides, and tips for developers. Stay updated
            and boost your skills with Workloy resources.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg border font-medium transition ${
                filter === cat
                  ? "bg-[var(--color-accant)] text-white border-[var(--color-accant-dark)]"
                  : "bg-white text-[var(--color-natural-dark)] border-[var(--color-natural-light)] hover:bg-[var(--color-brand-light)]/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-[var(--color-natural-light)] rounded-xl shadow hover:shadow-lg transition p-5 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-brand-dark)]">
                  {post.title}
                </h3>
                <p className="text-sm text-[var(--color-natural)] mt-2 line-clamp-3">
                  {post.excerpt}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-[var(--color-natural-light)] text-sm">
                <span>{post.category}</span>
                <span>{post.date}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <p className="text-center text-[var(--color-natural-light)] mt-6">
            No posts found in this category.
          </p>
        )}
      </div>
    </section>
  );
}
