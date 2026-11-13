import { Activity, Heart } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500 text-white">
              <Activity className="h-4 w-4" aria-hidden />
            </span>
            <span className="text-lg font-bold text-gray-900">
              Medi<span className="text-red-500">Link</span>
            </span>
          </div>
          <p className="max-w-md text-center text-sm text-gray-600 md:text-left">
            Connecting patients to emergency healthcare resources when every
            second counts.
          </p>
          <nav className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="#categories" className="text-gray-600 hover:text-red-500">
              Categories
            </Link>
            <Link href="#hospitals" className="text-gray-600 hover:text-red-500">
              Hospitals
            </Link>
            <Link href="#assistant" className="text-gray-600 hover:text-red-500">
              AI Assistant
            </Link>
            <Link href="#contacts" className="text-gray-600 hover:text-red-500">
              Emergency
            </Link>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 sm:flex-row">
          <p className="text-sm text-gray-500">
            © {year} MediLink. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-sm text-gray-500">
            Built for faster emergency care
            <Heart className="h-4 w-4 fill-red-500 text-red-500" aria-hidden />
          </p>
        </div>
      </div>
    </footer>
  );
}
