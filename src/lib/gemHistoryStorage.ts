const KEY = "pethabit_gem_history_v1";

export const loadGemHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
};

export const pushGemEvent = (action: string, gems: number) => {
  const existing = loadGemHistory();
  const entry = {
    action,
    gems,
    time: new Date().toISOString(),
  };
  const updated = [entry, ...existing];

  localStorage.setItem(KEY, JSON.stringify(updated));
};
