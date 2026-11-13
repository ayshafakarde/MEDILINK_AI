import type { EmergencyCategory } from "./types";

export const emergencyCategories: EmergencyCategory[] = [
  {
    id: "accident",
    title: "Accident",
    description: "Road, workplace, or trauma incidents requiring immediate care.",
    icon: "accident",
  },
  {
    id: "cardiac",
    title: "Cardiac Emergency",
    description: "Chest pain, heart attack, or cardiovascular distress.",
    icon: "cardiac",
  },
  {
    id: "blood",
    title: "Blood Requirement",
    description: "Urgent blood donation or transfusion needs nearby.",
    icon: "blood",
  },
  {
    id: "pregnancy",
    title: "Pregnancy",
    description: "Labor, complications, or maternal emergency support.",
    icon: "pregnancy",
  },
  {
    id: "general",
    title: "General Emergency",
    description: "Any urgent medical situation needing fast help.",
    icon: "general",
  },
];
