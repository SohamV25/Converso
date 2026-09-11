import CompanionComponent from "@/components/CompanionComponent";
import { getCompanion } from "@/lib/actions/companion.actions";
import { getSubjectColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import React from "react";

interface CompanionSessionPageProps {
  params: Promise<{ id: string }>;
}

const CompanionSession = async ({ params }: CompanionSessionPageProps) => {
  const { id } = await params;
  const companion = await getCompanion(id);
  const user = await currentUser();
  const { name, subject, topic, duration } = companion;

  if (!user) redirect("/sign-in");

  if (!name) redirect("/companions");

  return (
    <main className="gap-6">
      <Link href="/companions" className="flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden /> Back to library
      </Link>

      <article className="flex items-center justify-between gap-4 rounded-[24px] border border-border bg-surface p-4 sm:rounded-[28px] sm:p-5 md:gap-6 md:p-6 max-md:flex-col max-md:items-start">
        <div className="flex min-w-0 items-center gap-4">
          <div
            className="flex size-16 shrink-0 items-center justify-center rounded-2xl max-md:hidden"
            style={{ backgroundColor: getSubjectColor(subject) }}
          >
            <Image
              src={`/icons/${subject}.svg`}
              height={32}
              width={32}
              alt={subject}
            />
          </div>

          <div className="flex min-w-0 flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl md:text-3xl">{name}</h1>
              <span
                className="rounded-full px-3 py-1 text-[11px] tracking-widest text-ink uppercase max-sm:hidden"
                style={{ backgroundColor: getSubjectColor(subject) }}
              >
                {subject}
              </span>
            </div>
            <p className="text-muted-foreground">{topic}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-surface-2 px-4 py-2 text-sm text-muted-foreground">
          <Clock className="size-4" aria-hidden /> {duration} min session
        </div>
      </article>

      <CompanionComponent
        {... companion}
        companionId = {id}
        userName = {user.firstName!}
        userImage={user.imageUrl!}
      />
    </main>
  );
};

export default CompanionSession;
