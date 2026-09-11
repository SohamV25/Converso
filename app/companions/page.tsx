import Link from "next/link";
import { Plus, SearchX } from "lucide-react";
import CompanionCard from "@/components/CompanionCard";
import Searchinput from "@/components/Searchinput";
import SubjectFilter from "@/components/SubjectFilter";
import { getAllCompanions } from "@/lib/actions/companion.actions";
import { getSubjectColor } from "@/lib/utils";

const CompanionsLibrary = async({searchParams} : SearchParams) => {

  const filters= await searchParams;
  const subject = filters.subject ? filters.subject : ''
  const topic = filters.topic ? filters.topic : ''

  const companions = await getAllCompanions({subject, topic});
  const isFiltered = Boolean(subject || topic)

  return (
    <main>
      <section className="relative flex flex-col gap-6 overflow-hidden rounded-[28px] border border-border bg-surface px-5 py-8 sm:gap-8 sm:rounded-[32px] sm:px-6 sm:py-10 md:px-10 md:py-14">
        <div aria-hidden className="graph-paper absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div aria-hidden className="absolute -top-32 right-0 size-80 rounded-full bg-mint/20 blur-3xl" />

        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <p className="eyebrow">The library</p>
            <h1 className="max-w-2xl">
              Every companion, <span className="display-italic text-primary">one conversation away.</span>
            </h1>
          </div>
          <Link href="/companions/new" className="btn-primary w-full justify-center sm:w-auto">
            <Plus className="size-4" aria-hidden /> New companion
          </Link>
        </div>

        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center">
          <Searchinput/>
          <SubjectFilter/>
          <p className="eyebrow sm:ml-auto" aria-live="polite">
            {companions.length} {companions.length === 1 ? 'companion' : 'companions'}
          </p>
        </div>
      </section>

      {companions.length > 0 ? (
        <section className="companions-grid">
          {companions.map((companion, i) => (
            <div key={companion.id} className="animate-rise" style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}>
              <CompanionCard {...companion} color={getSubjectColor(companion.subject)}/>
            </div>
          ))}
        </section>
      ) : (
        <section className="panel flex flex-col items-center gap-4 px-6 py-20 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-surface-2">
            <SearchX className="size-6 text-muted-foreground" aria-hidden />
          </span>
          <p className="font-display text-2xl">
            {isFiltered ? 'No companions match that search.' : 'The library is empty.'}
          </p>
          <p className="max-w-sm text-muted-foreground">
            {isFiltered ? 'Try a different topic or subject — or build exactly the companion you need.' : 'Build the first companion and it will appear here.'}
          </p>
          <Link href="/companions/new" className="btn-primary mt-2">
            <Plus className="size-4" aria-hidden /> Build a companion
          </Link>
        </section>
      )}
    </main>
  )
}

export default CompanionsLibrary
