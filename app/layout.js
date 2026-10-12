import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const heading = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const body = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata = {
  title: "FORMALIS - Forum Komunikasi Mahasiswa LIPIA se-Sulawesi",
  description:
    "Website resmi FORMALIS, Forum Komunikasi Mahasiswa LIPIA se-Sulawesi.",
  icons: {
    icon: "/logo-formalis.jpg",
    apple: "/logo-formalis.jpg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${heading.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
