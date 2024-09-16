import React from "react";
import Footer from "./components/footer/footer";

export default function Home() {
  return (
    <div className="grid grid-rows-[1fr_auto] min-h-screen items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] dark:bg-zinc-900">
      <div className="content flex-1"></div>
      <Footer />
    </div>
  );
}
