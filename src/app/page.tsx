import Masthead from "@/components/Masthead";
import PortraitCard from "@/components/PortraitCard";
import Card from "@/components/ui/Card";
import PageShell from "@/components/ui/PageShell";
import ServicesSection from "@/components/sections/ServicesSection";
import AgentsSection from "@/components/sections/AgentsSection";
import WorkSection from "@/components/sections/WorkSection";
import NowSection from "@/components/sections/NowSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <PageShell>
      {/* Card 1: Masthead with profile, bio, and hero headline */}
      <Masthead />

      {/* Card 2: Portrait placeholder */}
      <PortraitCard />

      {/* Card 3: Services, what I do, as animated icon buttons into the assistant */}
      <Card>
        <ServicesSection />
      </Card>

      {/* Card 4: Agents section, the live chat demo */}
      <Card>
        <AgentsSection />
      </Card>

      {/* Card 5: Work, workflow canvas + link into the full /projects page */}
      <Card>
        <WorkSection />
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
