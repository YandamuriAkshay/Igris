import { Skill, AiSuggestion } from '../types';

export const analyzeSkills = async (skills: Skill[]): Promise<AiSuggestion[]> => {
  // Simulate API call to AI service
  await new Promise(resolve => setTimeout(resolve, 1000));

  const suggestions: AiSuggestion[] = [];

  // Analyze current skills
  const skillNames = skills.map(s => s.name.toLowerCase());
  const skillLevels = skills.reduce((acc, skill) => {
    acc[skill.name.toLowerCase()] = skill.level;
    return acc;
  }, {} as Record<string, number>);

  // Check for missing essential skills
  const essentialSkills = ['typescript', 'react', 'node.js', 'python', 'aws'];
  essentialSkills.forEach(skill => {
    if (!skillNames.includes(skill)) {
      suggestions.push({
        suggestion: `Consider adding ${skill.toUpperCase()} to your skillset`,
        priority: 'high',
        category: 'skill'
      });
    }
  });

  // Check skill levels
  Object.entries(skillLevels).forEach(([skill, level]) => {
    if (level < 70) {
      suggestions.push({
        suggestion: `Your ${skill.toUpperCase()} skills could be improved (currently at ${level}%)`,
        priority: 'medium',
        category: 'practice'
      });
    }
  });

  // Suggest new technologies
  const emergingTech = ['docker', 'kubernetes', 'graphql', 'next.js'];
  emergingTech.forEach(tech => {
    if (!skillNames.includes(tech)) {
      suggestions.push({
        suggestion: `Consider learning ${tech.toUpperCase()} for modern development`,
        priority: 'medium',
        category: 'technology'
      });
    }
  });

  // Sort suggestions by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return suggestions;
}; 