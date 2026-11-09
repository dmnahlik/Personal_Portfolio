import BlueprintBackground from "@/components/BlueprintBackground";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import RevealObserver from "@/components/RevealObserver";
import Showcase from "@/components/Showcase";
import Skills from "@/components/Skills";
import { portfolio } from "@/data/portfolio";

export default function Home() {
  const { profile, sections, showcase, skills, contact } = portfolio;

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <BlueprintBackground />
      <Header initials={profile.initials} />
      <main id="main">
        <Hero profile={profile} />
        <Showcase items={showcase} subtitle={sections.projectsSubtitle} />
        <Skills groups={skills} subtitle={sections.skillsSubtitle} />
        <Contact contact={contact} subtitle={sections.contactSubtitle} />
      </main>
      <Footer name={profile.name} />
      <RevealObserver />
    </>
  );
}
