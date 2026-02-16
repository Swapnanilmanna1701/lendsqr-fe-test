import React, { useState, useRef, useEffect } from "react";
import type { FilterValues } from "../../types";
import "./FilterPopup.scss";

interface FilterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onFilter: (filters: FilterValues) => void;
  onReset: () => void;
  organizations: string[];
}

const FilterPopup: React.FC<FilterPopupProps> = ({
  isOpen,
  onClose,
  onFilter,
  onReset,
  organizations,
}) => {
  const [organization, setOrganization] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState("");

  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleReset = () => {
    setOrganization("");
    setUsername("");
    setEmail("");
    setDate("");
    setPhoneNumber("");
    setStatus("");
    onReset();
  };

  const handleFilter = () => {
    onFilter({
      organization: organization || undefined,
      username: username || undefined,
      email: email || undefined,
      date: date || undefined,
      phoneNumber: phoneNumber || undefined,
      status: status || undefined,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="filter-popup" ref={popupRef}>
      <div className="filter-popup__field">
        <label className="filter-popup__label">Organization</label>
        <select
          className="filter-popup__select"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
        >
          <option value="">Select</option>
          {organizations.map((org) => (
            <option key={org} value={org}>
              {org}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-popup__field">
        <label className="filter-popup__label">Username</label>
        <input
          className="filter-popup__input"
          type="text"
          placeholder="User"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="filter-popup__field">
        <label className="filter-popup__label">Email</label>
        <input
          className="filter-popup__input"
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="filter-popup__field">
        <label className="filter-popup__label">Date</label>
        <input
          className="filter-popup__input"
          type="date"
          placeholder="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="filter-popup__field">
        <label className="filter-popup__label">Phone Number</label>
        <input
          className="filter-popup__input"
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>

      <div className="filter-popup__field">
        <label className="filter-popup__label">Status</label>
        <select
          className="filter-popup__select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Select</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Pending">Pending</option>
          <option value="Blacklisted">Blacklisted</option>
        </select>
      </div>

      <div className="filter-popup__actions">
        <button
          className="filter-popup__btn filter-popup__btn--reset"
          onClick={handleReset}
        >
          Reset
        </button>
        <button
          className="filter-popup__btn filter-popup__btn--filter"
          onClick={handleFilter}
        >
          Filter
        </button>
      </div>
    </div>
  );
};

export default FilterPopup;
