import Masthead from "@/components/Masthead";
import PortraitCard from "@/components/PortraitCard";
import Card from "@/components/ui/Card";
import PageShell from "@/components/ui/PageShell";
import AgentsSection from "@/components/sections/AgentsSection";
import WorkSection from "@/components/sections/WorkSection";
import JourneySection from "@/components/sections/JourneySection";
import NowSection from "@/components/sections/NowSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <PageShell>
      {/* Card 1: Masthead with profile and hero headline */}
      <Masthead />

      {/* Card 2: Portrait placeholder */}
      <PortraitCard />

      {/* Card 3: Agents section */}
      <Card>
        <AgentsSection />
      </Card>

      {/* Card 4: Work — workflow canvas + link into the full /projects page */}
      <Card>
        <WorkSection />
      </Card>

      {/* Card 5: Journey & milestones — minimal, grows as real entries are added */}
      <Card>
        <JourneySection />
      </Card>

      {/* Card 6: Now section */}
      <Card>
        <NowSection />
      </Card>

      {/* Card 7: Contact section */}
      <Card>
        <ContactSection />
      </Card>
    </PageShell>
  );
}
