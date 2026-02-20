import { getAllPosts } from "@/lib/blog";
import { BlogList } from "./BlogList";

export default async function Blog() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen py-28 md:py-32">
      <div className="container-wide">
        <div className="mb-14 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <span className="overline">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Notes and Essays
            </span>
            <h1 className="section-title mt-6 text-balance">
              Documenting lessons from products, AI, and implementation.
            </h1>
          </div>

          <p className="section-subtitle lg:justify-self-end">
            Reflections on technical builds, tech trends and observations
          </p>
        </div>

        <BlogList posts={posts} />
      </div>
    </div>
  );
}
