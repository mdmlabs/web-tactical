export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
}

export interface AuthToken {
  digest: string;
  created: string;
  expiry: string;
  user: string;
}

export interface UserGroup {
  id: number;
  name: string;
  sites?: number[];
}
