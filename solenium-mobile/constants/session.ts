// Persistent session store for the Solenium Prototype
// Using a global-ish state to ensure it survives stack resets during navigation

let currentUserId: string | null = null;
let hasRegisteredThisSession = false;

export const SessionManager = {
  getUserId: () => currentUserId,
  setUserId: (id: string | null) => {
    currentUserId = id;
    if (id) hasRegisteredThisSession = true; // Once we have a user, we consider the app "Past the door"
  },
  isInitialized: () => hasRegisteredThisSession,
  setRegistered: () => {
    hasRegisteredThisSession = true;
  },
  clear: () => {
    currentUserId = null;
    hasRegisteredThisSession = false;
  }
};
