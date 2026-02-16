import axios from 'axios';
import type { User, UserStatus } from '../types';

const API_BASE_URL =
  'https://6270020422c706a0ae70b72c.mockapi.io/lendsqr/api/v1';

/**
 * Deterministic hash from a string – produces a positive integer.
 * Used so that generated mock fields stay consistent across calls for
 * the same user id.
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

function pickFrom<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

/**
 * Maps a raw user object coming from the MockAPI endpoint to the
 * internal `User` type.  Fields that the API does not provide are
 * generated deterministically from the user id so the data is
 * consistent on every fetch.
 */
function mapApiUserToUser(apiUser: any): User {
  const id: string = String(apiUser.id);
  const seed = simpleHash(id);

  // ── Status ────────────────────────────────────────────────────
  const statuses: UserStatus[] = [
    'Active',
    'Inactive',
    'Pending',
    'Blacklisted',
  ];
  const status = pickFrom(statuses, seed);

  // ── Personal info ─────────────────────────────────────────────
  const genders = ['Male', 'Female'];
  const maritalStatuses = ['Single', 'Married', 'Divorced', 'Widowed'];
  const childrenOptions = ['None', '1', '2', '3', '4', '5+'];
  const residenceTypes = [
    "Parent's Apartment",
    'Personal Apartment',
    'Rented Apartment',
    'Shared Apartment',
  ];

  const personalInfo = {
    fullName: apiUser.userName || `User ${id}`,
    phoneNumber: apiUser.phoneNumber || `080${String(seed).padStart(8, '0').slice(0, 8)}`,
    email: apiUser.email || `user${id}@lendsqr.com`,
    bvn: String(seed).padStart(11, '0').slice(0, 11),
    gender: pickFrom(genders, seed),
    maritalStatus: pickFrom(maritalStatuses, seed + 1),
    children: pickFrom(childrenOptions, seed + 2),
    typeOfResidence: pickFrom(residenceTypes, seed + 3),
  };

  // ── Education & Employment ────────────────────────────────────
  const educationLevels = ['B.Sc', 'M.Sc', 'HND', 'PhD', 'OND'];
  const employmentStatuses = [
    'Employed',
    'Self-Employed',
    'Unemployed',
    'Student',
  ];
  const sectors = [
    'FinTech',
    'Agriculture',
    'Technology',
    'Education',
    'Healthcare',
    'Real Estate',
    'Oil and Gas',
    'Entertainment',
  ];
  const durations = [
    '1 year',
    '2 years',
    '3 years',
    '5 years',
    '10+ years',
  ];

  const lowerIncome = ((seed % 8) + 1) * 50000;
  const upperIncome = lowerIncome + ((seed % 5) + 1) * 100000;

  const educationAndEmployment = {
    levelOfEducation: pickFrom(educationLevels, seed + 4),
    employmentStatus: pickFrom(employmentStatuses, seed + 5),
    sectorOfEmployment: pickFrom(sectors, seed + 6),
    durationOfEmployment: pickFrom(durations, seed + 7),
    officeEmail: `office.${id}@lendsqr.com`,
    monthlyIncome: [
      `₦${lowerIncome.toLocaleString()}`,
      `₦${upperIncome.toLocaleString()}`,
    ],
    loanRepayment: `₦${((seed % 20) + 1) * 5000}`,
  };

  // ── Socials ───────────────────────────────────────────────────
  const handle =
    (apiUser.userName || `user${id}`).replace(/\s+/g, '').toLowerCase();

  const socials = {
    twitter: `@${handle}`,
    facebook: handle,
    instagram: `@${handle}`,
  };

  // ── Guarantor ─────────────────────────────────────────────────
  const firstNames = [
    'Adebayo',
    'Chinedu',
    'Funke',
    'Oluwaseun',
    'Ngozi',
    'Ibrahim',
    'Temitope',
    'Amara',
    'Emeka',
    'Yetunde',
  ];
  const lastNames = [
    'Okonkwo',
    'Adeyemi',
    'Balogun',
    'Nwosu',
    'Akinola',
    'Obi',
    'Mohammed',
    'Eze',
    'Okafor',
    'Adesanya',
  ];
  const relationships = [
    'Parent',
    'Sibling',
    'Friend',
    'Colleague',
    'Spouse',
  ];

  const guarantorFirst = pickFrom(firstNames, seed + 8);
  const guarantorLast = pickFrom(lastNames, seed + 9);

  const guarantor = {
    fullName: `${guarantorFirst} ${guarantorLast}`,
    phoneNumber: `081${String(seed + 99).padStart(8, '0').slice(0, 8)}`,
    email: `${guarantorFirst.toLowerCase()}.${guarantorLast.toLowerCase()}@gmail.com`,
    relationship: pickFrom(relationships, seed + 10),
  };

  // ── Assembled User ────────────────────────────────────────────
  return {
    id,
    orgName: apiUser.orgName || pickFrom(sectors, seed + 11),
    userName: apiUser.userName || `user${id}`,
    email: apiUser.email || personalInfo.email,
    phoneNumber: apiUser.phoneNumber || personalInfo.phoneNumber,
    createdAt: apiUser.createdAt || new Date().toISOString(),
    status,
    personalInfo,
    educationAndEmployment,
    socials,
    guarantor,
  };
}

/**
 * Fetch all users (the MockAPI endpoint returns up to 500 records).
 */
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data.map((user: any) => mapApiUserToUser(user));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Fetch a single user by their id.
 */
export const fetchUserById = async (id: string): Promise<User> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${id}`);
    return mapApiUserToUser(response.data);
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};
