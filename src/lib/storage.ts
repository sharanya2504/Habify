import { mockFriends } from "@/data/mockData";

const FRIENDS_KEY = "pethabit_friends_v1";

/**
 * Load friends from storage.
 * If first time, initialize with mockFriends.
 */
export const loadFriends = () => {
  try {
    const raw = localStorage.getItem(FRIENDS_KEY);

    // FIRST LOAD → initialize with mockFriends
    if (!raw) {
      localStorage.setItem(FRIENDS_KEY, JSON.stringify(mockFriends));
      return [...mockFriends];
    }

    // Already exists
    return JSON.parse(raw);
  } catch {
    return [...mockFriends];
  }
};

/**
 * Save a clean array into localStorage.
 */
export const saveFriends = (friendsArray: any[]) => {
  try {
    localStorage.setItem(FRIENDS_KEY, JSON.stringify(friendsArray));
  } catch {}
};

/**
 * Add a friend, but DO NOT overwrite or duplicate.
 */
export const addFriendToStorage = (newFriend: any) => {
  let friends = loadFriends();

  // Prevent duplicates
  const exists = friends.some((f: any) => f.id === newFriend.id);
  if (exists) return friends;

  const updated = [...friends, newFriend];
  saveFriends(updated);

  return updated;
};

/**
 * Remove friend by ID.
 */
export const removeFriendFromStorage = (id: number) => {
  const friends = loadFriends();
  const updated = friends.filter((f: any) => f.id !== id);

  saveFriends(updated);
  return updated;
};

/**
 * Hard reset (dev only)
 */
export const resetFriendsStorage = () => {
  saveFriends(mockFriends);
  return [...mockFriends];
};
