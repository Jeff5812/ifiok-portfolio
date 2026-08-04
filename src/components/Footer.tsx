import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-line/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 md:flex-row md:justify-between">
        <Logo size={28} />
        <p className="label-mono text-inkSoft">
          © {new Date().getFullYear()} Ifiok Columba. Designed &amp; built from scratch.
        </p>
      </div>
    </footer>
  );
}
