/**
 * Inhalte der Sicherheitstipps. Allgemeine Hinweise – keine Rechts- oder Einzelfallberatung.
 */
export interface TipCategory {
  id: string;
  title: string;
  subtitle: string;
  intro?: string;
  items: { title: string; text: string }[];
  links?: { label: string; url: string }[];
}

export const TIP_CATEGORIES: TipCategory[] = [
  {
    id: "alltag",
    title: "Alltag",
    subtitle: "Sicher unterwegs, zu Hause & in der Nacht",
    items: [
      {
        title: "Unterwegs",
        text: "Wähle belebte, gut beleuchtete Wege. Hör Musik nur auf einem Ohr oder leise, damit du deine Umgebung wahrnimmst. Teile deinen Standort mit einer Vertrauensperson.",
      },
      {
        title: "Zu Hause",
        text: "Schließe Tür und Fenster ab, auch wenn du zu Hause bist. Öffne Fremden nicht sofort – nutze Türspion oder Gegensprechanlage. Hausschlüssel bereithalten, bevor du die Haustür erreichst.",
      },
      {
        title: "In der Nacht",
        text: "Plane den Heimweg vorab, teile deine geplante Ankunft und nutze den Safe-Journey-Modus. Setz dich in Bus und Bahn in die Nähe des Fahrpersonals. Taxi: Kennzeichen kurz an eine Vertrauensperson schicken.",
      },
      {
        title: "Getränke & Gesellschaft",
        text: "Lass dein Getränk nicht aus den Augen. Wenn dir plötzlich schwindelig oder komisch wird: Sofort eine Vertrauensperson ansprechen und Hilfe holen.",
      },
    ],
  },
  {
    id: "gefahr",
    title: "Gefahrensituationen",
    subtitle: "Was tun, wenn du dich bedroht fühlst?",
    intro: "Vertraue deinem Gefühl. Du musst dich nicht rechtfertigen, wenn du dich unwohl fühlst.",
    items: [
      {
        title: "Aufmerksamkeit erzeugen",
        text: 'Sprich laut und deutlich ("Lassen Sie mich in Ruhe!"). Sprich Umstehende direkt an: "Sie im roten Mantel, rufen Sie bitte die 110!" – gezielte Ansprache wirkt besser als allgemeine Hilferufe.',
      },
      {
        title: "Ort wechseln",
        text: "Geh in ein Geschäft, ein Café oder zu einer Gruppe von Menschen. Nutze den Fake Call oder den lauten Alarm in der App.",
      },
      {
        title: "Hilfe rufen",
        text: "Bei akuter Gefahr 110 oder 112 wählen. Löse in der App den SOS aus, damit deine Vertrauenspersonen deinen Standort erhalten.",
      },
      {
        title: "Nach dem Erlebnis",
        text: 'Such dir Unterstützung – auch wenn "nichts passiert" ist. Das Hilfetelefon 116 016 ist kostenlos, anonym und rund um die Uhr erreichbar.',
      },
    ],
  },
  {
    id: "anlaufstellen",
    title: "Anlaufstellen",
    subtitle: "Beratungsstellen & Hilfe vor Ort",
    items: [
      {
        title: "Beratungsstellen",
        text: "Frauenberatungsstellen und Notrufe unterstützen vertraulich und kostenlos bei Gewalt, Stalking oder Belästigung.",
      },
      {
        title: "Frauenhäuser",
        text: "Schutz und Unterkunft, wenn du zu Hause nicht sicher bist. Die Adresse ist aus Sicherheitsgründen oft geheim – die Suche hilft dir bei der Kontaktaufnahme.",
      },
      {
        title: "Polizei",
        text: "Du kannst jederzeit Anzeige erstatten. Du darfst eine Vertrauensperson mitnehmen.",
      },
    ],
    links: [
      { label: "Hilfetelefon – Beratung online", url: "https://www.hilfetelefon.de" },
      { label: "Frauenhaus-Suche", url: "https://www.frauenhaus-suche.de" },
    ],
  },
  {
    id: "wissen",
    title: "Wissenswertes",
    subtitle: "Rechte, Tipps & Fakten",
    items: [
      {
        title: "Deine Rechte",
        text: "Gewalt, Nötigung, Stalking und sexuelle Belästigung sind strafbar. Du hast das Recht auf Schutz, Beratung und – wenn du möchtest – Anzeige.",
      },
      {
        title: "Beweise sichern",
        text: "Bewahre Nachrichten, Screenshots, Fotos und Notizen mit Datum auf. Nach einem Übergriff: ärztliche Dokumentation ist auch ohne Anzeige möglich.",
      },
      {
        title: "Digital sicher",
        text: "Nutze eine Bildschirmsperre, teile Standort nur gezielt und prüfe regelmäßig, welche Apps Zugriff auf deinen Standort haben.",
      },
      {
        title: "Hinweis",
        text: "Diese Inhalte sind allgemeine Informationen und ersetzen keine Rechts- oder Einzelfallberatung.",
      },
    ],
  },
];
