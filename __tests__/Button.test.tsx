import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import { Button } from "@/components/Button";

describe("Button", () => {
  it("zeigt das Label und löst onPress aus", () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button label="Speichern" onPress={onPress} />);
    fireEvent.press(getByText("Speichern"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("löst im disabled-Zustand nicht aus", () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button label="Speichern" onPress={onPress} disabled />);
    fireEvent.press(getByText("Speichern"));
    expect(onPress).not.toHaveBeenCalled();
  });
});
