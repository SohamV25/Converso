import CompanioinsList from "@/components/CompanioinsList";
import CompanionCard from "@/components/CompanionCard";
import CTA from "@/components/CTA";
import { recentSessions } from "@/constants";

const Page = () => (
  <main>
    <h1 >Popular Companions</h1>
    <section className="home-section">
      <CompanionCard 
        id="123"
        name="Neura the brainy explorer"
        topic = "Neural netwrok of the brain"
        subject = "science"
        duration = {45}
        color = "#ffa2"
      />

      <CompanionCard 
        id="456"
        name="Countsy the number wizart"
        topic = "derivatives"
        subject = "science"
        duration = {30}
        color = "#e5d0ff"
      />

      <CompanionCard 
        id="189"
        name="Verba the vocab builder"
        topic = "english"
        subject = "lanugage"
        duration = {30}
        color = "#fff"
      />
      
    </section>

  <section className="home-section ">
    <CompanioinsList
      title = "Recently Completed Sessions"
      companions = {recentSessions}
      classNames = "w-2/3 max-lg:w-full border-black"
    />
    <CTA/>
  </section>

  </main>
)

export default Page;