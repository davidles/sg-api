export const mapRoleId = (rawRoleId: number | null | undefined): number | null => {
  if (rawRoleId === null || rawRoleId === undefined) {
    return null;
  }

  switch (rawRoleId) {
    case 1: // Administrador general
      return 300;
    case 2: // Administrativo Facultad
      return 200;
    case 3: // Egresado
      return 100;
    case 4: // Diplomado
      return 120;
    case 5: // Administrativo consultor
      return 210;
    default:
      return rawRoleId;
  }
};

export const isAdministrativeRole = (rawRoleId: number | null | undefined): boolean => {
  const normalized = mapRoleId(rawRoleId);
  return normalized !== null && normalized >= 200;
};
