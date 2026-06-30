import { useSosStore } from "@store/sosStore";

describe("sosStore", () => {
  beforeEach(() => {
    useSosStore.getState().reset();
  });

  it("startet im idle-Status", () => {
    expect(useSosStore.getState().status).toBe("idle");
  });

  it("setzt den Status korrekt nach triggerSos", () => {
    useSosStore.getState().triggerSos({ latitude: 1, longitude: 2, timestamp: Date.now() });
    expect(useSosStore.getState().status).toBe("triggered");
    expect(useSosStore.getState().location?.latitude).toBe(1);
  });

  it("setzt den Status auf resolved", () => {
    useSosStore.getState().triggerSos(null);
    useSosStore.getState().resolveSos();
    expect(useSosStore.getState().status).toBe("resolved");
  });
});
