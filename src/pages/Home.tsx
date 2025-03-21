import React from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  useTheme,
} from '@mui/material';
import {
  Code as CodeIcon,
  Mic as MicIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      title: 'Code Editor',
      description: 'Write and execute code in real-time with syntax highlighting and multiple language support.',
      icon: <CodeIcon sx={{ fontSize: 40 }} />,
      path: '/code-editor',
    },
    {
      title: 'Voice Assistant',
      description: 'Interact with the application using voice commands and get spoken responses.',
      icon: <MicIcon sx={{ fontSize: 40 }} />,
      path: '/voice-assistant',
    },
    {
      title: 'Settings',
      description: 'Customize your experience with theme, language, and editor preferences.',
      icon: <SettingsIcon sx={{ fontSize: 40 }} />,
      path: '/settings',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 8, textAlign: 'center' }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            textFillColor: 'transparent',
          }}
        >
          Welcome to Igris
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Your all-in-one development environment with voice assistance
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ mb: 2, color: 'primary.main' }}>
                  {feature.icon}
                </Box>
                <Typography gutterBottom variant="h5" component="h2">
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(feature.path)}
                >
                  Try it now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home; 