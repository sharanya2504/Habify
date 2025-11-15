const USER_KEY = "pethabit_user_v1";

export const loadUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveUser = (user: any) => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {}
};
