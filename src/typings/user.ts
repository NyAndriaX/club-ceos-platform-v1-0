export type UserInput = {
  lastName: string;
  firstName: string;
  country: string;
  city: string;
  postCode: string;
  email: string;
  phoneNumber: string;
  linkedInUrl: string;
  jobTitle: string;
  companyName: string;
  commercialName: string;
  companyCountry: string;
  companyCity: string;
  companyPostCode: string;
  companyWebsite: string;
  companyLinkedInPage: string;
  companyPhoneNumber: string;
  revenue: number;
  planId?: number;
  bio?: string;
  profile?: string | null;
  isValidatedByAdmin?: boolean;
  isNew?: boolean;
  revenueFileUrl: string;
  customerId?: string;
  password?: string;
  newPassword?: string;
  confirmPassword?: string;
  subscriptionId?: number;
  currentPassword?: string;
};


export type UserOutput = {
  id: number;
  lastName: string;
  firstName: string;
  postCode: string;
  country: string;
  city: string;
  email: string;
  phoneNumber: string;
  linkedInUrl: string;
  jobTitle: string;
  companyName: string;
  commercialName: string;
  companyCountry: string;
  companyCity: string;
  companyPostCode: string;
  companyWebsite: string;
  companyLinkedInPage: string;
  companyPhoneNumber: string;
  revenue: number;
  isNew: boolean;
  bio?: string;
  profile?: string | null;
  revenueFileUrl: string;
  isValidatedByAdmin: boolean;
  customerId?: String;
  subscriptionId?: number;
  createdAt: Date;
  updatedAt: Date;
}