# Eskişehir Genel Arıza

Su tesisatı, elektrik, kombi ve beyaz eşya sitelerine yönlendiren genel arıza sitesi.
Next.js 15 · React 19 · three.js (WebGL dalga şeridi) · Lenis.

## Çalıştırma
```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```
Vercel'e doğrudan yüklenir. İsteğe bağlı: `NEXT_PUBLIC_SITE_URL` (bkz. `.env.example`).

## İçeriği değiştirme: tek dosya → `data/sites.ts`
Her hat için başlık, açıklama, link, renk, görseller ve "işlevler" listesi burada.

### Video ekleme
1. mp4 dosyasını `public/videos/` içine koyun (örn. `su.mp4`).
2. `data/sites.ts` içinde ilgili sitenin `video` alanını doldurun: `video: "/videos/su.mp4"`
3. Pencerede video ilk sırada oynar, görseller küçük resim olarak kalır.

### Görselleri değiştirme
`public/sites/<site>/1..4.webp` dosyalarını (16:10, ~1440×900 önerilir) aynı adla değiştirin.
Kart görseli `image` alanıdır (varsayılan `1.webp`).

## Yapı
- `components/Wave.tsx` — WebGL dalga şeridi + pencere yönetimi (#hash ile paylaşılabilir: `/#elektrik`)
- `components/SiteWindow.tsx` — karttan genişleyen geniş pencere (Esc, ok tuşları, geri tuşu)
- `components/Hero.tsx` — açılış ve hızlı arıza seçimi
