import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CompanionCard from "@/components/CompanionCard";
import CompanionsList from "@/components/CompanioinsList";
import CTA from "@/components/CTA";
import Reveal from "@/components/Reveal";
import Waveform from "@/components/Waveform";
import HeroCanvas from "@/components/landing/HeroCanvas";
import SubjectMarquee from "@/components/landing/SubjectMarquee";
import HowItWorks from "@/components/landing/HowItWorks";
import Manifesto from "@/components/landing/Manifesto";
import SpinBadge from "@/components/landing/SpinBadge";
import ClosingCTA from "@/components/landing/ClosingCTA";
import {getAllCompanions, getRecentSessions} from "@/lib/actions/companion.actions";
import {getSubjectColor} from "@/lib/utils";

const stats = [
    { value: "06", label: "subjects" },
    { value: "04", label: "voice styles" },
    { value: "00", label: "typing needed" },
]

const Page = async () => {
    const companions = await getAllCompanions({ limit: 3 });
    const recentSessionsCompanions = await getRecentSessions(10);

  return (
    <main className="max-w-none gap-0 px-0 pt-0 pb-0 md:px-0">
        {/* ---------------- Hero ---------------- */}
        <section className="relative overflow-hidden">
            <div aria-hidden className="graph-paper absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_60%_40%,black,transparent)]" />

            <div className="relative mx-auto grid max-w-[1320px] items-center gap-4 px-6 pt-12 pb-16 md:px-10 lg:grid-cols-[1.05fr_1fr] lg:pt-20">
                <div className="flex flex-col items-start gap-7">
                    <p className="eyebrow flex animate-rise items-center gap-3">
                        <span className="size-1.5 animate-pulse rounded-full bg-primary" />
                        Real-time AI voice tutors
                    </p>

                    <h1 className="animate-rise text-[clamp(3.2rem,8vw,6.75rem)] leading-[0.9] [animation-delay:80ms]">
                        Learn it<br />
                        <span className="display-italic text-primary">out loud.</span>
                    </h1>

                    <p className="max-w-lg animate-rise text-lg leading-relaxed text-muted-foreground [animation-delay:160ms]">
                        Build a tutor for any topic — choose the subject, the voice and the vibe — then just talk.
                        It explains, asks you questions back, and keeps a transcript of every session.
                    </p>

                    <div className="flex animate-rise flex-wrap gap-3 [animation-delay:240ms]">
                        <Link href="/companions/new" className="btn-primary group px-6 py-3 text-base">
                            Build your companion
                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                        </Link>
                        <Link href="/companions" className="btn-ghost px-6 py-3 text-base">
                            Browse the library
                        </Link>
                    </div>

                    <dl className="mt-2 grid w-full max-w-md animate-rise grid-cols-3 gap-6 border-t border-border pt-6 [animation-delay:320ms]">
                        {stats.map(({ value, label }) => (
                            <div key={label} className="flex flex-col gap-1">
                                <dt className="sr-only">{label}</dt>
                                <dd className="font-display text-3xl font-semibold">{value}</dd>
                                <dd className="eyebrow" aria-hidden>{label}</dd>
                            </div>
                        ))}
                    </dl>
                </div>

                <div className="relative mx-auto w-full max-w-[640px] animate-rise [animation-delay:200ms]">
                    <HeroCanvas />

                    <SpinBadge className="absolute top-[4%] left-[-2%] hidden lg:block" />

                    {/* Floating status chips */}
                    <div className="absolute bottom-[12%] left-0 flex items-center gap-3 rounded-2xl border border-border bg-surface/80 px-4 py-3 shadow-2xl backdrop-blur-md md:left-[2%]" aria-hidden>
                        <span className="relative flex size-2.5">
                            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-70" />
                            <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
                        </span>
                        <span className="text-sm font-medium">Listening…</span>
                        <Waveform count={9} className="h-6" />
                    </div>
                    <div className="absolute top-[10%] right-0 flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-2 text-sm shadow-2xl backdrop-blur-md md:right-[4%]" aria-hidden>
                        <span className="size-2 rounded-full" style={{ backgroundColor: getSubjectColor("maths") }} />
                        <span className="text-muted-foreground">Topic:</span> Derivatives
                    </div>
                </div>
            </div>
        </section>

        <SubjectMarquee />

        <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-28 px-6 py-24 md:px-10">
            {/* ---------------- Popular companions ---------------- */}
            <section aria-labelledby="popular-heading" className="flex flex-col gap-10">
                <Reveal className="flex flex-wrap items-end justify-between gap-6">
                    <div className="flex flex-col gap-4">
                        <p className="eyebrow">(01) Popular now</p>
                        <h2 id="popular-heading" className="max-w-2xl text-4xl font-semibold md:text-6xl">
                            Companions people <span className="display-italic text-mustard">keep coming back to.</span>
                        </h2>
                    </div>
                    <Link href="/companions" className="btn-ghost group">
                        View all companions
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                    </Link>
                </Reveal>

                {companions.length > 0 ? (
                    <div className="companions-grid">
                        {companions.map((companion, i) => (
                            <Reveal key={companion.id} delay={i * 0.08}>
                                <CompanionCard
                                    {...companion}
                                    color={getSubjectColor(companion.subject)}
                                />
                            </Reveal>
                        ))}
                    </div>
                ) : (
                    <div className="panel flex flex-col items-center gap-3 px-6 py-16 text-center">
                        <p className="font-display text-2xl">No companions yet.</p>
                        <p className="text-muted-foreground">Be the first — build one in under a minute.</p>
                        <Link href="/companions/new" className="btn-primary mt-2">Build a companion</Link>
                    </div>
                )}
            </section>

            <Manifesto />

            <HowItWorks />

            {/* ---------------- Recent sessions + CTA ---------------- */}
            <section aria-label="Recent sessions" className="flex flex-col gap-6">
                <p className="eyebrow">(04) From the community</p>
                <div className="home-section">
                    <Reveal className="lg:w-[62%]">
                        <CompanionsList
                            title="Recently completed sessions"
                            companions={recentSessionsCompanions}
                            classNames="h-full"
                        />
                    </Reveal>
                    <CTA />
                </div>
            </section>

            <ClosingCTA />
        </div>
    </main>
  )
}

export default Page
