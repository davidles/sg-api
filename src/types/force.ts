export interface ForceAttributes {
  idForce: number;
  forceName: string | null;
}

export type ForceCreationAttributes = Omit<ForceAttributes, 'idForce'>;
