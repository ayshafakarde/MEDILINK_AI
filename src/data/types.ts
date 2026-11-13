export type HospitalFilter = "icu" | "blood-bank" | "emergency" | "ambulance";

export interface Hospital {
  id: string;
  name: string;
  distance: string;
  services: string[];
  contact: string;
  mapsUrl: string;
  filters: HospitalFilter[];
}

export interface EmergencyCategory {
  id: string;
  title: string;
  description: string;
  icon: "accident" | "cardiac" | "blood" | "pregnancy" | "general";
}

export interface EmergencyContact {
  label: string;
  number: string;
  description: string;
  icon: "ambulance" | "police" | "fire" | "helpline";
}
