import type { Profile } from "@/data/portfolio";

/** 1. Home / Landing */
export default function Hero({ profile }: { profile: Profile }) {
  return (
    <section className="section hero" id="home" aria-labelledby="hero-title">
      <div className="container hero__inner">
        <div className="hero__text reveal">
          <p className="hero__eyebrow">{profile.greeting}</p>
          <h1 className="hero__title" id="hero-title">
            {profile.name}
          </h1>
          <p className="hero__role">{profile.title}</p>
          <p className="hero__intro">{profile.intro}</p>
          <div className="hero__actions">
            <a href="#projects" className="btn btn--primary">
              View My Work
            </a>
            <a href="#contact" className="btn btn--ghost">
              Get In Touch
            </a>
          </div>
        </div>
        <div className="hero__media reveal">
          <img
            className="hero__photo"
            src={profile.photo}
            alt={"Portrait of " + profile.name}
            width={320}
            height={320}
          />
        </div>
      </div>
    </section>
  );
}
