import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { getFromLocalStorage } from "../../utils/localStorage";
import signInIllustration from "../../assets/images/sign-in-illustration.png";
import "./Login.scss";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    const auth = getFromLocalStorage<{ isAuthenticated: boolean }>("lendsqr_auth");
    if (auth?.isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    localStorage.setItem(
      "lendsqr_auth",
      JSON.stringify({ email, isAuthenticated: true })
    );

    navigate("/dashboard");
  };

  return (
    <div className="login-page">
      {/* ---- LEFT SIDE ---- */}
      <div className="login-page__left">
        {/* Lendsqr Logo */}
        <div className="login-page__logo">
          <svg
            width="173"
            height="36"
            viewBox="0 0 173 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              {/* Union icon */}
              <path
                d="M17.44 0C7.808 0 0 7.808 0 17.44c0 5.663 2.705 10.69 6.89 13.882l3.528-6.108a8.72 8.72 0 0 1-2.698-6.334c0-4.836 3.924-8.76 8.76-8.76a8.72 8.72 0 0 1 6.335 2.698l6.107-3.528C25.43 4.505 21.803 1.8 17.44 0z"
                fill="#213F7D"
              />
              <path
                d="M17.44 26.16c-4.836 0-8.76-3.924-8.76-8.76 0-1.513.392-2.935 1.072-4.178l-6.107-3.528A17.28 17.28 0 0 0 0 17.44c0 9.632 7.808 17.44 17.44 17.44 2.683 0 5.224-.612 7.498-1.694l-3.528-6.108a8.67 8.67 0 0 1-3.97.922z"
                fill="#39CDCC"
              />
            </g>
            {/* "lendsqr" text */}
            <text
              x="42"
              y="27"
              fontFamily="'Work Sans', sans-serif"
              fontSize="28"
              fontWeight="700"
              fill="#213F7D"
            >
              lendsqr
            </text>
          </svg>
        </div>

        {/* Sign-in Illustration */}
        <div className="login-page__illustration">
          <img
            src={signInIllustration}
            alt="Sign in illustration"
          />
        </div>
      </div>

      {/* ---- RIGHT SIDE ---- */}
      <div className="login-page__right">
        <div className="login-page__form-wrapper">
          {/* Mobile logo – visible only when left panel is hidden */}
          <div className="login-page__mobile-logo">
            <svg
              width="173"
              height="36"
              viewBox="0 0 173 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <path
                  d="M17.44 0C7.808 0 0 7.808 0 17.44c0 5.663 2.705 10.69 6.89 13.882l3.528-6.108a8.72 8.72 0 0 1-2.698-6.334c0-4.836 3.924-8.76 8.76-8.76a8.72 8.72 0 0 1 6.335 2.698l6.107-3.528C25.43 4.505 21.803 1.8 17.44 0z"
                  fill="#213F7D"
                />
                <path
                  d="M17.44 26.16c-4.836 0-8.76-3.924-8.76-8.76 0-1.513.392-2.935 1.072-4.178l-6.107-3.528A17.28 17.28 0 0 0 0 17.44c0 9.632 7.808 17.44 17.44 17.44 2.683 0 5.224-.612 7.498-1.694l-3.528-6.108a8.67 8.67 0 0 1-3.97.922z"
                  fill="#39CDCC"
                />
              </g>
              <text
                x="42"
                y="27"
                fontFamily="'Work Sans', sans-serif"
                fontSize="28"
                fontWeight="700"
                fill="#213F7D"
              >
                lendsqr
              </text>
            </svg>
          </div>
          <h1 className="login-page__heading">Welcome!</h1>
          <p className="login-page__subtitle">Enter details to login.</p>

          <form className="login-page__form" onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="login-page__field">
              <input
                type="email"
                className={`login-page__input ${errors.email ? "login-page__input--error" : ""}`}
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
              />
              {errors.email && (
                <span className="login-page__error">{errors.email}</span>
              )}
            </div>

            {/* Password */}
            <div className="login-page__field">
              <div className="login-page__password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`login-page__input ${errors.password ? "login-page__input--error" : ""}`}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                />
                <button
                  type="button"
                  className="login-page__show-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
              {errors.password && (
                <span className="login-page__error">{errors.password}</span>
              )}
            </div>

            {/* Forgot Password */}
            <a href="#" className="login-page__forgot">
              FORGOT PASSWORD?
            </a>

            {/* Submit */}
            <button type="submit" className="login-page__submit">
              LOG IN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
