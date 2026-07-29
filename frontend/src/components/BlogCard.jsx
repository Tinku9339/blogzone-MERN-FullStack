import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { formatDate, readingTime } from "../utils/constants.js";
import CategoryTag from "./CategoryTag.jsx";

export default function BlogCard({ blog, featured = false }) {
  return (
    <Link
      to={`/blog/${blog._id}`}
      className={`dog-ear card-paper group flex h-full flex-col overflow-hidden ${
        featured ? "sm:flex-row" : ""
      }`}
    >
      <div
        className={`overflow-hidden bg-paper-dim ${
          featured ? "sm:w-1/2" : "aspect-[16/10] w-full"
        }`}
      >
        <img
          src={blog.image}
          alt={blog.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <div
        className={`flex flex-1 flex-col gap-3 p-5 ${featured ? "sm:w-1/2 sm:p-8" : ""}`}
      >
        <div className="flex items-center gap-3">
          <CategoryTag>{blog.category}</CategoryTag>
          <span className="font-mono text-[11px] text-ink/50">
            {formatDate(blog.createdAt)}
          </span>
        </div>
        <h3
          className={`blog-card-title font-display font-semibold leading-snug text-ink ${
            featured ? "text-2xl sm:text-3xl" : "text-xl"
          }`}
        >
          {blog.title}
        </h3>
        <p
          className={` blog-card-description text-ink/70 ${featured ? "text-[15px]" : "text-sm"} line-clamp-3`}
        >
          {blog.description
            ?.replace(/<[^>]*>/g, " ")
            .replace(/&nbsp;/g, " ")
            .replace(/\s+/g, " ")
            .trim()}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/50">
            {readingTime(blog.description)}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-ink/80 transition-colors group-hover:text-rust">
            Read
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
