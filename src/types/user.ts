// src/types/user.ts
export interface BaseUser {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  contact_number: string;
  image?: string | null;

  createdDate?: string;
  createdTime?: string;
  updatedDate?: string;
  updatedTime?: string;
}

export interface ClientProgram {
  id: number;
  name: string;
  description: string;
  image?: string | null;
}

export interface Client extends BaseUser {
  program_id: number;
  program?: ClientProgram;
  student_id: string;
  year_level: number;
  qr_string: string;
  qr_image?: string | null;
  remaining_votes: number;
  total_votes_purchased: number;
  id_picture?: string | null;
  is_active: boolean;
}

export interface AuthUser {
  role: 'admin' | 'client';
  token: string;
  user: BaseUser | Client;
}
