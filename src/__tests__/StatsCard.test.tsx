import { render, screen } from "@testing-library/react";
import StatsCard from "../components/StatsCard";

describe("StatsCard", () => {
  const defaultProps = {
    icon: <img src="/icon.svg" alt="test icon" />,
    title: "Active Users",
    value: "2,453" as string | number,
    iconBgColor: "#DF18FF",
  };

  it("renders the title correctly", () => {
    render(<StatsCard {...defaultProps} />);
    expect(screen.getByText("Active Users")).toBeInTheDocument();
  });

  it("renders the value correctly", () => {
    render(<StatsCard {...defaultProps} />);
    expect(screen.getByText("2,453")).toBeInTheDocument();
  });

  it("renders the icon", () => {
    render(<StatsCard {...defaultProps} />);
    expect(screen.getByAltText("test icon")).toBeInTheDocument();
  });

  it("applies the correct background color to icon container", () => {
    const { container } = render(<StatsCard {...defaultProps} />);
    const iconDiv = container.querySelector(".stats-card__icon") as HTMLElement;
    expect(iconDiv.style.backgroundColor).toBe("rgb(223, 24, 255)");
  });

  it("renders with number value", () => {
    render(<StatsCard {...defaultProps} value={500} />);
    expect(screen.getByText("500")).toBeInTheDocument();
  });

  it("renders with string value", () => {
    render(<StatsCard {...defaultProps} value="1,200" />);
    expect(screen.getByText("1,200")).toBeInTheDocument();
  });

  it("renders with zero value", () => {
    render(<StatsCard {...defaultProps} value={0} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
