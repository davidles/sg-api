export const REQUEST_DEADLINE_DAYS = 120;

// generatedAt viene como fecha (YYYY-MM-DD, sin hora) desde la base. Se calcula en
// UTC para no arrastrar corrimientos de zona horaria en el resultado.
export const calculateRequestDeadline = (generatedAt: string | null): string | null => {
  if (!generatedAt) {
    return null;
  }

  const startDate = new Date(`${generatedAt}T00:00:00Z`);

  if (Number.isNaN(startDate.getTime())) {
    return null;
  }

  startDate.setUTCDate(startDate.getUTCDate() + REQUEST_DEADLINE_DAYS);

  return startDate.toISOString().split('T')[0];
};

export const calculateDaysRemaining = (deadline: string | null): number | null => {
  if (!deadline) {
    return null;
  }

  const deadlineDate = new Date(`${deadline}T00:00:00Z`);
  const today = new Date();
  const todayUtc = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

  const diffMs = deadlineDate.getTime() - todayUtc.getTime();

  return Math.round(diffMs / (1000 * 60 * 60 * 24));
};
