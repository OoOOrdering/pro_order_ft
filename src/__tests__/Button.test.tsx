import React from "react";
import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";
import Button from "../components/Button";

describe("Button", () => {
  it("renders with text", () => {
    render(<Button>확인</Button>);
    expect(screen.getByRole("button", { name: "확인" })).toBeInTheDocument();
  });
  it("loading 상태일 때 aria-busy가 true", () => {
    render(<Button loading>로딩</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
  });
});
