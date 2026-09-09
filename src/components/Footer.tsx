import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-line/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 md:flex-row md:justify-between md:py-12">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <Logo size={28} />
        </div>
        <p className="text-center text-xs text-inkSoft md:text-left">
          © {new Date().getFullYear()} Ifiok Columba. Designed &amp; built from scratch.
        </p>
      </div>
    </footer>
  );
}
