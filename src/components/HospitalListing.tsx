"use client";

import { useMemo, useState } from "react";
import { hospitals } from "@/data/hospitals";
import type { HospitalFilter } from "@/data/types";
import FilterBar from "./FilterBar";
import HospitalCard from "./HospitalCard";

export default function HospitalListing() {
  const [activeFilter, setActiveFilter] = useState<HospitalFilter | "all">("all");

  const filtered = useMemo(() => {
    if (activeFilter === "all") return hospitals;
    return hospitals.filter((h) => h.filters.includes(activeFilter));
  }, [activeFilter]);

  return (
    <section id="hospitals" className="bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Nearby Hospitals
            </h2>
            <p className="mt-3 max-w-xl text-gray-600">
              Compare distance, services, and contact options. Filter by the
              care you need right now.
            </p>
          </div>
          <FilterBar active={activeFilter} onChange={setActiveFilter} />
        </div>

        <div
          className={`mt-10 grid gap-6 transition-opacity duration-300 sm:grid-cols-2 lg:grid-cols-3 ${
            filtered.length === 0 ? "opacity-50" : "opacity-100"
          }`}
        >
          {filtered.length > 0 ? (
            filtered.map((hospital) => (
              <HospitalCard key={hospital.id} hospital={hospital} />
            ))
          ) : (
            <p className="col-span-full rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center text-gray-600">
              No hospitals match this filter. Try another category.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
