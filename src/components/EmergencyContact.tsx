import {
  Ambulance,
  Flame,
  Phone,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { emergencyContacts } from "@/data/emergencyContacts";
import type { EmergencyContact as Contact } from "@/data/types";

const iconMap: Record<Contact["icon"], LucideIcon> = {
  ambulance: Ambulance,
  helpline: Phone,
  police: Shield,
  fire: Flame,
};

export default function EmergencyContact() {
  return (
    <section
      id="contacts"
      className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 py-16 text-white sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Emergency Contacts
          </h2>
          <p className="mt-3 text-red-50">
            Tap to call immediately. Available 24/7 for critical situations.
          </p>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {emergencyContacts.map((contact) => {
            const Icon = iconMap[contact.icon];
            return (
              <li key={contact.label}>
                <a
                  href={`tel:${contact.number}`}
                  className="group flex h-full flex-col rounded-2xl border border-white/20 bg-white/10 p-6 shadow-lg shadow-red-900/20 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-xl"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 transition-colors group-hover:bg-white group-hover:text-red-700">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <span className="mt-4 text-sm font-medium text-red-50">
                    {contact.label}
                  </span>
                  <span className="mt-1 text-3xl font-bold">{contact.number}</span>
                  <span className="mt-2 text-sm text-red-50/90">
                    {contact.description}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
