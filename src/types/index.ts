export interface Skill {
  name: string;
  level: number;
}

export interface AiSuggestion {
  suggestion: string;
  priority: 'high' | 'medium' | 'low';
  category: 'skill' | 'technology' | 'practice';
} 