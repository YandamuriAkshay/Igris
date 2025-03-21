import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Alert,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Send as SendIcon,
  Stop as StopIcon,
  VolumeUp as VolumeUpIcon,
  RecordVoiceOver as RecordVoiceOverIcon,
  Psychology as PsychologyIcon,
  Hearing as HearingIcon,
  Translate as TranslateIcon,
  SettingsVoice as SettingsVoiceIcon,
} from '@mui/icons-material';

interface VoiceCommand {
  text: string;
  timestamp: number;
  type: 'user' | 'assistant';
}

interface SpeechRecognitionResult {
  transcript: string;
}

interface SpeechRecognitionEvent {
  results: {
    [key: number]: {
      [key: number]: SpeechRecognitionResult;
    };
    length: number;
    isFinal: boolean;
  };
  error?: string;
}

interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: { error: string }) => void;
}

interface VoiceSettings {
  pitch: number;
  rate: number;
  volume: number;
  voice: string;
}

declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
    SpeechSynthesisUtterance: new (text: string) => SpeechSynthesisUtterance;
  }
}

const VoiceAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [commands, setCommands] = useState<VoiceCommand[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [settings, setSettings] = useState<VoiceSettings>({
    pitch: 0.8, // Lower pitch for bass voice
    rate: 0.9,  // Slightly slower rate for bass voice
    volume: 1.0,
    voice: '',
  });
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [listeningMode, setListeningMode] = useState<'push-to-talk' | 'continuous'>('push-to-talk');
  const [transcript, setTranscript] = useState<string | null>(null);

  // Initialize voice synthesis and get available voices
  useEffect(() => {
    const synth = window.speechSynthesis;
    
    // Get available voices
    const loadVoices = () => {
      const voices = synth.getVoices();
      setAvailableVoices(voices);
      
      // Set a deep/bass voice by default if available
      const deepVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('male') || 
        voice.name.toLowerCase().includes('bass') ||
        voice.name.toLowerCase().includes('deep')
      );
      
      if (deepVoice) {
        setSettings(prev => ({ ...prev, voice: deepVoice.name }));
      } else if (voices.length > 0) {
        setSettings(prev => ({ ...prev, voice: voices[0].name }));
      }
    };
    
    // Chrome loads voices asynchronously
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
    
    loadVoices();
  }, []);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const results = event.results;
        const transcript = Object.values(results)
          .filter((result): result is { [key: number]: SpeechRecognitionResult } => 
            typeof result === 'object' && result !== null)
          .map(result => Object.values(result)[0].transcript)
          .join('');

        if (results.isFinal) {
          setCommands((prev: VoiceCommand[]) => [...prev, {
            text: transcript,
            timestamp: Date.now(),
            type: 'user'
          }]);
          handleVoiceCommand(transcript);
        }
      };

      recognition.onerror = (event: { error: string }) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setError('Speech recognition error occurred');
      };

      setRecognition(recognition);
    } else {
      setError('Speech recognition is not supported in your browser');
    }
  }, []);

  // Add a new useEffect to handle transcript changes
  useEffect(() => {
    if (transcript) {
      if (handleVoiceCommand) {
        handleVoiceCommand(transcript);
      }
    }
  }, [transcript]);

  const startListening = (): void => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
      setError(null);
    }
  };

  const stopListening = (): void => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleVoiceCommand = async (command: string): Promise<void> => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:5002/api/voice/process-command', {
        command,
      });

      const assistantResponse = response.data.response || "I'm sorry, I couldn't process that command.";
      
      setCommands((prev: VoiceCommand[]) => [...prev, {
        text: assistantResponse,
        timestamp: Date.now(),
        type: 'assistant'
      }]);

      // Use speech synthesis with custom voice settings
      speakResponse(assistantResponse);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to process voice command';
      setError(errorMessage);
      console.error('Error processing voice command:', errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Speak the response with the configured voice settings
  const speakResponse = (text: string) => {
    const utterance = new window.SpeechSynthesisUtterance(text);
    
    // Apply voice settings
    utterance.pitch = settings.pitch;
    utterance.rate = settings.rate;
    utterance.volume = settings.volume;
    
    // Set the selected voice
    if (settings.voice) {
      const selectedVoice = availableVoices.find(v => v.name === settings.voice);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }
    
    window.speechSynthesis.speak(utterance);
  };

  // Handle setting changes
  const handleSettingChange = (setting: keyof VoiceSettings, value: number | string) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
  };

  // Test current voice settings
  const testVoice = () => {
    speakResponse("Hello, I'm your voice assistant with a custom voice. How can I help you today?");
  };

  // Toggle listening mode
  const toggleListeningMode = () => {
    setListeningMode(prev => prev === 'push-to-talk' ? 'continuous' : 'push-to-talk');
    if (isListening) {
      stopListening();
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Voice Assistant
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          An intelligent assistant that can understand and respond to your voice commands.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper 
            sx={{ 
              p: 3, 
              display: 'flex', 
              flexDirection: 'column', 
              height: '70vh',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Voice command visualization - animated waves */}
            <Box 
              sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                height: '80px',
                background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 100%)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
              }}
            >
              {isListening && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  {[...Array(10)].map((_, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: '4px',
                        height: `${Math.random() * 40 + 10}px`,
                        backgroundColor: 'primary.main',
                        animation: `pulse 0.5s ease-in-out ${Math.random() * 0.5}s infinite alternate`,
                        '@keyframes pulse': {
                          '0%': {
                            height: '10px',
                          },
                          '100%': {
                            height: '50px',
                          },
                        },
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>

            {/* Commands list */}
            <Box sx={{ flexGrow: 1, overflow: 'auto', mt: 8, mb: 2 }}>
              <List>
                {commands.map((command, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      mb: 2,
                      display: 'flex',
                      flexDirection: command.type === 'user' ? 'row-reverse' : 'row',
                    }}
                  >
                    <Paper
                      sx={{
                        p: 2,
                        maxWidth: '80%',
                        bgcolor: command.type === 'user' ? 'primary.dark' : 'background.paper',
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="body1">
                        {command.text}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(command.timestamp).toLocaleTimeString()}
                      </Typography>
                    </Paper>
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* Mic button and controls */}
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                p: 2,
                borderTop: 1,
                borderColor: 'divider',
              }}
            >
              <Button
                variant={isListening ? 'contained' : 'outlined'}
                color={isListening ? 'error' : 'primary'}
                size="large"
                startIcon={isListening ? <StopIcon /> : <MicIcon />}
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing}
                sx={{ borderRadius: 28, px: 3 }}
              >
                {isListening ? 'Stop Listening' : 'Start Listening'}
              </Button>
              
              <Tooltip title="Voice Settings">
                <IconButton 
                  color="primary" 
                  onClick={() => setShowSettings(!showSettings)}
                  sx={{ ml: 2 }}
                >
                  <SettingsVoiceIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Settings card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <RecordVoiceOverIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Voice Settings
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={listeningMode === 'continuous'}
                      onChange={toggleListeningMode}
                      color="primary"
                    />
                  }
                  label="Continuous Listening"
                />
                <Typography variant="caption" color="text.secondary" display="block">
                  {listeningMode === 'continuous' 
                    ? 'Assistant will listen continuously until stopped' 
                    : 'Click to start and stop listening'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Voice</InputLabel>
                  <Select
                    value={settings.voice}
                    label="Voice"
                    onChange={(e) => handleSettingChange('voice', e.target.value)}
                  >
                    {availableVoices.map((voice, index) => (
                      <MenuItem key={index} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  <PsychologyIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Pitch (Bass - Treble)
                </Typography>
                <Slider
                  value={settings.pitch}
                  min={0.1}
                  max={2}
                  step={0.1}
                  onChange={(_, value) => handleSettingChange('pitch', value as number)}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => value.toFixed(1)}
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  <HearingIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Speed
                </Typography>
                <Slider
                  value={settings.rate}
                  min={0.5}
                  max={2}
                  step={0.1}
                  onChange={(_, value) => handleSettingChange('rate', value as number)}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => value.toFixed(1)}
                />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" gutterBottom>
                  <VolumeUpIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Volume
                </Typography>
                <Slider
                  value={settings.volume}
                  min={0}
                  max={1}
                  step={0.1}
                  onChange={(_, value) => handleSettingChange('volume', value as number)}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => (value * 100).toFixed(0) + '%'}
                />
              </Box>
              
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={testVoice}
                fullWidth
                startIcon={<VolumeUpIcon />}
              >
                Test Voice
              </Button>
            </CardContent>
          </Card>
          
          {/* Examples card */}
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TranslateIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Example Commands
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <List dense>
                <ListItem button onClick={() => handleVoiceCommand("What's the weather like today?")}>
                  <ListItemText primary="What's the weather like today?" />
                </ListItem>
                <ListItem button onClick={() => handleVoiceCommand("Tell me a joke")}>
                  <ListItemText primary="Tell me a joke" />
                </ListItem>
                <ListItem button onClick={() => handleVoiceCommand("How do I create a React component?")}>
                  <ListItemText primary="How do I create a React component?" />
                </ListItem>
                <ListItem button onClick={() => handleVoiceCommand("Set a timer for 5 minutes")}>
                  <ListItemText primary="Set a timer for 5 minutes" />
                </ListItem>
                <ListItem button onClick={() => handleVoiceCommand("Open the code editor")}>
                  <ListItemText primary="Open the code editor" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {isProcessing && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: 'background.paper',
            p: 2,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <CircularProgress size={20} />
          <Typography>Processing your command...</Typography>
        </Box>
      )}

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            position: 'fixed', 
            bottom: 20, 
            left: '50%', 
            transform: 'translateX(-50%)',
            maxWidth: '80%',
          }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}
    </Container>
  );
};

export default VoiceAssistant; 