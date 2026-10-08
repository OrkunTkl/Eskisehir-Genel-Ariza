import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/data/sites";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/Cursor";
import { Loader } from "@/components/Loader";
import { Reveals } from "@/components/Reveals";

const title =
  "Eskişehir Genel Arıza | Su, Elektrik, Kombi ve Beyaz Eşya Arıza Yönlendirme";
const description =
  "Eskişehir'de su tesisatı, elektrik, kombi ya da beyaz eşya arızası mı var? Arıza türünü seçin, doğru yönlendirme sayfasına geçin.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "tr_TR",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = {
  themeColor: "#070708",
  width: "device-width",
  initialScale: 1,
};

const ld = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "tr-TR",
  description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem("eg-seen"))document.documentElement.classList.add("seen")}catch(e){}`,
          }}
        />
      </head>
      <body>
        <a className="skip" href="#hatlar">
          İçeriğe geç
        </a>
        <Loader />
        <SmoothScroll />
        <Reveals />
        <Cursor />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      </body>
    </html>
  );
}
