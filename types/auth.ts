export interface IAuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

export interface ILoginSuccessResponse {
  success: true;
  user: IAuthUser;
}

export interface IAuthErrorResponse {
  success: false;
  error: string;
}

export type ILoginResponse = ILoginSuccessResponse | IAuthErrorResponse;

export interface ISessionResponse {
  authenticated: boolean;
  user: IAuthUser | null;
}
