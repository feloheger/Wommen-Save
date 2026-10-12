import { useJourneyStore } from "@/store/journeyStore";

describe("journeyStore", () => {
  beforeEach(() => useJourneyStore.getState().end());

  it("durchläuft active -> checkin_pending -> alert", () => {
    useJourneyStore.getState().begin("Zuhause", Date.now() + 1000);
    expect(useJourneyStore.getState().status).toBe("active");
    useJourneyStore.getState().requestCheckIn(Date.now() + 500);
    expect(useJourneyStore.getState().status).toBe("checkin_pending");
    useJourneyStore.getState().triggerAlert();
    expect(useJourneyStore.getState().status).toBe("alert");
  });

  it("end() setzt alles zurück", () => {
    useJourneyStore.getState().begin("Zuhause", Date.now() + 1000);
    useJourneyStore.getState().end();
    expect(useJourneyStore.getState().status).toBe("idle");
    expect(useJourneyStore.getState().route).toEqual([]);
  });
});
