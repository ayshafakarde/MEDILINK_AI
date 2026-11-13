const KEYWORD_RULES: { keywords: string[]; response: string }[] = [
  {
    keywords: ["heart", "cardiac", "chest", "stroke"],
    response:
      "Nearest hospital with ICU and emergency cardiac support recommended: Central Heart & ICU Hospital (4.2 km). City General Hospital (1.2 km) also offers cardiology and trauma care.",
  },
  {
    keywords: ["blood", "transfusion", "donor"],
    response:
      "Metro Blood & Care Center (2.4 km) and RNS Hospital Murdeshwar (16 km) have blood bank services available. Contact them immediately for type matching.",
  },
  {
    keywords: ["accident", "trauma", "injury", "crash"],
    response:
      "Life Care Specialty Hospital (2.1 km) is nearest with trauma and emergency care. Contact for ambulance dispatch if needed.",
  },
  {
    keywords: ["pregnancy", "labor", "maternal", "baby"],
    response:
      "Amita Hospital (4.3 km) offers pregnancy care and emergency support. Taluka Government Hospital Bhatkal (3.5 km) for immediate assessment.",
  },
  {
    keywords: ["ambulance", "transport", "pickup"],
    response:
      "Life Care Specialty Hospital (2.1 km) has ambulance services. Call 108 for national emergency transport.",
  },
  {
    keywords: ["icu", "critical", "intensive"],
    response:
      "ICU-equipped facilities nearby: Life Care Specialty Hospital (2.1 km), Taluka Government Hospital (3.5 km), and RNS Hospital Murdeshwar (16 km).",
  },
];

const DEFAULT_RESPONSE =
  "Nearest hospital with ICU and emergency cardiac support recommended. For your situation, we suggest Life Care Specialty Hospital (2.1 km) for general emergencies, or use category filters to narrow results.";

export function getAIRecommendation(query: string): Promise<string> {
  return new Promise((resolve) => {
    const normalized = query.toLowerCase().trim();

    setTimeout(() => {
      if (!normalized) {
        resolve(
          "Please describe your emergency (e.g., heart pain, blood need, accident) so we can recommend the best nearby facility."
        );
        return;
      }

      const match = KEYWORD_RULES.find((rule) =>
        rule.keywords.some((kw) => normalized.includes(kw))
      );

      resolve(match?.response ?? DEFAULT_RESPONSE);
    }, 1200);
  });
}
