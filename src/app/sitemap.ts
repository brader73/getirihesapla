import { MetadataRoute } from 'next';
import { getAllPosts } from '@/data/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.korfufinance.com'; // Değiştirilmesi gereken canlı domain adresi
  
  // Statik sayfalar
  const routes = [
    '',
    '/blog',
    '/portfolio',
    '/settings',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dinamik blog yazıları
  const posts = getAllPosts();
  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date).toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...routes, ...postRoutes];
}
