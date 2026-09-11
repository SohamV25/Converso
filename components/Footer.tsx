import Link from "next/link";
import Logo from "@/components/Logo";
import { ArrowUpRight } from "lucide-react";
import { subjects } from "@/constants";
import { getSubjectColor } from "@/lib/utils";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Companion library", href: "/companions" },
      { label: "Build a companion", href: "/companions/new" },
      { label: "Pricing", href: "/subscription" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "My journey", href: "/my-journey" },
      { label: "Sign in", href: "/sign-in" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="relative mt-10 overflow-hidden border-t border-border bg-surface/40">
      <div className="mx-auto grid max-w-[1320px] grid-cols-2 gap-x-6 gap-y-10 px-5 pt-14 pb-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] md:gap-12 md:px-10 md:pt-16">
        <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Converso home">
            <Logo />
            <span className="font-display text-2xl font-semibold tracking-tight">Converso</span>
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Voice-first AI tutors that talk you through any topic — patiently, and at your pace.
          </p>
          <Link href="/companions/new" className="btn-primary mt-2 w-fit">
            Start learning <ArrowUpRight className="size-4" />
          </Link>
        </div>

        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title} className="flex flex-col gap-3">
            <p className="eyebrow">{col.title}</p>
            {col.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="w-fit text-sm text-foreground/80 transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ))}

        <div className="col-span-2 flex flex-col gap-3 md:col-span-1">
          <p className="eyebrow">Subjects</p>
          <ul className="flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <li key={subject}>
                <Link
                  href={`/companions?subject=${subject}`}
                  className="flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs capitalize text-foreground/80 transition-colors hover:border-cream/30 hover:text-foreground"
                >
                  <span className="size-2 rounded-full" style={{ backgroundColor: getSubjectColor(subject) }} />
                  {subject}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1320px] flex-col items-start justify-between gap-2 border-t border-border px-5 py-6 sm:px-6 text-xs text-muted-foreground md:flex-row md:items-center md:px-10">
        <p>© {new Date().getFullYear()} Converso. Made for curious minds.</p>
        <p className="tracking-widest uppercase">Learn out loud</p>
      </div>

      {/* Oversized outlined wordmark — sized in vw so it always fits edge to edge */}
      <div aria-hidden className="pointer-events-none px-4 pb-[0.12em] text-[20vw] select-none md:px-8">
        <p className="text-stroke text-center font-display leading-none font-bold tracking-tighter whitespace-nowrap">
          Converso
        </p>
      </div>
    </footer>
  );
};

export default Footer;
