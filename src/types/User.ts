export interface LoginResponse {
  token: string;
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