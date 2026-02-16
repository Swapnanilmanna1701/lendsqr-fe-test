import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import UserTable from "../components/UserTable";
import type { User } from "../types";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: "1",
    orgName: "Lendsqr",
    userName: "johndoe",
    email: "john@lendsqr.com",
    phoneNumber: "08012345678",
    createdAt: "2023-05-15T10:00:00.000Z",
    status: "Active",
    personalInfo: {
      fullName: "John Doe",
      phoneNumber: "08012345678",
      email: "john@lendsqr.com",
      bvn: "12345678901",
      gender: "Male",
      maritalStatus: "Single",
      children: "None",
      typeOfResidence: "Apartment",
    },
    educationAndEmployment: {
      levelOfEducation: "B.Sc",
      employmentStatus: "Employed",
      sectorOfEmployment: "FinTech",
      durationOfEmployment: "2 years",
      officeEmail: "john@work.com",
      monthlyIncome: ["200000", "400000"],
      loanRepayment: "40000",
    },
    socials: {
      twitter: "@johndoe",
      facebook: "johndoe",
      instagram: "@johndoe",
    },
    guarantor: {
      fullName: "Jane Doe",
      phoneNumber: "08098765432",
      email: "jane@mail.com",
      relationship: "Sister",
    },
    ...overrides,
  };
}

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe("UserTable", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("shows loading spinner when loading is true", () => {
    renderWithRouter(<UserTable users={[]} loading={true} />);
    expect(screen.getByText("Loading users...")).toBeInTheDocument();
  });

  it('shows "No users found" when users array is empty', () => {
    renderWithRouter(<UserTable users={[]} loading={false} />);
    expect(screen.getByText("No users found")).toBeInTheDocument();
  });

  it("renders table headers correctly", () => {
    renderWithRouter(<UserTable users={[createMockUser()]} loading={false} />);
    const expectedHeaders = [
      "ORGANIZATION",
      "USERNAME",
      "EMAIL",
      "PHONE NUMBER",
      "DATE JOINED",
      "STATUS",
    ];
    expectedHeaders.forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });

  it("renders user data in table rows", () => {
    const user = createMockUser();
    renderWithRouter(<UserTable users={[user]} loading={false} />);
    expect(screen.getByText("Lendsqr")).toBeInTheDocument();
    expect(screen.getByText("johndoe")).toBeInTheDocument();
    expect(screen.getByText("john@lendsqr.com")).toBeInTheDocument();
    expect(screen.getByText("08012345678")).toBeInTheDocument();
  });

  it("displays correct status badges", () => {
    const users = [
      createMockUser({ id: "1", status: "Active" }),
      createMockUser({ id: "2", status: "Inactive" }),
      createMockUser({ id: "3", status: "Pending" }),
      createMockUser({ id: "4", status: "Blacklisted" }),
    ];
    renderWithRouter(<UserTable users={users} loading={false} />);

    expect(screen.getByText("Active")).toHaveClass("user-table__status--active");
    expect(screen.getByText("Inactive")).toHaveClass("user-table__status--inactive");
    expect(screen.getByText("Pending")).toHaveClass("user-table__status--pending");
    expect(screen.getByText("Blacklisted")).toHaveClass("user-table__status--blacklisted");
  });

  it('shows pagination info ("Showing X out of Y")', () => {
    const users = Array.from({ length: 15 }, (_, i) =>
      createMockUser({ id: String(i + 1), userName: `user${i + 1}` })
    );
    renderWithRouter(<UserTable users={users} loading={false} />);
    expect(screen.getByText("Showing")).toBeInTheDocument();
    expect(screen.getByText("out of 15")).toBeInTheDocument();
  });

  it("handles page change", async () => {
    const user = userEvent.setup();
    const users = Array.from({ length: 25 }, (_, i) =>
      createMockUser({
        id: String(i + 1),
        userName: `user${i + 1}`,
        orgName: `Org${i + 1}`,
      })
    );
    renderWithRouter(<UserTable users={users} loading={false} />);

    // Initially on page 1 — first user should be visible
    expect(screen.getByText("user1")).toBeInTheDocument();

    // Click the "Next page" button
    const nextBtn = screen.getByLabelText("Next page");
    await user.click(nextBtn);

    // After navigating, user11 should be visible (page 2 with 10 items per page)
    expect(screen.getByText("user11")).toBeInTheDocument();
  });

  it("opens action menu when more button is clicked", async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <UserTable users={[createMockUser()]} loading={false} />
    );

    const moreBtn = screen.getByLabelText("More actions");
    await user.click(moreBtn);

    expect(screen.getByText("View Details")).toBeInTheDocument();
    expect(screen.getByText("Blacklist User")).toBeInTheDocument();
    expect(screen.getByText("Activate User")).toBeInTheDocument();
  });
});
