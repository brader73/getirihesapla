export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  imageUrl: string;
  tags: string[];
}

export const posts: BlogPost[] = [
  {
    id: "1",
    slug: "fed-faiz-karari-piyasalari-nasil-etkiler",
    title: "FED Faiz Kararı Piyasaları Nasıl Etkiler?",
    excerpt: "Amerikan Merkez Bankası'nın (FED) faiz kararlarının küresel piyasalar ve kripto paralar üzerindeki etkilerini inceliyoruz.",
    content: "## FED Faiz Kararlarının Önemi\n\nFED'in faiz artırım döngüsü, gelişen piyasalardan fon çıkışına neden olurken, sabit getirili araçlara olan talebi artırmaktadır. Kripto paralar gibi riskli varlıklar genellikle faiz artışlarından olumsuz etkilenir...\n\n### Yatırımcılar Ne Yapmalı?\n\nPortföy çeşitlendirmesi bu dönemlerde en kritik stratejidir.",
    date: "2026-05-10",
    author: "Korfu Finance Araştırma",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    tags: ["Makroekonomi", "FED", "Piyasalar"]
  },
  {
    id: "2",
    slug: "gordon-hisse-degerleme-modeli-nedir",
    title: "Gordon Hisse Değerleme Modeli Nedir ve Nasıl Kullanılır?",
    excerpt: "Temettü ödeyen şirketlerin içsel değerini hesaplamada kullanılan Gordon Büyüme Modeli'nin detaylı rehberi.",
    content: "## Gordon Büyüme Modeli (Gordon Growth Model)\n\nGordon Modeli, hisse senetlerinin içsel değerini bulmak için şirketin gelecekteki temettü ödemelerinin bugünkü değerini hesaplar. Modelin temeli, temettülerin sabit bir oranda büyüyeceği varsayımına dayanır...\n\n### Formül ve Uygulama\n\nDeğer = Beklenen Temettü / (Beklenen Getiri - Büyüme Oranı)",
    date: "2026-05-12",
    author: "Analiz Ekibi",
    imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80",
    tags: ["Hisse Senedi", "Değerleme", "Temettü"]
  },
  {
    id: "3",
    slug: "kripto-paralarda-teknik-analiz-temelleri",
    title: "Kripto Paralarda Teknik Analiz Temelleri",
    excerpt: "Kripto piyasalarında al-sat yaparken kullanabileceğiniz en temel ve etkili teknik analiz yöntemleri.",
    content: "## Teknik Analiz Neden Önemlidir?\n\nKripto piyasalarındaki yüksek volatilite, teknik analiz araçlarının kullanımını zorunlu kılmaktadır. Destek-direnç seviyeleri, hareketli ortalamalar (MA) ve RSI gibi momentum indikatörleri en çok tercih edilen araçlardır...\n\n### Trendleri Okumak\n\nTrend is your friend (Trend dostunuzdur) kuralı kripto için de geçerlidir.",
    date: "2026-05-14",
    author: "Kripto Masası",
    imageUrl: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1200&q=80",
    tags: ["Kripto", "Teknik Analiz", "Bitcoin"]
  },
  {
    id: "4",
    slug: "pasif-gelir-stratejisi-ve-bilesik-getiri",
    title: "Portföy Yönetiminde Varlık Çeşitlendirmesi ve Nakit Akışı Optimizasyonu",
    excerpt: "22 yaşında finansal özgürlük yolculuğu. Portföy yönetimi, USHY tahvil ETF'i ve bileşik getiri hesaplaması üzerine stratejiler.",
    content: "## Finansal Özgürlük ve Pasif Gelir\n\nFinansal özgürlük, elde edilen pasif gelirin yaşam masraflarını karşılayabildiği noktada başlar. 22 yaşında bu yolculuğa çıkarken, en önemli silahımız **Bileşik Getiri**'nin gücüdür.\n\n### Varlık Çeşitlendirmesi ve USHY\n\nPortföyde sadece büyüme hisseleri değil, düzenli nakit akışı sağlayan enstrümanlar da bulunmalıdır. Örneğin, USHY (iShares Broad USD High Yield Corporate Bond ETF) gibi yüksek getirili şirket tahvilleri ETF'leri, portföye aylık temettü sağlayarak nakit akışını destekler.\n\n### Uzun Vadeli Bakış\n\nBu stratejide sabır esastır. Gelen temettülerin tekrar aynı fona yatırılması, yani bileşik etkinin çalıştırılması, kartopu etkisini tetikleyerek uzun vadede devasa bir portföy yaratılmasını sağlar. Daha fazlası için kendi kişisel blogum olan [Financial Dump](https://22yasindafinansgunlugu.blogspot.com/)'ı ziyaret edebilirsiniz.",
    date: "2026-05-10",
    author: "Finans Günlüğü",
    imageUrl: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&w=1200&q=80",
    tags: ["Pasif Gelir", "Bileşik Getiri", "Finansal Özgürlük"]
  }
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
