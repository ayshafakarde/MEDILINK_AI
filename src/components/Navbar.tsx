"use client";

import { Activity, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "#categories", label: "Categories" },
  { href: "#hospitals", label: "Hospitals" },
  { href: "#assistant", label: "AI Assistant" },
  { href: "#contacts", label: "Emergency" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-red-100/80 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-700 text-white shadow-lg shadow-red-200/60 transition-transform group-hover:scale-105">
            <Activity className="h-5 w-5" aria-hidden />
          </span>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Medi<span className="text-red-500">Link</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-red-500"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="#hospitals"
            className="rounded-xl px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-red-50 hover:text-red-700"
          >
            Find Care
          </Link>
          <a
            href="tel:112"
            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-red-200 transition-all hover:bg-red-700 hover:shadow-lg"
          >
            Call 112
          </a>
        </div>

        <button
          type="button"
          className="inline-flex rounded-lg p-2 text-gray-700 transition-colors hover:bg-red-50 md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <div
        className={`overflow-hidden border-t border-red-100 bg-white transition-all duration-300 md:hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0 border-transparent"
        }`}
      >
        <ul className="flex flex-col gap-2 px-4 py-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-700"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href="tel:112"
              className="mt-2 block rounded-xl bg-red-500 px-3 py-2.5 text-center text-sm font-semibold text-white"
            >
              Call 112
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
