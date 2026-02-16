import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import Login from "../pages/Login/Login";

// ── Mock react-router-dom's useNavigate ────────────────────────────────
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

// ── Helper: render Login inside a router context ───────────────────────
const renderLogin = () =>
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

describe("Login Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  // ====================================================================
  // POSITIVE SCENARIOS
  // ====================================================================

  describe("Positive scenarios", () => {
    it("renders the login page with all expected elements", () => {
      renderLogin();

      // Heading & subtitle
      expect(
        screen.getByRole("heading", { name: /welcome!/i })
      ).toBeInTheDocument();
      expect(screen.getByText("Enter details to login.")).toBeInTheDocument();

      // Inputs
      expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();

      // SHOW toggle button
      expect(
        screen.getByRole("button", { name: /show/i })
      ).toBeInTheDocument();

      // LOG IN button
      expect(
        screen.getByRole("button", { name: /log in/i })
      ).toBeInTheDocument();

      // FORGOT PASSWORD? link
      expect(
        screen.getByRole("link", { name: /forgot password\?/i })
      ).toBeInTheDocument();
    });

    it("allows the user to type an email", async () => {
      const user = userEvent.setup();
      renderLogin();

      const emailInput = screen.getByPlaceholderText("Email");
      await user.type(emailInput, "user@example.com");

      expect(emailInput).toHaveValue("user@example.com");
    });

    it("allows the user to type a password", async () => {
      const user = userEvent.setup();
      renderLogin();

      const passwordInput = screen.getByPlaceholderText("Password");
      await user.type(passwordInput, "Secret123!");

      expect(passwordInput).toHaveValue("Secret123!");
    });

    it("toggles password visibility when SHOW/HIDE is clicked", async () => {
      const user = userEvent.setup();
      renderLogin();

      const passwordInput = screen.getByPlaceholderText("Password");
      const toggleBtn = screen.getByRole("button", { name: /show/i });

      // Initially the password field is masked
      expect(passwordInput).toHaveAttribute("type", "password");

      // Click SHOW → field becomes visible text, button label becomes HIDE
      await user.click(toggleBtn);
      expect(passwordInput).toHaveAttribute("type", "text");
      expect(
        screen.getByRole("button", { name: /hide/i })
      ).toBeInTheDocument();

      // Click HIDE → field is masked again, button label becomes SHOW
      await user.click(screen.getByRole("button", { name: /hide/i }));
      expect(passwordInput).toHaveAttribute("type", "password");
      expect(
        screen.getByRole("button", { name: /show/i })
      ).toBeInTheDocument();
    });

    it("successfully logs in with valid credentials and navigates to /dashboard", async () => {
      const user = userEvent.setup();
      renderLogin();

      await user.type(screen.getByPlaceholderText("Email"), "user@example.com");
      await user.type(screen.getByPlaceholderText("Password"), "Password1!");
      await user.click(screen.getByRole("button", { name: /log in/i }));

      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });

    it("stores auth data in localStorage on successful login", async () => {
      const user = userEvent.setup();
      renderLogin();

      await user.type(screen.getByPlaceholderText("Email"), "user@example.com");
      await user.type(screen.getByPlaceholderText("Password"), "Password1!");
      await user.click(screen.getByRole("button", { name: /log in/i }));

      const stored = JSON.parse(
        localStorage.getItem("lendsqr_auth") as string
      );
      expect(stored).toEqual({
        email: "user@example.com",
        isAuthenticated: true,
      });
    });
  });

  // ====================================================================
  // NEGATIVE SCENARIOS
  // ====================================================================

  describe("Negative scenarios", () => {
    it("shows email required error when form submitted with empty email", async () => {
      const user = userEvent.setup();
      renderLogin();

      // Fill only the password, leave email empty
      await user.type(screen.getByPlaceholderText("Password"), "Password1!");
      await user.click(screen.getByRole("button", { name: /log in/i }));

      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });

    it("shows password required error when form submitted with empty password", async () => {
      const user = userEvent.setup();
      renderLogin();

      // Fill only the email, leave password empty
      await user.type(
        screen.getByPlaceholderText("Email"),
        "user@example.com"
      );
      await user.click(screen.getByRole("button", { name: /log in/i }));

      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });

    it("shows both errors when form submitted with both fields empty", async () => {
      const user = userEvent.setup();
      renderLogin();

      await user.click(screen.getByRole("button", { name: /log in/i }));

      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });

    it("shows invalid email error for a malformed email address", async () => {
      const user = userEvent.setup();
      renderLogin();

      await user.type(screen.getByPlaceholderText("Email"), "notanemail");
      await user.type(screen.getByPlaceholderText("Password"), "Password1!");
      await user.click(screen.getByRole("button", { name: /log in/i }));

      expect(
        screen.getByText("Please enter a valid email")
      ).toBeInTheDocument();
    });

    it("does not navigate when validation fails", async () => {
      const user = userEvent.setup();
      renderLogin();

      // Submit completely empty form
      await user.click(screen.getByRole("button", { name: /log in/i }));

      expect(mockNavigate).not.toHaveBeenCalled();

      // Submit with invalid email only
      await user.type(screen.getByPlaceholderText("Email"), "bad");
      await user.click(screen.getByRole("button", { name: /log in/i }));

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
