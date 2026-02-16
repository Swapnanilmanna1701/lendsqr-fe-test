export interface PersonalInfo {
  fullName: string;
  phoneNumber: string;
  email: string;
  bvn: string;
  gender: string;
  maritalStatus: string;
  children: string;
  typeOfResidence: string;
}

export interface EducationAndEmployment {
  levelOfEducation: string;
  employmentStatus: string;
  sectorOfEmployment: string;
  durationOfEmployment: string;
  officeEmail: string;
  monthlyIncome: string[];
  loanRepayment: string;
}

export interface Socials {
  twitter: string;
  facebook: string;
  instagram: string;
}

export interface Guarantor {
  fullName: string;
  phoneNumber: string;
  email: string;
  relationship: string;
}

export type UserStatus = "Active" | "Inactive" | "Pending" | "Blacklisted";

export interface User {
  id: string;
  orgName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  status: UserStatus;
  personalInfo: PersonalInfo;
  educationAndEmployment: EducationAndEmployment;
  socials: Socials;
  guarantor: Guarantor;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  usersWithLoans: number;
  usersWithSavings: number;
}

export interface FilterValues {
  organization?: string;
  username?: string;
  email?: string;
  date?: string;
  phoneNumber?: string;
  status?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}
