import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getUserCompanions,
  getUserSessions,
  getBookmarkedCompanions,
} from "@/lib/actions/companion.actions";
import Image from "next/image";
import Link from "next/link";
import { Bookmark, GraduationCap, Plus, CircleCheckBig } from "lucide-react";
import CompanionsList from "@/components/CompanioinsList";

const Profile = async () => {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const companions = await getUserCompanions(user.id);
  const sessionHistory = await getUserSessions(user.id);
  const bookmarkedCompanions = await getBookmarkedCompanions(user.id);

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const stats = [
    { label: "Lessons completed", value: sessionHistory.length, icon: CircleCheckBig, tint: "text-sage" },
    { label: "Companions created", value: companions.length, icon: GraduationCap, tint: "text-primary" },
    { label: "Bookmarked", value: bookmarkedCompanions.length, icon: Bookmark, tint: "text-mustard" },
  ];

  const sections = [
    { value: "bookmarks", title: "Bookmarked companions", count: bookmarkedCompanions.length, companions: bookmarkedCompanions, empty: "Tap the bookmark on any companion card to keep it here." },
    { value: "recent", title: "Recent sessions", count: sessionHistory.length, companions: sessionHistory, empty: "Start a session with a companion and it will show up here." },
    { value: "companions", title: "My companions", count: companions.length, companions, empty: "Companions you build will be listed here." },
  ];

  return (
    <main className="max-w-[1100px]">
      <section className="relative overflow-hidden rounded-[28px] border border-border bg-surface p-5 sm:rounded-[32px] sm:p-6 md:p-10">
        <div aria-hidden className="graph-paper absolute inset-0 [mask-image:linear-gradient(to_right,transparent,black)]" />
        <div aria-hidden className="absolute -top-24 -left-24 size-72 rounded-full bg-mint/20 blur-3xl" />

        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div className="flex min-w-0 items-center gap-4 sm:gap-5">
            <Image
              src={user.imageUrl}
              alt={user.firstName ?? "Your avatar"}
              width={96}
              height={96}
              className="size-16 shrink-0 rounded-2xl ring-4 ring-surface-2 sm:size-24 sm:rounded-3xl"
            />
            <div className="flex min-w-0 flex-col gap-1.5">
              <p className="eyebrow">My journey</p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-sm text-muted-foreground [overflow-wrap:anywhere]">
                {user.emailAddresses[0]?.emailAddress}
                <span className="max-sm:block"><span className="max-sm:hidden"> · </span>Learning since {memberSince}</span>
              </p>
            </div>
          </div>
          <Link href="/companions/new" className="btn-primary w-full justify-center sm:w-auto">
            <Plus className="size-4" aria-hidden /> New companion
          </Link>
        </div>

        <dl className="relative mt-6 grid grid-cols-3 gap-2 sm:mt-8 sm:gap-3">
          {stats.map(({ label, value, icon: Icon, tint }) => (
            <div key={label} className="flex min-w-0 flex-col items-start gap-2 rounded-2xl border border-border bg-surface-2/70 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-ink sm:size-11">
                <Icon className={`size-5 ${tint}`} aria-hidden />
              </span>
              <div className="min-w-0">
                <dd className="font-display text-2xl leading-none font-semibold sm:text-3xl">{value}</dd>
                <dt className="mt-1 text-xs leading-snug text-muted-foreground sm:text-sm">{label}</dt>
              </div>
            </div>
          ))}
        </dl>
      </section>

      <Accordion multiple defaultValue={["recent"]} className="flex flex-col gap-4">
        {sections.map((section) => (
          <AccordionItem
            key={section.value}
            value={section.value}
            className="rounded-[24px] border border-border bg-surface px-4 not-last:border-b sm:rounded-[28px] sm:px-6 md:px-8"
          >
            <AccordionTrigger className="py-5 hover:no-underline sm:py-6">
              <span className="flex min-w-0 items-center gap-3 font-display text-lg font-semibold sm:text-xl md:text-2xl">
                {section.title}
                <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs text-muted-foreground">{section.count}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              <CompanionsList
                title={section.title}
                companions={section.companions}
                hideTitle
                emptyMessage={section.empty}
                classNames="border-0 bg-transparent p-0 md:p-0"
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
};
export default Profile;
