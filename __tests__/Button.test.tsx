import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import { Button } from "@components/ui/Button";

describe("Button", () => {
  it("rendert das Label korrekt", () => {
    const { getByText } = render(<Button label="Anmelden" onPress={() => {}} />);
    expect(getByText("Anmelden")).toBeTruthy();
  });

  it("ruft onPress beim Tippen auf", () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button label="Speichern" onPress={onPress} />);
    fireEvent.press(getByText("Speichern"));
    expect(onPress).toHaveBeenCalled();
  });
});
