import { profile } from "@/content/profile";

export default function LogoCloud() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
          {profile.logoCloud.map((name) => (
            <span
              key={name}
              className="text-sm font-medium tracking-tight text-ink/35 transition-colors hover:text-ink/55 sm:text-base"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
