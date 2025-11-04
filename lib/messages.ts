/**
 * Message management utilities using localStorage
 */

const MESSAGES_STORAGE_KEY = "zappmint_messages_available";

/**
 * Get the current number of messages available
 * Initializes with 10 messages if not set
 */
export function getMessagesAvailable(): number {
  if (typeof window === "undefined") return 10;

  const stored = localStorage.getItem(MESSAGES_STORAGE_KEY);
  if (!stored) {
    // Initialize with 10 messages if not set
    setMessagesAvailable(10);
    return 10;
  }

  try {
    const count = parseInt(stored, 10);
    // If somehow the value is invalid, initialize with 10
    if (isNaN(count) || count < 0) {
      setMessagesAvailable(10);
      return 10;
    }
    return count;
  } catch {
    // If parsing fails, initialize with 10
    setMessagesAvailable(10);
    return 10;
  }
}

/**
 * Set the number of messages available
 */
export function setMessagesAvailable(count: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(MESSAGES_STORAGE_KEY, count.toString());
}

/**
 * Add messages to the current count
 */
export function addMessages(count: number): void {
  const current = getMessagesAvailable();
  setMessagesAvailable(current + count);
}

/**
 * Decrement message count (use a message)
 */
export function useMessage(): boolean {
  const current = getMessagesAvailable();
  if (current > 0) {
    setMessagesAvailable(current - 1);
    return true;
  }
  return false;
}
