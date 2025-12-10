import { useState, useEffect, useRef } from 'react';
import { getRandomMessage, GENERIC_LOADING_MESSAGES } from '../utils/loadingMessages';

/**
 * Hook that provides a rotating loading message
 * @param {string[]} messages - Array of messages to rotate through
 * @param {number} intervalMs - Time between message changes (default 2500ms)
 * @returns {string} Current loading message
 */
export function useLoadingMessage(messages = GENERIC_LOADING_MESSAGES, intervalMs = 2500) {
  // Start with a random message
  const [message, setMessage] = useState(() => getRandomMessage(messages));
  const usedIndices = useRef(new Set());

  useEffect(() => {
    // Reset used indices when messages change
    usedIndices.current = new Set();
    
    const interval = setInterval(() => {
      // If we've used all messages, reset the tracking
      if (usedIndices.current.size >= messages.length) {
        usedIndices.current = new Set();
      }
      
      // Pick a random message we haven't used recently
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * messages.length);
      } while (usedIndices.current.has(nextIndex) && usedIndices.current.size < messages.length);
      
      usedIndices.current.add(nextIndex);
      setMessage(messages[nextIndex]);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [messages, intervalMs]);

  return message;
}

export default useLoadingMessage;
