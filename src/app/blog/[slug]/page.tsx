import React from "react";
import { getPostBySlug, getAllPosts } from "@/data/posts";
import { notFound } from "next/navigation";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

// Dinamik Metadata Oluşturma (SEO İçin Çok Önemli)
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Yazı Bulunamadı | Korfu Finance",
    };
  }

  return {
    title: `${post.title} | Korfu Finance Blog`,
    description: post.excerpt,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: post.imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.imageUrl],
    },
  };
}

// Static Generation için (Build sırasında sayfaları önceden oluşturur)
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage(props: Props) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // Basit markdown-to-html dönüştürücü (gerçek projede marked.js veya next-mdx-remote kullanılır)
  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-slate-100">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-xl font-bold mt-6 mb-3 text-slate-800 dark:text-slate-200">{line.replace('### ', '')}</h3>;
      }
      if (line.trim() === '') {
        return <br key={i} />;
      }
      return <p key={i} className="mb-4 text-slate-700 dark:text-slate-300 leading-relaxed">{line}</p>;
    });
  };

  return (
    <article className="container mx-auto px-4 md:px-8 py-10 max-w-4xl">
      <header className="mb-10 text-center">
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {post.tags.map((tag) => (
            <span key={tag} className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 text-xs font-semibold px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-6 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center justify-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <span>✍️</span> {post.author}
          </span>
          <span>•</span>
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("tr-TR", { year: 'numeric', month: 'long', day: 'numeric' })}
          </time>
        </div>
      </header>

      <div className="rounded-2xl overflow-hidden mb-12 shadow-md">
        <img src={post.imageUrl} alt={post.title} className="w-full h-auto object-cover max-h-[500px]" />
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none prose-a:text-amber-600 hover:prose-a:text-amber-500 prose-img:rounded-xl">
        {renderContent(post.content)}
      </div>
    </article>
  );
}
