export interface ICheckInOutProps {
  action: 0 | 1;
}

export interface IUser {
  name: string;
  code?: string | undefined;
  lastAction?: number | undefined;
  lastActionTime: string | undefined;
  department?: string;
}

export interface IReason {
  label: string;
  value: number;
}

export interface IAppData {
  users: IUser[] | undefined;
  reasons: IReason[] | undefined;
}

export interface IFile {
  file: File | undefined;
  url: string | undefined;
}

export interface IError {
  error: boolean;
  message: string;
}

export interface IDRequest {
  method: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
  type?: 'USERS' | 'ACTIVITY';
  data?: any;
}

export interface IDResponse {
  code: number | string;
  message: string;
  data: any;
}
