export interface EmergencyNumber {
  id: string;
  name: string;
  description: string;
  number: string;
}

export const EMERGENCY_NUMBERS: EmergencyNumber[] = [
  {
    id: "112",
    name: "Notruf / Rettungsdienst",
    description: "Feuerwehr & Rettung, europaweit",
    number: "112",
  },
  { id: "110", name: "Polizei", description: "Bei akuter Gefahr oder Straftaten", number: "110" },
  {
    id: "116016",
    name: "Hilfetelefon Gewalt gegen Frauen",
    description: "Kostenlos, anonym, rund um die Uhr",
    number: "116016",
  },
  {
    id: "116006",
    name: "Weißer Ring Opfer-Telefon",
    description: "Hilfe für Opfer von Straftaten",
    number: "116006",
  },
  {
    id: "telefonseelsorge",
    name: "Telefonseelsorge",
    description: "Wenn du mit jemandem sprechen möchtest",
    number: "08001110111",
  },
];
