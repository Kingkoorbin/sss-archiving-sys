export interface IProfile {
  user: string;
  firstName: string;
  lastName: string;
  birthdate: string;
  address: string;
  contactNumber: string;
  gender: string;
  refferedBy: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IRole {
  _id: string;
  user: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IUser {
  id: number;
  username: string;
  verified_at: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface IEmployeeRegistrationPayload {
  first_name: string;
  middle_name: string;
  last_name: string;
  present_address: string;
  permanent_address: string;
  department: string;
  birthdate: string; // Assuming date format is "YYYY-MM-DD"
  id: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone_number: string;
}

export interface IWorkHistory {
  id: number;
  client_id: number;
  company_name: string;
  position: string;
  start_date: string; // Assuming date format is "YYYY-MM-DD"
  end_date: string; // Assuming date format is "YYYY-MM-DD"
  responsibilities: string;
  created_at: string; // Assuming date-time format
  updated_at: string; // Assuming date-time format
}

export type IExperiencePayload = Pick<
  IWorkHistory,
  | 'client_id'
  | 'company_name'
  | 'position'
  | 'start_date'
  | 'end_date'
  | 'responsibilities'
>;

export interface IEmployeeProfile {
  id: number;
  school_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  present_address: string;
  permanent_address: string;
  phone_number: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  department: string;
  birthdate: string; // Assuming date format is "YYYY-MM-DD"
  active: boolean;
  created_at: string; // Assuming date-time format
  updated_at: string; // Assuming date-time format
  work_history: IWorkHistory[];
}

export interface ISearchPayload {
  role: string;
  searchKeyword?: string;
}

export interface IContribution {
  id: number;
  name: string;
  sbr_date: string | null;
  sbr_no: string | null;
  sss_no: string;
  ss: string;
  ec: string;
  total: string;
  created_at: string;
  updated_at: string;
}

export interface IGeneratePdfPayload {
  from?: string;
  to?: string;
  sssNo?: string;
  name?: string;
}

export interface ISBRPayload {
  sbr_date: string;
  sbr_no: string;
}

export interface IContributionRequest {
  id: number;
  editor: null | string;
  sss_no: string;
  name: string;
  date_of_employment: string;
  date_of_resignation: string;
  requester: string;
  email: string;
  phone_number: string;
  date_needed: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED'; // Adjust status values accordingly
  created_at: string;
  updated_at: string;
}
