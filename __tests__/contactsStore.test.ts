import { selectEmergencyTargets, useContactsStore } from "@/store/contactsStore";

const base = { relationship: undefined };

describe("contactsStore", () => {
  beforeEach(() => useContactsStore.setState({ contacts: [] }));

  it("fügt hinzu, favorisiert und entfernt", () => {
    const s = useContactsStore.getState();
    s.addContact({ id: "1", name: "Lena", phone: "+491", isFavorite: false, ...base });
    s.addContact({ id: "2", name: "Mama", phone: "+492", isFavorite: false, ...base });
    useContactsStore.getState().toggleFavorite("2");
    expect(useContactsStore.getState().contacts.find((c) => c.id === "2")?.isFavorite).toBe(true);
    useContactsStore.getState().removeContact("1");
    expect(useContactsStore.getState().contacts).toHaveLength(1);
  });

  it("wählt im Notfall Favoriten, sonst alle", () => {
    const all = [
      { id: "1", name: "A", phone: "1", isFavorite: false },
      { id: "2", name: "B", phone: "2", isFavorite: true },
    ];
    expect(selectEmergencyTargets(all).map((c) => c.id)).toEqual(["2"]);
    expect(selectEmergencyTargets(all.map((c) => ({ ...c, isFavorite: false }))).length).toBe(2);
  });
});
