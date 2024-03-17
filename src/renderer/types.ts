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
