import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn, getSubjectColor } from "@/lib/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


interface CompanionsListProps {
  title: string;
  companions?: Companion[];
  classNames?: string;
  hideTitle?: boolean;
  emptyMessage?: string;
}

const CompanioinsList = ({ title, companions, classNames, hideTitle = false, emptyMessage = 'Start a session with a companion and it will show up here.' }: CompanionsListProps) => {
  const hasItems = !!companions && companions.length > 0

  return (
    <article className={cn('companion-list', classNames)}>
            {!hideTitle && (
                <div className="mb-4 flex items-baseline justify-between gap-4">
                    <h2 className="text-2xl font-semibold md:text-3xl">{title}</h2>
                    {hasItems && <span className="eyebrow">{companions.length} total</span>}
                </div>
            )}

            {!hasItems ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-6 py-12 text-center">
                    <p className="font-display text-xl">Nothing here yet.</p>
                    <p className="max-w-sm text-sm text-muted-foreground">{emptyMessage}</p>
                    <Link href="/companions" className="btn-ghost mt-2">Browse companions</Link>
                </div>
            ) : (
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="eyebrow w-2/3 px-0">Lesson</TableHead>
                        <TableHead className="eyebrow">Subject</TableHead>
                        <TableHead className="eyebrow pr-0 text-right">Duration</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {companions.map(({id, subject, name, topic, duration}, index) => (
                        <TableRow key={`${id}-${index}`} className="group border-border hover:bg-surface-2/60">
                            <TableCell className="px-0 py-4">
                                <Link href={`/companions/${id}`} className="flex items-center gap-4 rounded-xl">
                                    <div
                                        className="flex size-14 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:-rotate-6 max-md:hidden"
                                        style={{ backgroundColor: getSubjectColor(subject) }}
                                    >
                                        <Image src={`/icons/${subject}.svg`} alt="" width={28} height={28} />
                                    </div>
                                    <div className="flex min-w-0 flex-col gap-1">
                                        <p className="flex items-center gap-2 font-display text-xl font-semibold">
                                            <span className="truncate">{name}</span>
                                            <ArrowUpRight className="size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                                        </p>
                                        <p className="truncate text-sm text-muted-foreground">{topic}</p>
                                    </div>
                                </Link>
                            </TableCell>
                            <TableCell>
                                <span
                                    className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] tracking-widest text-ink uppercase"
                                    style={{ backgroundColor: getSubjectColor(subject) }}
                                >
                                    {subject}
                                </span>
                            </TableCell>
                            <TableCell className="pr-0 text-right text-sm text-muted-foreground">
                                {duration}<span className="max-md:hidden"> min</span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            )}
        </article>
  );
};

export default CompanioinsList;
