// src/lib/storage.ts
const FRIENDS_KEY = "pethabit_friends_v1";

export const getStoredFriends = () => {
  try {
    const raw = localStorage.getItem(FRIENDS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const storeFriends = (friends: any[]) => {
  try {
    localStorage.setItem(FRIENDS_KEY, JSON.stringify(friends));
  } catch {}
};
