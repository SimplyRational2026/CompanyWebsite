import Link from "next/link";
import type { ReactNode } from "react";

export default function LegalPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <Link
          href="/"
          className="mb-10 inline-block text-sm text-black/60 underline underline-offset-4 transition-colors hover:text-black"
        >
          ← Zurück zur Startseite
        </Link>

        <h1 className="mb-10 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {title}
        </h1>

        <div
          className="text-[15px] leading-relaxed text-black [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:mb-1 [&_h3]:font-semibold [&_p]:mt-3 [&_p:first-child]:mt-0 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6"
        >
          {children}
        </div>
      </div>
    </main>
  );
}
