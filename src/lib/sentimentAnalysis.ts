// Simple sentiment analysis for feedback text

interface SentimentResult {
  score: number; // -1 to 1
  label: 'very negative' | 'negative' | 'neutral' | 'positive' | 'very positive';
  emoji: string;
}

const positiveWords = [
  'love', 'amazing', 'excellent', 'great', 'wonderful', 'fantastic', 'perfect',
  'best', 'awesome', 'beautiful', 'brilliant', 'outstanding', 'superb',
  'happy', 'pleased', 'satisfied', 'delighted', 'impressed', 'recommend',
  'professional', 'friendly', 'helpful', 'clean', 'comfortable', 'relaxing'
];

const negativeWords = [
  'hate', 'terrible', 'awful', 'bad', 'worst', 'horrible', 'disappointing',
  'poor', 'unprofessional', 'rude', 'dirty', 'uncomfortable', 'waiting',
  'expensive', 'overpriced', 'rushed', 'unfriendly', 'unhappy', 'dissatisfied'
];

const veryPositiveWords = [
  'incredible', 'exceptional', 'phenomenal', 'extraordinary', 'spectacular',
  'life-changing', 'transformed', 'miracle'
];

const veryNegativeWords = [
  'disgusting', 'appalling', 'nightmare', 'disaster', 'unacceptable'
];

export function analyzeSentiment(text: string): SentimentResult {
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  
  let score = 0;
  const wordCount = 0;

  // Check for very strong words
  veryPositiveWords.forEach(word => {
    if (lowerText.includes(word)) score += 2;
  });
  
  veryNegativeWords.forEach(word => {
    if (lowerText.includes(word)) score -= 2;
  });

  // Check for regular sentiment words
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) score += 1;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) score -= 1;
  });

  // Normalize score to -1 to 1 range
  const normalizedScore = Math.max(-1, Math.min(1, score / Math.max(5, words.length / 10)));

  // Determine label and emoji
  let label: SentimentResult['label'];
  let emoji: string;

  if (normalizedScore >= 0.5) {
    label = 'very positive';
    emoji = '😍';
  } else if (normalizedScore >= 0.1) {
    label = 'positive';
    emoji = '😊';
  } else if (normalizedScore >= -0.1) {
    label = 'neutral';
    emoji = '😐';
  } else if (normalizedScore >= -0.5) {
    label = 'negative';
    emoji = '😕';
  } else {
    label = 'very negative';
    emoji = '😞';
  }

  return { score: normalizedScore, label, emoji };
}
