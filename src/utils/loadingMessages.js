/**
 * Fun, cute loading messages for various contexts
 */

export const TASK_LOADING_MESSAGES = [
  "Waking up the task hamsters...",
  "Fetching challenges from the cloud...",
  "Gathering inspiration...",
  "Polishing the task gems...",
  "Summoning the task wizards...",
  "Loading amazing challenges...",
  "Brewing fresh tasks...",
  "Unpacking brain teasers...",
  "Dusting off the puzzle shelf...",
  "Herding digital cats...",
  "Consulting the oracle...",
  "Spinning up the challenge machine...",
  "Searching for exciting problems...",
  "Preparing your adventure...",
  "Rolling for initiative...",
  "Loading the good stuff...",
  "Calibrating difficulty meters...",
  "Warming up the neurons...",
  "Charging the creativity core...",
  "Assembling the quest board...",
];

export const GENERIC_LOADING_MESSAGES = [
  "Just a moment...",
  "Almost there...",
  "Loading the magic...",
  "Working on it...",
  "Hang tight...",
  "Getting things ready...",
];

export const MY_CHALLENGES_LOADING_MESSAGES = [
  "Gathering your conquests...",
  "Locating your adventures...",
  "Counting your victories...",
  "Rounding up your challenges...",
  "Retrieving your battle plans...",
  "Fetching your quest log...",
  "Loading your journey so far...",
  "Summoning your progress...",
  "Dusting off your trophy case...",
  "Assembling your achievements...",
];

export const TASK_DETAIL_LOADING_MESSAGES = [
  "Unwrapping this challenge...",
  "Fetching the details...",
  "Preparing the briefing...",
  "Loading the specifics...",
  "Getting the full story...",
  "Gathering intel...",
  "Reading the fine print...",
  "Assembling the facts...",
];

export const AUTH_LOADING_MESSAGES = [
  "Checking your credentials...",
  "Verifying your identity...",
  "Opening the portal...",
  "Rolling out the red carpet...",
  "Finding your profile...",
  "Preparing your workspace...",
  "Unlocking the gates...",
  "Waving you through...",
  "Confirming it's really you...",
  "Setting up your station...",
];

export const ADMIN_LOADING_MESSAGES = [
  "Crunching the numbers...",
  "Gathering insights...",
  "Fetching the stats...",
  "Counting all the things...",
  "Consulting the oracles...",
  "Running the analysis...",
  "Preparing your command center...",
  "Loading the control room...",
];

/**
 * Get a random message from an array
 */
export function getRandomMessage(messages = GENERIC_LOADING_MESSAGES) {
  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Get the next message in sequence (loops around)
 */
export function getNextMessage(messages, currentIndex) {
  const nextIndex = (currentIndex + 1) % messages.length;
  return { message: messages[nextIndex], index: nextIndex };
}
