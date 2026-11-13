import { MapPin, Phone } from "lucide-react";
import type { Hospital } from "@/data/types";

interface HospitalCardProps {
  hospital: Hospital;
}

export default function HospitalCard({ hospital }: HospitalCardProps) {
  const telHref = `tel:${hospital.contact.replace(/\D/g, "")}`;

  return (
    <article className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-md shadow-gray-100/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-red-100 hover:shadow-lg hover:shadow-red-100/40">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{hospital.name}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-red-500">
          <MapPin className="h-4 w-4 shrink-0" aria-hidden />
          {hospital.distance} away
        </p>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Available services
        </p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {hospital.services.map((service) => (
            <li
              key={service}
              className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700"
            >
              {service}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 flex items-center gap-2 text-sm text-gray-700">
        <Phone className="h-4 w-4 text-red-500" aria-hidden />
        {hospital.contact}
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a
          href={telHref}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
        >
          <Phone className="h-4 w-4" aria-hidden />
          Call
        </a>
        <a
          href={hospital.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700"
        >
          <MapPin className="h-4 w-4" aria-hidden />
          Open Maps
        </a>
      </div>
    </article>
  );
}
