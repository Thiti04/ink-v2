import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

// Import Noto Sans Thai correctly
const notoSansThai = Noto_Sans_Thai({ subsets: ["latin"], weight: ["500"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={notoSansThai.className}>
        <header className="fixed top-0 left-0 right-0 z-50 ">
          <div>
            <Nav />
          </div>
        </header>
        <main className="relative z-0 pt-[56px] min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}
