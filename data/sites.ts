export type Feature = { t: string; d: string };
export type Site = {
  slug: string;
  no: string;
  title: string;
  kicker: string;
  desc: string;
  chip: string;
  url: string;
  accent: string;
  /** Aksan rengi üzerindeki yazı rengi */
  on: string;
  /** Kart (WebGL şerit) görseli */
  image: string;
  /** Pencerede gösterilen görseller */
  images: string[];
  /**
   * VİDEO İÇİN: public/videos/ içine mp4'ü koyun ve burayı doldurun, örn. "/videos/su.mp4".
   * Doldurulunca pencerede ilk sırada video oynar; görseller küçük resim olarak kalır.
   */
  video?: string;
  features: Feature[];
};

const imgs = (s: string) => [1, 2, 3, 4].map((i) => `/sites/${s}/${i}.webp`);

export const sites: Site[] = [
  {
    slug: "su-tesisati",
    no: "01",
    title: "Su tesisatı",
    kicker: "Kaçak · Gider · Musluk · Hidrofor",
    desc: "Su kaçağı, tıkalı gider, damlayan musluk, hidrofor. Önce güvenli ilk adımlar, sonra tek mesajla tesisatçıya yönlendirme.",
    chip: "Su kaçağı var",
    url: "https://eskisehir-su-tesisati.vercel.app/",
    accent: "#36dcff",
    on: "#04100f",
    image: "/sites/su/1.webp",
    images: imgs("su"),
    features: [
      { t: "Arıza merkezi", d: "Boru patladı, tavandan su damlıyor gibi 12 arıza için adım adım rehber." },
      { t: "Su kaçağı hesaplayıcı", d: "Damlayan musluğun ay sonunda ne kadar su ettiğini canlı gösterir." },
      { t: "8 hizmet sayfası", d: "Kaçak tespiti, gider açma, batarya, klozet, hidrofor, vana ve daha fazlası." },
      { t: "14 ilçeye yönlendirme", d: "Tepebaşı'ndan Sivrihisar'a ilçeye göre servis eşleştirme." },
      { t: "Tek mesaj", d: "Telefon ya da WhatsApp ile hazır mesajla geri arama." },
    ],
  },
  {
    slug: "elektrik",
    no: "02",
    title: "Elektrik",
    kicker: "Sigorta · Priz · Kaçak akım · Avize",
    desc: "Sigorta atıyor, priz ısınıyor, kaçak akım şüphesi var. Aciliyet seviyesini görün, sonra uygun elektrikçiye ulaşın.",
    chip: "Sigorta atıyor",
    url: "https://eskisehir-elektrik-tamir.vercel.app/",
    accent: "#d7ff1f",
    on: "#0a0a0b",
    image: "/sites/elektrik/1.webp",
    images: imgs("elektrik"),
    features: [
      { t: "Etkileşimli sigorta panosu", d: "Şalteri indirin, belirtinin özetini ve güvenli ilk adımı görün." },
      { t: "“Ne oldu?” arıza seçici", d: "Sürükle-bırak kartlarla sorunu seçip rehbere geçin." },
      { t: "Aciliyet etiketleri", d: "Acil, dikkat, bilgi: her arıza için net önem derecesi." },
      { t: "9 hizmet sayfası", d: "Acil elektrikçi, kaçak akım rölesi, tesisat, avize montajı ve daha fazlası." },
      { t: "Yorum ve deneyim paylaşımı", d: "Kullanıcı deneyimlerini okuyun, kendi deneyiminizi paylaşın." },
    ],
  },
  {
    slug: "kombi",
    no: "03",
    title: "Kombi & ısıtma",
    kicker: "Arıza · Bakım · Montaj · Petek",
    desc: "Kombi ısıtmıyor, hata veriyor, ateş almıyor. Neyi deneyebileceğinizi görün, gerekirse ustaya yönlendirilin.",
    chip: "Kombi ısıtmıyor",
    url: "https://eskisehir-kombi-tamir.vercel.app/",
    accent: "#ff5b14",
    on: "#060d22",
    image: "/sites/kombi/1.webp",
    images: imgs("kombi"),
    features: [
      { t: "Kombi manometresi", d: "Göstergedeki basıncı ayarlayın, ne anlama geldiğini anlayın." },
      { t: "Belirti seçici", d: "Hata kodu, su damlatma, ses, ateş almama: belirtiye göre rehber." },
      { t: "Gaz kokusu uyarısı", d: "Acil durumda ilk yapılacaklar en başta, net şekilde." },
      { t: "8 hizmet, 12 arıza rehberi", d: "Bakım, montaj, parça değişimi, petek temizliği, termostat ve şofben." },
      { t: "Yorumlar", d: "Yönlendirilen kullanıcıların deneyimleri." },
    ],
  },
  {
    slug: "beyaz-esya",
    no: "04",
    title: "Beyaz eşya",
    kicker: "Çamaşır · Bulaşık · Buzdolabı · Fırın",
    desc: "Çamaşır, bulaşık, buzdolabı, fırın ve kurutma makinesi. Cihazı ve arızayı seçin, doğru ustaya yönlendirin.",
    chip: "Makine su almıyor",
    url: "https://eskisehir-beyaz-esya-tamir.vercel.app/",
    accent: "#1fe0c4",
    on: "#14171a",
    image: "/sites/beyaz/1.webp",
    images: imgs("beyaz"),
    features: [
      { t: "5 cihaz, tek arıza seçici", d: "Cihazı seçin, en sık arızalarını ve ilk kontrolleri görün." },
      { t: "Tamir mi, yeni mi?", d: "Tamir bedeli ve cihaz yaşıyla karar veren hesaplayıcı." },
      { t: "13 arıza rehberi", d: "Su almıyor, sıkma yapmıyor, soğutmuyor gibi ayrıntılı sayfalar." },
      { t: "Parçacık sahnesi", d: "Sayfa boyunca akan, fareye tepki veren 3B parçacık animasyonu." },
      { t: "Geri arama formu", d: "WhatsApp'a hazır mesajla usta eşleştirme." },
    ],
  },
];

export const SITE_NAME = "Eskişehir Genel Arıza";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://eskisehir-genel-ariza.vercel.app").replace(/\/+$/, "");
