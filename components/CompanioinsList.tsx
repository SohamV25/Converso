import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn, getSubjectColor } from "@/lib/utils";


interface CompanionsListProps {
  title: string;
  companions?: Companion[];
  classNames?: string;
  hideTitle?: boolean;
  emptyMessage?: string;
}

// Shared column layout so the header lines up with the rows.
// Phones: tile | name | duration. From md up the subject column appears.
const rowGrid = "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 sm:gap-4 md:grid-cols-[3.5rem_minmax(0,1fr)_7.5rem_6rem]";

const CompanioinsList = ({ title, companions, classNames, hideTitle = false, emptyMessage = 'Start a session with a companion and it will show up here.' }: CompanionsListProps) => {
  const hasItems = !!companions && companions.length > 0

  return (
    <article className={cn('companion-list', classNames)}>
            {!hideTitle && (
                <div className="mb-4 flex items-baseline justify-between gap-4">
                    <h2 className="text-2xl font-semibold md:text-3xl">{title}</h2>
                    {hasItems && <span className="eyebrow shrink-0">{companions.length} total</span>}
                </div>
            )}

            {!hasItems ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-6 py-12 text-center">
                    <p className="font-display text-xl">Nothing here yet.</p>
                    <p className="max-w-sm text-sm text-muted-foreground">{emptyMessage}</p>
                    <Link href="/companions" className="btn-ghost mt-2">Browse companions</Link>
                </div>
            ) : (
            <div>
                <div className={cn(rowGrid, "hidden border-b border-border pb-3 md:grid")} aria-hidden>
                    <span className="eyebrow col-span-2">Lesson</span>
                    <span className="eyebrow whitespace-nowrap">Subject</span>
                    <span className="eyebrow text-right whitespace-nowrap">Duration</span>
                </div>

                <ul className="divide-y divide-border">
                    {companions.map(({id, subject, name, topic, duration}, index) => (
                        <li key={`${id}-${index}`}>
                            <Link
                                href={`/companions/${id}`}
                                className={cn(rowGrid, "group -mx-2 rounded-2xl px-2 py-4 transition-colors hover:bg-surface-2/60")}
                            >
                                <span
                                    className="flex size-11 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:-rotate-6 sm:size-14"
                                    style={{ backgroundColor: getSubjectColor(subject) }}
                                >
                                    <Image src={`/icons/${subject}.svg`} alt="" width={26} height={26} className="size-5 sm:size-7" />
                                </span>

                                <span className="flex min-w-0 flex-col gap-0.5">
                                    <span className="flex min-w-0 items-center gap-2 font-display text-lg font-semibold sm:text-xl">
                                        <span className="truncate">{name}</span>
                                        <ArrowUpRight className="size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                                    </span>
                                    <span className="truncate text-sm text-muted-foreground">{topic}</span>
                                </span>

                                <span className="hidden md:block">
                                    <span
                                        className="inline-flex rounded-full px-3 py-1 text-[11px] tracking-widest text-ink uppercase"
                                        style={{ backgroundColor: getSubjectColor(subject) }}
                                    >
                                        {subject}
                                    </span>
                                </span>

                                <span className="text-right text-sm whitespace-nowrap text-muted-foreground tabular-nums">
                                    {duration}<span className="max-md:hidden"> min</span><span className="md:hidden">m</span>
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            )}
        </article>
  );
};

export default CompanioinsList;
