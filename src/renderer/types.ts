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

export interface IFile {
  file: File | undefined;
  url: string | undefined;
}

export interface IError {
  error: boolean;
  message: string;
}
