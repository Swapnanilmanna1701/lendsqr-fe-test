import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { User } from "../../types";
import { fetchUserById } from "../../services/api";
import { getUser, saveUser } from "../../utils/indexedDB";
import { saveToLocalStorage } from "../../utils/localStorage";
import "./UserDetails.scss";

const TABS = [
  "General Details",
  "Documents",
  "Bank Details",
  "Loans",
  "Savings",
  "App and System",
] as const;

type Tab = (typeof TABS)[number];

const UserDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("General Details");

  useEffect(() => {
    if (!id) return;

    const loadUser = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Try IndexedDB cache first
        const cached = await getUser(id);
        if (cached) {
          setUser(cached);
          saveToLocalStorage(`user_${id}`, cached);
          setLoading(false);
          return;
        }

        // 2. Fetch from API
        const fetched = await fetchUserById(id);
        await saveUser(fetched);
        saveToLocalStorage(`user_${id}`, fetched);
        setUser(fetched);
      } catch (err) {
        console.error("Failed to load user:", err);
        setError("Failed to load user details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  /* ------------------------------------------------------------------ */
  /*  Star rating component (tier 1 = 1 filled, 2 empty)               */
  /* ------------------------------------------------------------------ */
  const StarRating = ({ tier = 1 }: { tier?: number }) => (
    <div className="user-details__stars">
      {[1, 2, 3].map((i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 0.5L10.163 5.05L15.127 5.587L11.435 9.01L12.398 13.913L8 11.435L3.602 13.913L4.565 9.01L0.873 5.587L5.837 5.05L8 0.5Z"
            fill={i <= tier ? "#E9B200" : "none"}
            stroke="#E9B200"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  );

  /* ------------------------------------------------------------------ */
  /*  Avatar placeholder                                                */
  /* ------------------------------------------------------------------ */
  const AvatarPlaceholder = () => (
    <div className="user-details__avatar">
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 20C23.866 20 27 16.866 27 13C27 9.134 23.866 6 20 6C16.134 6 13 9.134 13 13C13 16.866 16.134 20 20 20Z"
          fill="#213F7D"
          opacity="0.4"
        />
        <path
          d="M20 23C13.37 23 8 27.03 8 32V34H32V32C32 27.03 26.63 23 20 23Z"
          fill="#213F7D"
          opacity="0.4"
        />
      </svg>
    </div>
  );

  /* ------------------------------------------------------------------ */
  /*  Detail field                                                      */
  /* ------------------------------------------------------------------ */
  const DetailField = ({
    label,
    value,
  }: {
    label: string;
    value: string | undefined;
  }) => (
    <div className="user-details__field">
      <span className="user-details__field-label">{label}</span>
      <span className="user-details__field-value">{value || "-"}</span>
    </div>
  );

  /* ------------------------------------------------------------------ */
  /*  Loading state                                                     */
  /* ------------------------------------------------------------------ */
  if (loading) {
    return (
      <div className="user-details">
        <div className="user-details__loading">
          <div className="user-details__spinner" />
          <p>Loading user details...</p>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /*  Error state                                                       */
  /* ------------------------------------------------------------------ */
  if (error || !user) {
    return (
      <div className="user-details">
        <button
          className="user-details__back"
          onClick={() => navigate("/dashboard/users")}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.5 13L5.5 8L10.5 3"
              stroke="#545F7D"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Users
        </button>
        <div className="user-details__error">
          <p>{error || "User not found."}</p>
          <button
            className="user-details__error-btn"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /*  Monthly income display                                            */
  /* ------------------------------------------------------------------ */
  const monthlyIncomeDisplay =
    user.educationAndEmployment.monthlyIncome.length === 2
      ? `${user.educationAndEmployment.monthlyIncome[0]} - ${user.educationAndEmployment.monthlyIncome[1]}`
      : user.educationAndEmployment.monthlyIncome.join(", ");

  /* ------------------------------------------------------------------ */
  /*  Render                                                            */
  /* ------------------------------------------------------------------ */
  return (
    <div className="user-details">
      {/* Back button */}
      <button
        className="user-details__back"
        onClick={() => navigate("/dashboard/users")}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.5 13L5.5 8L10.5 3"
            stroke="#545F7D"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to Users
      </button>

      {/* Header */}
      <div className="user-details__header">
        <h1 className="user-details__title">User Details</h1>
        <div className="user-details__actions">
          <button className="user-details__btn user-details__btn--blacklist">
            BLACKLIST USER
          </button>
          <button className="user-details__btn user-details__btn--activate">
            ACTIVATE USER
          </button>
        </div>
      </div>

      {/* Profile card */}
      <div className="user-details__profile-card">
        <div className="user-details__profile-top">
          {/* Avatar + name */}
          <div className="user-details__profile-info">
            <AvatarPlaceholder />
            <div className="user-details__profile-name-group">
              <h2 className="user-details__profile-name">
                {user.personalInfo.fullName}
              </h2>
              <span className="user-details__profile-id">{user.id}</span>
            </div>
          </div>

          {/* Tier */}
          <div className="user-details__profile-tier">
            <span className="user-details__profile-tier-label">
              User's Tier
            </span>
            <StarRating tier={1} />
          </div>

          {/* Divider */}
          <div className="user-details__profile-divider" />

          {/* Account balance */}
          <div className="user-details__profile-balance">
            <span className="user-details__profile-balance-amount">
              ₦200,000.00
            </span>
            <span className="user-details__profile-balance-bank">
              9912345678/Providus Bank
            </span>
          </div>
        </div>

        {/* Tabs */}
        <nav className="user-details__tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`user-details__tab ${
                activeTab === tab ? "user-details__tab--active" : ""
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Details section */}
      {activeTab === "General Details" && (
        <div className="user-details__details-card">
          {/* Personal Information */}
          <section className="user-details__section">
            <h3 className="user-details__section-title">
              Personal Information
            </h3>
            <div className="user-details__fields">
              <DetailField
                label="FULL NAME"
                value={user.personalInfo.fullName}
              />
              <DetailField
                label="PHONE NUMBER"
                value={user.personalInfo.phoneNumber}
              />
              <DetailField
                label="EMAIL ADDRESS"
                value={user.personalInfo.email}
              />
              <DetailField label="BVN" value={user.personalInfo.bvn} />
              <DetailField label="GENDER" value={user.personalInfo.gender} />
              <DetailField
                label="MARITAL STATUS"
                value={user.personalInfo.maritalStatus}
              />
              <DetailField
                label="CHILDREN"
                value={user.personalInfo.children}
              />
              <DetailField
                label="TYPE OF RESIDENCE"
                value={user.personalInfo.typeOfResidence}
              />
            </div>
          </section>

          {/* Education and Employment */}
          <section className="user-details__section">
            <h3 className="user-details__section-title">
              Education and Employment
            </h3>
            <div className="user-details__fields">
              <DetailField
                label="LEVEL OF EDUCATION"
                value={user.educationAndEmployment.levelOfEducation}
              />
              <DetailField
                label="EMPLOYMENT STATUS"
                value={user.educationAndEmployment.employmentStatus}
              />
              <DetailField
                label="SECTOR OF EMPLOYMENT"
                value={user.educationAndEmployment.sectorOfEmployment}
              />
              <DetailField
                label="DURATION OF EMPLOYMENT"
                value={user.educationAndEmployment.durationOfEmployment}
              />
              <DetailField
                label="OFFICE EMAIL"
                value={user.educationAndEmployment.officeEmail}
              />
              <DetailField
                label="MONTHLY INCOME"
                value={monthlyIncomeDisplay}
              />
              <DetailField
                label="LOAN REPAYMENT"
                value={user.educationAndEmployment.loanRepayment}
              />
            </div>
          </section>

          {/* Socials */}
          <section className="user-details__section">
            <h3 className="user-details__section-title">Socials</h3>
            <div className="user-details__fields">
              <DetailField label="TWITTER" value={user.socials.twitter} />
              <DetailField label="FACEBOOK" value={user.socials.facebook} />
              <DetailField label="INSTAGRAM" value={user.socials.instagram} />
            </div>
          </section>

          {/* Guarantor */}
          <section className="user-details__section user-details__section--last">
            <h3 className="user-details__section-title">Guarantor</h3>
            <div className="user-details__fields">
              <DetailField
                label="FULL NAME"
                value={user.guarantor.fullName}
              />
              <DetailField
                label="PHONE NUMBER"
                value={user.guarantor.phoneNumber}
              />
              <DetailField
                label="EMAIL ADDRESS"
                value={user.guarantor.email}
              />
              <DetailField
                label="RELATIONSHIP"
                value={user.guarantor.relationship}
              />
            </div>
          </section>
        </div>
      )}

      {/* Placeholder for other tabs */}
      {activeTab !== "General Details" && (
        <div className="user-details__details-card">
          <div className="user-details__tab-placeholder">
            <p>{activeTab} content will be displayed here.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
