/**
 * Curated motivational, friendly, energetic, nature-inspired greetings for Sprout
 * Used during the animated "Meet Sprout" entrance experience.
 */
export const SPROUT_ENTRANCE_MESSAGES: string[] = [
  "The sun is shining and the breeze is calling! Let's step outside together!",
  "A deep breath of forest air makes everything better. Ready to explore?",
  "Put down the screen, stretch your legs, and let's go touch some grass!",
  "Nature is waiting with open branches! What will we discover today?",
  "Even five minutes outside can recharge your spirit. Let's do it!",
  "Leaves are rustling, birds are singing—your next adventure starts now!",
  "The best ideas happen under open skies. Let's take a stroll together!",
  "Fresh air, gentle sunlight, and calm minds. I'm so excited to see you!",
  "Step away from the scroll! The real world has so much beauty waiting for you.",
  "Let's trade blue light for golden sunlight! Ready to meet me in the grove?",
  "Every step in nature is a step toward peace. Let's walk and breathe!",
  "A little soil on your shoes is good for the soul. Let's explore together!",
  "Listen closely—the trees have stories to tell today. Let's go listen!",
  "No notifications out here, just fresh breezes and friendly leaves. Let's go!",
  "You deserve a peaceful moment with nature today. I'm right beside you!",
  "Look up at the clouds and let your mind wander! Nature is calling!",
  "The woods are greener when we explore them together. Let's get moving!",
  "Small steps outside lead to big smiles. Let's make today magical!",
];

let lastSelectedMessage: string | null = null;

/**
 * Selects a random Sprout entrance message ensuring it never repeats consecutively.
 */
export const getNextSproutMessage = (overridePrevious?: string): string => {
  const previous = overridePrevious !== undefined ? overridePrevious : lastSelectedMessage;
  const available = SPROUT_ENTRANCE_MESSAGES.filter((msg) => msg !== previous);
  const randomIndex = Math.floor(Math.random() * available.length);
  const chosen = available[randomIndex] || SPROUT_ENTRANCE_MESSAGES[0];
  lastSelectedMessage = chosen;
  return chosen;
};

/**
 * Resets the message memory (useful for testing).
 */
export const resetSproutMessageMemory = (): void => {
  lastSelectedMessage = null;
};
