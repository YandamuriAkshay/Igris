import React, { useState } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import {
  AutoAwesome as AIIcon,
  Task as TaskIcon,
  ContentCopy as CopyIcon,
  Save as SaveIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Code as CodeIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

// Define task categories
const taskCategories = [
  { id: 'coding', name: 'Coding Tasks', icon: <CodeIcon /> },
  { id: 'writing', name: 'Writing Tasks', icon: <DescriptionIcon /> },
  { id: 'planning', name: 'Planning Tasks', icon: <ScheduleIcon /> },
  { id: 'research', name: 'Research Tasks', icon: <AssignmentIcon /> },
];

// Define task examples
const taskExamples = {
  coding: [
    'Write a function to find the longest palindrome in a string',
    'Create a React component for a pagination system',
    'Implement a binary search tree in JavaScript',
  ],
  writing: [
    'Write a product description for a smart watch',
    'Draft an email announcing a new feature to customers',
    'Create a blog post about AI in modern applications',
  ],
  planning: [
    'Create a project timeline for an app development project',
    'Design a marketing campaign schedule for a product launch',
    'Develop a study plan for learning TypeScript',
  ],
  research: [
    'Compare top 3 frameworks for building mobile apps',
    'Research best practices for API security',
    'Find the most efficient algorithms for graph traversal',
  ],
};

interface TaskResult {
  id: string;
  task: string;
  solution: string;
  date: Date;
  category: string;
}

const TaskSolver: React.FC = () => {
  const [task, setTask] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('coding');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResult, setCurrentResult] = useState<TaskResult | null>(null);
  const [savedResults, setSavedResults] = useState<TaskResult[]>([]);
  
  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };
  
  // Handle example selection
  const handleExampleSelect = (example: string) => {
    setTask(example);
  };
  
  // Process task with AI
  const handleSolveTask = async () => {
    if (task.trim() === '') return;
    
    setIsProcessing(true);
    
    try {
      // Mock API call - in production, this would call your backend
      setTimeout(() => {
        const result: TaskResult = {
          id: Date.now().toString(),
          task,
          solution: generateMockSolution(task, selectedCategory),
          date: new Date(),
          category: selectedCategory,
        };
        
        setCurrentResult(result);
        setIsProcessing(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error solving task:', error);
      setIsProcessing(false);
    }
  };
  
  // Generate a mock solution based on task and category
  const generateMockSolution = (taskText: string, category: string): string => {
    const solutions = {
      coding: `\`\`\`javascript
function solveCodingTask(input) {
  // AI-generated solution for: "${taskText}"
  console.log("Processing task...");
  
  // Example implementation
  const result = input.split('').reverse().join('');
  return result;
}

// Example usage
const output = solveCodingTask("input");
console.log(output);
\`\`\`

**Explanation:**
This solution implements a basic algorithm to solve the task. For a more efficient approach, consider using dynamic programming or a specialized data structure.`,

      writing: `**AI-Generated Content for: "${taskText}"**

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Key points:
1. Focus on clear, concise language
2. Target the appropriate audience
3. Include relevant details and call-to-action
4. Maintain a consistent tone throughout

Feel free to adapt this template to your specific needs and brand voice.`,

      planning: `**Task Planning for: "${taskText}"**

### Timeline:
1. **Week 1:** Research and preliminary planning
   - Market analysis
   - Requirement gathering
   - Resource allocation

2. **Week 2-3:** Development phase
   - Implementation of core features
   - Regular testing cycles
   - Stakeholder reviews

3. **Week 4:** Finalization
   - Final testing
   - Documentation
   - Deployment preparation

4. **Post-launch:**
   - Monitoring
   - Feedback collection
   - Iterative improvements

**Resource Allocation:**
- Human resources: 3 developers, 1 designer, 1 project manager
- Budget allocation: $X,XXX (breakdown available upon request)
- Tools: Recommended project management software - Asana, Jira, Trello`,

      research: `**Research Results for: "${taskText}"**

### Summary of Findings:
Based on comprehensive analysis across multiple sources, these are the key insights:

1. **Primary Finding:**
   - Data point 1
   - Data point 2
   - Statistical significance: 95% confidence interval

2. **Comparative Analysis:**
   | Option | Pros | Cons | Overall Rating |
   |--------|------|------|----------------|
   | A      | Fast, reliable | Expensive | 8/10 |
   | B      | Affordable, flexible | Slower performance | 7/10 |
   | C      | Feature-rich | Complex setup | 7.5/10 |

3. **Recommendations:**
   - Consider option A if budget allows
   - Option B represents the best value proposition
   - Further research recommended on emerging alternative D

**Sources consulted:** Academic journals, industry reports, expert interviews, and statistical analyses of market data.`
    };
    
    return solutions[category as keyof typeof solutions] || "Solution not available for this category.";
  };
  
  // Save current result
  const handleSaveResult = () => {
    if (currentResult) {
      setSavedResults(prev => [currentResult, ...prev]);
    }
  };
  
  // Copy solution to clipboard
  const handleCopySolution = () => {
    if (currentResult) {
      navigator.clipboard.writeText(currentResult.solution);
    }
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          AI Task Solver
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Describe any task and let AI generate a complete solution for you.
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Describe Your Task
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Select a category:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {taskCategories.map((category) => (
                  <Chip
                    key={category.id}
                    icon={category.icon}
                    label={category.name}
                    onClick={() => handleCategorySelect(category.id)}
                    color={selectedCategory === category.id ? 'primary' : 'default'}
                    variant={selectedCategory === category.id ? 'filled' : 'outlined'}
                    sx={{ mb: 1 }}
                  />
                ))}
              </Box>
            </Box>
            
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Describe your task in detail"
              variant="outlined"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="E.g., Write a function to find duplicates in an array"
              sx={{ mb: 2 }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AIIcon />}
                onClick={handleSolveTask}
                disabled={isProcessing || task.trim() === ''}
              >
                {isProcessing ? 'Processing...' : 'Solve Task'}
              </Button>
              
              {isProcessing && <CircularProgress size={24} sx={{ ml: 2 }} />}
            </Box>
          </Paper>
          
          {/* Example tasks */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Example Tasks
            </Typography>
            
            <List>
              {taskExamples[selectedCategory as keyof typeof taskExamples].map((example, index) => (
                <React.Fragment key={index}>
                  <ListItem button onClick={() => handleExampleSelect(example)}>
                    <ListItemText primary={example} />
                  </ListItem>
                  {index < taskExamples[selectedCategory as keyof typeof taskExamples].length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          {/* Saved results */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Saved Solutions
            </Typography>
            
            {savedResults.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                No saved solutions yet. Solve a task and save it to see it here.
              </Typography>
            ) : (
              <List sx={{ maxHeight: '300px', overflow: 'auto' }}>
                {savedResults.map((result) => (
                  <ListItem 
                    key={result.id}
                    button
                    onClick={() => setCurrentResult(result)}
                    sx={{ 
                      bgcolor: currentResult?.id === result.id ? 'action.selected' : 'transparent',
                      borderRadius: 1,
                      mb: 1
                    }}
                  >
                    <ListItemText 
                      primary={result.task.length > 50 ? `${result.task.substring(0, 50)}...` : result.task}
                      secondary={`${new Date(result.date).toLocaleDateString()} • ${taskCategories.find(c => c.id === result.category)?.name}`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
          
          {/* Task categories */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Task Categories
            </Typography>
            
            <Grid container spacing={2}>
              {taskCategories.map((category) => (
                <Grid item xs={6} key={category.id}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      bgcolor: selectedCategory === category.id ? 'primary.dark' : 'background.paper',
                      transition: 'all 0.2s'
                    }}
                  >
                    <CardActionArea onClick={() => handleCategorySelect(category.id)}>
                      <CardContent sx={{ textAlign: 'center', p: 2 }}>
                        <Box sx={{ mb: 1 }}>
                          {category.icon}
                        </Box>
                        <Typography variant="body2">
                          {category.name}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
        
        {/* Result display */}
        {currentResult && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Solution
                </Typography>
                
                <Box>
                  <Button 
                    startIcon={<CopyIcon />} 
                    onClick={handleCopySolution} 
                    sx={{ mr: 1 }}
                  >
                    Copy
                  </Button>
                  <Button 
                    startIcon={<SaveIcon />} 
                    onClick={handleSaveResult}
                    disabled={savedResults.some(r => r.id === currentResult.id)}
                  >
                    {savedResults.some(r => r.id === currentResult.id) ? 'Saved' : 'Save'}
                  </Button>
                </Box>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Task:
                </Typography>
                <Typography variant="body1">
                  {currentResult.task}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Solution:
                </Typography>
                <Box 
                  sx={{ 
                    p: 2, 
                    bgcolor: 'grey.900', 
                    borderRadius: 1,
                    overflow: 'auto',
                    maxHeight: '500px',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace'
                  }}
                >
                  <div dangerouslySetInnerHTML={{ __html: formatSolution(currentResult.solution) }} />
                </Box>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

// Helper function to format solution text with markdown-like syntax
const formatSolution = (text: string): string => {
  // Replace code blocks
  let formatted = text.replace(/```([\s\S]*?)```/g, '<pre class="code-block">$1</pre>');
  
  // Replace bold text
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Replace lists
  formatted = formatted.replace(/^(\d+\.\s.*?)$/gm, '<li>$1</li>');
  
  // Replace headers
  formatted = formatted.replace(/^#{3}\s(.*?)$/gm, '<h3>$1</h3>');
  formatted = formatted.replace(/^#{2}\s(.*?)$/gm, '<h2>$1</h2>');
  formatted = formatted.replace(/^#{1}\s(.*?)$/gm, '<h1>$1</h1>');
  
  return formatted;
};

export default TaskSolver; 