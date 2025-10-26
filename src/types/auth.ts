export interface AuthenticatedUser {
  id: number;
  username: string | null;
  roleId: number | null;
  personId: number | null;
}
