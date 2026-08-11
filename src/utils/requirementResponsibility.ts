export enum RequirementResponsibility {
  GRADUATE = 'GRADUATE',
  FACULTY = 'FACULTY',
  SECRETARIA_GENERAL = 'SECRETARIA_GENERAL',
}

export type RequirementResponsibilityEntry = {
  requestTypeId: number | null;
  requirementId: number | null;
  responsibility: RequirementResponsibility;
};

const requirementResponsibilityMap: RequirementResponsibilityEntry[] = [
  { requestTypeId: 2, requirementId: 1, responsibility: RequirementResponsibility.GRADUATE },
  { requestTypeId: 2, requirementId: 2, responsibility: RequirementResponsibility.GRADUATE },
  { requestTypeId: 2, requirementId: 3, responsibility: RequirementResponsibility.GRADUATE },
  { requestTypeId: 2, requirementId: 4, responsibility: RequirementResponsibility.GRADUATE },
  { requestTypeId: 2, requirementId: 5, responsibility: RequirementResponsibility.GRADUATE },
  { requestTypeId: 2, requirementId: 6, responsibility: RequirementResponsibility.GRADUATE },
  { requestTypeId: 2, requirementId: 7, responsibility: RequirementResponsibility.FACULTY },
  { requestTypeId: 2, requirementId: 8, responsibility: RequirementResponsibility.FACULTY },
  { requestTypeId: 2, requirementId: 9, responsibility: RequirementResponsibility.FACULTY },
  { requestTypeId: 2, requirementId: 10, responsibility: RequirementResponsibility.SECRETARIA_GENERAL },
  { requestTypeId: 2, requirementId: 11, responsibility: RequirementResponsibility.GRADUATE },
  { requestTypeId: 1, requirementId: 12, responsibility: RequirementResponsibility.SECRETARIA_GENERAL },
];

// Formulario de Solicitud de Titulo (4) y Formulario de expedicion de titulo (10)
// dejaron de pedirse como requisitos (feedback de negocio, 2026-08). Ya no se
// instancian en solicitudes nuevas (se quitaron de tipoSolicitudRequisito), pero
// solicitudes en curso creadas antes de este cambio pueden tener instancias viejas:
// se excluyen de listados/evaluaciones y de la logica de "esta todo completo" en
// todos lados donde se consultan requisitos.
export const REMOVED_REQUIREMENT_IDS = [4, 10];

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
