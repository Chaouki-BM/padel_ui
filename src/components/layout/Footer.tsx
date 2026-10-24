import { Link } from "@/i18n/navigation";

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white py-6">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-3 px-4 text-center text-xs font-medium text-slate-500 sm:flex-row sm:text-sm sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} PadelTunisie</p>
        <Link
          href="/dev"
          className="text-slate-400 underline-offset-4 hover:text-slate-600 hover:underline"
        >
          Dev routes
        </Link>
      </div>
    </footer>
  );
}
