import { useSosStore } from "@/store/sosStore";

describe("sosStore", () => {
  beforeEach(() => useSosStore.getState().reset());

  it("läuft idle -> countdown -> sending -> done", () => {
    expect(useSosStore.getState().status).toBe("idle");
    useSosStore.getState().startCountdown();
    expect(useSosStore.getState().status).toBe("countdown");
    useSosStore.getState().setSending();
    expect(useSosStore.getState().status).toBe("sending");
    useSosStore.getState().finish({ location: null, contactCount: 2, smsComposed: true });
    expect(useSosStore.getState().status).toBe("done");
    expect(useSosStore.getState().result?.contactCount).toBe(2);
  });
});
