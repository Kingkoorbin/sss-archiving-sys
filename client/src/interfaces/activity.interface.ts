import { IUser } from './client.interface';

export interface IActivity {
  id: number;
  action_name: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  user: IUser;
}

export interface IPaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface IGetActivityPayload {
  page: number;
  limit: number;
}

export interface IPaginationResponse {
  current_page: number;
  data: IActivity[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: IPaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}
