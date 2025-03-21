import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Avatar,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  ContentCopy as CopyIcon,
  MoreVert as MoreIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

// Define AI model types
type AIModel = 'claude' | 'chatgpt' | 'gemini' | 'deepseek';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  model?: AIModel;
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>('claude');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle model change
  const handleModelChange = (
    event: React.MouseEvent<HTMLElement>,
    newModel: AIModel,
  ) => {
    if (newModel !== null) {
      setSelectedModel(newModel);
    }
  };

  // Send message to AI
  const handleSendMessage = async () => {
    if (input.trim() === '') return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // In a real implementation, this would call your backend API
      const response = await fetch('http://localhost:5001/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          model: selectedModel,
        }),
      });
      
      // Mock response for now
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: `This is a sample response from the ${selectedModel} model. In a production environment, this would be integrated with the actual AI API.`,
          sender: 'ai',
          timestamp: new Date(),
          model: selectedModel,
        };
        
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  // Handle keyboard shortcut (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get avatar based on sender and model
  const getAvatar = (message: Message) => {
    if (message.sender === 'user') {
      return <Avatar><PersonIcon /></Avatar>;
    }
    
    // Different icons/colors based on AI model
    switch (message.model) {
      case 'claude':
        return <Avatar sx={{ bgcolor: '#5436DA' }}><BotIcon /></Avatar>;
      case 'chatgpt':
        return <Avatar sx={{ bgcolor: '#10A37F' }}><BotIcon /></Avatar>;
      case 'gemini':
        return <Avatar sx={{ bgcolor: '#1E88E5' }}><BotIcon /></Avatar>;
      case 'deepseek':
        return <Avatar sx={{ bgcolor: '#673AB7' }}><BotIcon /></Avatar>;
      default:
        return <Avatar><BotIcon /></Avatar>;
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          AI Assistant
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Chat with multiple AI models to get help with coding, problem-solving, and more.
        </Typography>
      </Box>
      
      {/* Model selector */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
        <Paper sx={{ p: 1 }}>
          <ToggleButtonGroup
            value={selectedModel}
            exclusive
            onChange={handleModelChange}
            aria-label="AI model selection"
          >
            <ToggleButton value="claude" aria-label="Claude">
              Claude
            </ToggleButton>
            <ToggleButton value="chatgpt" aria-label="ChatGPT">
              ChatGPT
            </ToggleButton>
            <ToggleButton value="gemini" aria-label="Gemini">
              Gemini
            </ToggleButton>
            <ToggleButton value="deepseek" aria-label="Deepseek">
              DeepSeek
            </ToggleButton>
          </ToggleButtonGroup>
        </Paper>
      </Box>
      
      {/* Chat messages */}
      <Paper 
        sx={{ 
          height: '60vh', 
          mb: 2, 
          p: 2, 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
          <List>
            {messages.map((message) => (
              <ListItem 
                key={message.id}
                alignItems="flex-start"
                sx={{ 
                  mb: 1,
                  flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                }}
              >
                {getAvatar(message)}
                <ListItemText
                  primary={
                    <Box 
                      sx={{ 
                        ml: message.sender === 'user' ? 0 : 2,
                        mr: message.sender === 'user' ? 2 : 0,
                        backgroundColor: message.sender === 'user' ? 'primary.dark' : 'grey.800',
                        p: 2,
                        borderRadius: 2,
                        display: 'inline-block',
                        maxWidth: '80%'
                      }}
                    >
                      <Typography variant="body1">
                        {message.text}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {message.timestamp.toLocaleTimeString()}
                        {message.model && ` • ${message.model}`}
                      </Typography>
                      {message.sender === 'ai' && (
                        <IconButton 
                          size="small" 
                          sx={{ ml: 1 }}
                          onClick={() => navigator.clipboard.writeText(message.text)}
                        >
                          <CopyIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
            {isLoading && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, m: 2 }}>
                <CircularProgress size={20} />
                <Typography variant="body2">{selectedModel} is thinking...</Typography>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </List>
        </Box>
      </Paper>
      
      {/* Input area */}
      <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={`Ask ${selectedModel} anything...`}
          multiline
          maxRows={4}
          variant="outlined"
        />
        <Button
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          onClick={handleSendMessage}
          disabled={isLoading || input.trim() === ''}
          sx={{ ml: 2, height: 56 }}
        >
          Send
        </Button>
      </Paper>
    </Container>
  );
};

export default AIChat; 