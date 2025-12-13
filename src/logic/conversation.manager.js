const userStates = {};

/**
 * get user state
 * @param {number} userId
 */
export function getUserState(userId) {
  if (!userStates[userId]) {
    userStates[userId] = {};
  }
  return userStates[userId];
}

/**
 * update user state
 * @param {number} userId
 * @param {object} newState
 */
export function updateUserState(userId, newState) {
  userStates[userId] = { ...getUserState(userId), ...newState };
}

/**
 * clear user state (after booking)
 * @param {number} userId
 */
export function clearUserState(userId) {
  delete userStates[userId];
}
