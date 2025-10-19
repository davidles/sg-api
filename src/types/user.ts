export interface UserAttributes {
  idUser: number;
  personId: number | null;
  username: string;
  accountType: string | null;
  password: string;
  roleId: number | null;
}

export type UserCreationAttributes = Omit<UserAttributes, 'idUser'>;
