export enum RequirementResponsibility {
  GRADUATE = 'GRADUATE',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
}

export type RequirementResponsibilityEntry = {
  requestTypeId: number | null;
  requirementId: number | null;
  responsibility: RequirementResponsibility;
};

// Mapa inicial basado en la tabla `requisito` y tu aclaración.
// requestTypeId=2 se corresponde con el tipo de solicitud de título actual.
// - Requisitos 1-6,8,9,11: egresado
// - Requisitos 7 y 10: administrativo
const requirementResponsibilityMap: RequirementResponsibilityEntry[] = [
  { requestTypeId: 2, requirementId: 1, responsibility: RequirementResponsibility.GRADUATE },
  { requestTypeId: 2, requirementId: 2, responsibility: RequirementResponsibility.GRADUATE },
  { requestTypeId: 2, requirementId: 3, responsibility: RequirementResponsibility.GRADUATE },
  { requestTypeId: 2, requirementId: 4, responsibility: RequirementResponsibility.GRADUATE },
  { requestTypeId: 2, requirementId: 5, responsibility: RequirementResponsibility.GRADUATE },
  { requestTypeId: 2, requirementId: 6, responsibility: RequirementResponsibility.GRADUATE },
  { requestTypeId: 2, requirementId: 7, responsibility: RequirementResponsibility.ADMINISTRATIVE },
  { requestTypeId: 2, requirementId: 8, responsibility: RequirementResponsibility.GRADUATE },
  { requestTypeId: 2, requirementId: 9, responsibility: RequirementResponsibility.GRADUATE },
  { requestTypeId: 2, requirementId: 10, responsibility: RequirementResponsibility.ADMINISTRATIVE },
  { requestTypeId: 2, requirementId: 11, responsibility: RequirementResponsibility.GRADUATE },
];

export const findResponsibility = (
  entries: RequirementResponsibilityEntry[],
  requestTypeId: number | null,
  requirementId: number | null,
): RequirementResponsibility | null => {
  if (!requirementId) {
    return null;
  }

  // Intentar coincidencia exacta requestTypeId + requirementId
  const exact = entries.find(
    (entry) =>
      entry.requirementId === requirementId &&
      (entry.requestTypeId === null || entry.requestTypeId === requestTypeId),
  );

  if (exact) {
    return exact.responsibility;
  }

  // Fallback: buscar solo por requirementId
  const byRequirementOnly = entries.find((entry) => entry.requirementId === requirementId);

  return byRequirementOnly?.responsibility ?? null;
};

export default requirementResponsibilityMap;
