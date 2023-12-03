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

  user_permissions: IUserPermission[]
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

  suffix: string;
  blood_type: string;
  civil_status: string;
  school_id: string;
  email: string;
  sss_no: string;
  philhealth_no: string;
  pagibig_no: string;
  bpi_atm_account_no: string;
  tin: string;
  rvm_retirement_no: string;
  date_hired: string;
  date_resigned: string;
  personnel_category: string;
  main_employer: string;
  address: string;
}

export interface IWorkHistory {
  id: number;
  client_id: number;
  company_name: string;
  position: string;
  start_date: string; // Assuming date format is "YYYY-MM-DD"
  end_date: string; // Assuming date format is "YYYY-MM-DD"
  duration: string; 
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
  | 'duration'
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
  birthdate: string; // Assuming the date format is always "YYYY-MM-DD"
  active: boolean;
  personnel_category: string;
  suffix: string;
  civil_status: string;
  blood_type: string;
  email: string;
  tin: string | null;
  sss_no: string | null;
  philhealth_no: string | null;
  pagibig_no: string | null;
  rvm_retirement_no: string | null;
  bpi_atm_account_no: string | null;
  date_hired: string; // Assuming the date format is always "YYYY-MM-DD"
  date_resigned: string | null; // Assuming the date format is always "YYYY-MM-DD" | null
  main_employer: string;
  address: string;
  created_at: string; // Assuming date-time format
  updated_at: string; // Assuming date-time format
  work_history: IWorkHistory[];
}

export interface IPermission {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface IUserPermission {
  id: number;
  user_id: number;
  permission_name_id: number;
  created_at: string;
  updated_at: string;
  permission_name: IPermission
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
  searchKeyword?: string;
}

export interface ISBRPayload {
  sbr_date: string;
  sbr_no: string;
}

export interface IContributionRequest {
  id: number;
  editor: null | string;
  sss_no: string;
  all: boolean;
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
