import Hero from "../components/Hero";
import Projects from "../components/Projects";
import Services from "../components/Services";
import QuestLog from "../components/QuestLog";

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="bg-neo-bg border-t border-neo-surface">
        <Services />
      </div>
      <div className="bg-[#15171E] border-t border-neo-surface">
        <Projects />
      </div>
      <div className="bg-neo-bg border-t border-neo-surface">
        <QuestLog />
      </div>
    </>
  );
}
