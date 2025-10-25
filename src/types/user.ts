export interface UserAttributes {
  idUser: number;
  personId: number | null;
  username: string;
  accountType: 'ACTIVA' | 'INACTIVA';
  password: string;
  roleId: number;
}

export type UserCreationAttributes = Omit<UserAttributes, 'idUser'>;
