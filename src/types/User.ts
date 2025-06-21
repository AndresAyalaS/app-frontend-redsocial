export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  alias: string;
  birth_date: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends AuthCredentials {
  firstName: string;
  lastName: string;
  alias: string;
  birthDate: string;
}

