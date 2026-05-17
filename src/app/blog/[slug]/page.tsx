import React from "react";
import { getPostBySlug, getAllPosts } from "@/data/posts";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";

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
    title: `${post.title} | Korfu Finance Araştırma`,
    description: post.excerpt,
    keywords: post.tags.join(", "),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      siteName: "Korfu Finance",
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
    alternates: {
      canonical: `https://www.korfufinance.com/blog/${post.slug}`,
    }
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage(props: Props) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);
  const allPosts = getAllPosts();

  if (!post) {
    notFound();
  }

  const relatedPosts = allPosts.filter(p => p.id !== post.id).slice(0, 3);

  // Basit markdown-to-html dönüştürücü
  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-3xl font-serif font-bold mt-10 mb-5 text-white border-b border-slate-800 pb-3">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-xl font-bold mt-8 mb-4 text-slate-200">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <strong key={i} className="text-white block mt-4">{line.replace(/\*\*/g, '')}</strong>;
      }
      if (line.trim() === '') {
        return <br key={i} />;
      }
      return <p key={i} className="mb-5 text-slate-300 leading-relaxed text-lg">{line.replace(/\*\*/g, '')}</p>;
    });
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "image": [post.imageUrl],
    "datePublished": post.date,
    "dateModified": post.date,
    "author": [{
        "@type": "Organization",
        "name": post.author,
        "url": "https://www.korfufinance.com/about"
      }]
  };

  return (
    <div className="bg-[#020617] min-h-screen pb-20">
      {/* Schema Markup */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <article className="container mx-auto px-4 md:px-8 pt-10 pb-20 max-w-4xl">
        
        {/* Breadcrumb */}
        <nav className="flex text-xs text-slate-500 font-medium mb-8 uppercase tracking-widest">
          <Link href="/" className="hover:text-indigo-400 transition-colors">Ana Sayfa</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-indigo-400 transition-colors">Araştırma</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-300">{post.title.substring(0, 30)}...</span>
        </nav>

        <header className="mb-10 text-center">
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {post.tags.map((tag) => (
              <span key={tag} className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-slate-400 border-y border-slate-800 py-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white border border-slate-700">
                {post.author.charAt(0)}
              </div>
              <span className="text-slate-200">{post.author}</span>
            </div>
            <div className="hidden md:block w-1 h-1 rounded-full bg-slate-700"></div>
            <time dateTime={post.date} className="flex items-center gap-2">
              📅 {new Date(post.date).toLocaleDateString("tr-TR", { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
            <div className="hidden md:block w-1 h-1 rounded-full bg-slate-700"></div>
            <span className="flex items-center gap-2">⏱️ 5 dk okuma süresi</span>
          </div>
        </header>

        {/* Featured Image */}
        <div className="rounded-3xl overflow-hidden mb-12 shadow-[0_0_40px_rgba(79,70,229,0.15)] border border-slate-800">
          <img src={post.imageUrl} alt={post.title} className="w-full h-auto object-cover max-h-[500px]" />
        </div>

        {/* Content & Sidebar Wrapper */}
        <div className="flex flex-col md:flex-row gap-10">
          
          {/* Social Share (Sticky Left) */}
          <div className="hidden md:flex flex-col gap-4 w-12 shrink-0 pt-4">
            <div className="sticky top-24 flex flex-col gap-3">
              <button className="w-10 h-10 rounded-full bg-slate-800 hover:bg-[#1DA1F2] hover:text-white text-slate-400 flex items-center justify-center transition-all border border-slate-700 hover:border-transparent">𝕏</button>
              <button className="w-10 h-10 rounded-full bg-slate-800 hover:bg-[#0A66C2] hover:text-white text-slate-400 flex items-center justify-center transition-all border border-slate-700 hover:border-transparent">in</button>
              <button className="w-10 h-10 rounded-full bg-slate-800 hover:bg-[#25D366] hover:text-white text-slate-400 flex items-center justify-center transition-all border border-slate-700 hover:border-transparent">W</button>
              <div className="w-full h-[1px] bg-slate-800 my-2"></div>
              <button className="w-10 h-10 rounded-full bg-slate-800 hover:text-white text-slate-400 flex items-center justify-center transition-all border border-slate-700 hover:border-transparent" title="Linki Kopyala">🔗</button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 prose prose-lg dark:prose-invert max-w-none prose-a:text-indigo-400 hover:prose-a:text-indigo-300 font-sans">
            <p className="text-xl text-slate-400 font-medium leading-relaxed mb-8 border-l-4 border-indigo-500 pl-6 italic">
              {post.excerpt}
            </p>
            {renderContent(post.content)}
          </div>
        </div>

        {/* Comments Section Mock */}
        <div className="mt-20 pt-10 border-t border-slate-800">
          <h3 className="text-2xl font-serif font-bold text-white mb-8">Yorumlar (0)</h3>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <textarea 
              placeholder="Analiz hakkında görüşlerinizi paylaşın..." 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 mb-4 h-32"
            ></textarea>
            <div className="flex justify-end">
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all">
                Yorum Yap
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      <div className="bg-slate-900 border-t border-slate-800 py-20">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-3xl font-serif font-bold text-white">İlgili Analizler</h2>
            <Link href="/blog" className="text-indigo-400 hover:text-indigo-300 font-medium">Tümünü Gör →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map(rp => (
              <Link href={`/blog/${rp.slug}`} key={rp.id} className="group flex h-full">
                <article className="bg-[#020617] border border-slate-800 rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:border-indigo-500/30 w-full flex flex-col">
                  <div className="h-40 overflow-hidden">
                    <img src={rp.imageUrl} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors line-clamp-2">{rp.title}</h3>
                    <p className="text-sm text-slate-400 line-clamp-2">{rp.excerpt}</p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
