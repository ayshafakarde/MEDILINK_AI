"use client";

import type { HospitalFilter } from "@/data/types";

const filters: { id: HospitalFilter | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "icu", label: "ICU" },
  { id: "blood-bank", label: "Blood Bank" },
  { id: "emergency", label: "Emergency" },
  { id: "ambulance", label: "Ambulance" },
];

interface FilterBarProps {
  active: HospitalFilter | "all";
  onChange: (filter: HospitalFilter | "all") => void;
}

export default function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const isActive = active === filter.id;
        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onChange(filter.id)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-red-500 text-white shadow-md shadow-red-200"
                : "border border-gray-200 bg-white text-gray-700 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
