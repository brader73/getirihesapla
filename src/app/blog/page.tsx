import React from "react";
import Link from "next/link";
import { getAllPosts } from "@/data/posts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Korfu Finance",
  description: "Finans, kripto ve ekonomi dünyasından en güncel analizler, rehberler ve piyasa yorumları.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="container mx-auto px-4 md:px-8 py-10">
      <div className="mb-12">
        <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-white mb-4">
          Korfu Finance <span className="text-amber-600">Blog</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Piyasa analizleri, yatırım stratejileri ve finansal rehberler.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.id} className="group">
            <article className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:border-amber-500/50 flex flex-col h-full">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="bg-amber-600/90 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <time className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                  {new Date(post.date).toLocaleDateString("tr-TR", { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 group-hover:text-amber-600 transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 flex-1">
                  {post.excerpt}
                </p>
                <div className="text-sm font-semibold text-amber-600 flex items-center gap-1">
                  Yazıyı Oku <span className="text-lg leading-none transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
