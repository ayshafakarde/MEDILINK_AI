import {
  AlertCircle,
  Baby,
  Car,
  Droplets,
  HeartPulse,
  type LucideIcon,
} from "lucide-react";
import type { EmergencyCategory } from "@/data/types";

const iconMap: Record<EmergencyCategory["icon"], LucideIcon> = {
  accident: Car,
  cardiac: HeartPulse,
  blood: Droplets,
  pregnancy: Baby,
  general: AlertCircle,
};

interface EmergencyCardProps {
  category: EmergencyCategory;
}

export default function EmergencyCard({ category }: EmergencyCardProps) {
  const Icon = iconMap[category.icon];

  return (
    <article className="group cursor-pointer rounded-2xl border border-red-100 bg-white p-6 shadow-md shadow-red-100/40 transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl hover:shadow-red-200/50">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-50 to-red-100 text-red-500 transition-colors group-hover:from-red-500 group-hover:to-red-700 group-hover:text-white">
        <Icon className="h-7 w-7" aria-hidden />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">
        {category.description}
      </p>
      <p className="mt-4 text-sm font-medium text-red-500 opacity-0 transition-opacity group-hover:opacity-100">
        Find nearby help →
      </p>
    </article>
  );
}
