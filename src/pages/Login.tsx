import React, { useState } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Link,
  IconButton,
  InputAdornment,
  Tabs,
  Tab,
  Alert,
  Grid,
  Checkbox,
  FormControlLabel,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Google as GoogleIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Login: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // Clear errors when switching tabs
    setLoginError(null);
    setRegisterError(null);
    setSuccessMessage(null);
  };
  
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError(null);
    
    // Validate email and password
    if (!loginEmail || !loginPassword) {
      setLoginError('Please enter both email and password');
      setIsSubmitting(false);
      return;
    }
    
    // Simple email validation
    if (!/\S+@\S+\.\S+/.test(loginEmail)) {
      setLoginError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }
    
    // Mock login API call
    setTimeout(() => {
      // Simulate successful login
      setIsSubmitting(false);
      setSuccessMessage('Login successful! Redirecting...');
      
      // In a real app, you would save the token and redirect the user
      setTimeout(() => {
        // Redirect after success message is shown
        window.location.href = '/';
      }, 1500);
    }, 1000);
  };
  
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setRegisterError(null);
    
    // Validate all fields
    if (!registerName || !registerEmail || !registerPassword || !confirmPassword) {
      setRegisterError('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }
    
    // Simple email validation
    if (!/\S+@\S+\.\S+/.test(registerEmail)) {
      setRegisterError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }
    
    // Password length check
    if (registerPassword.length < 8) {
      setRegisterError('Password must be at least 8 characters long');
      setIsSubmitting(false);
      return;
    }
    
    // Password match check
    if (registerPassword !== confirmPassword) {
      setRegisterError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }
    
    // Mock register API call
    setTimeout(() => {
      // Simulate successful registration
      setIsSubmitting(false);
      setSuccessMessage('Registration successful! Please check your email to verify your account.');
      
      // Clear form
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
      setConfirmPassword('');
      
      // Switch to login tab after successful registration
      setTimeout(() => {
        setTabValue(0);
        setSuccessMessage(null);
      }, 3000);
    }, 1000);
  };
  
  const handleSocialLogin = (provider: string) => {
    // In a real app, this would redirect to the OAuth provider
    console.log(`Logging in with ${provider}`);
    
    // Simulated success message
    setSuccessMessage(`Redirecting to ${provider} login...`);
    
    // Mock redirect
    setTimeout(() => {
      setSuccessMessage(null);
      // window.location.href = `/${provider.toLowerCase()}/auth`;
    }, 1500);
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Grid container spacing={4}>
        {/* Left side - Branding/Welcome message */}
        {!isSmallScreen && (
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '100%',
                p: 4,
              }}
            >
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                Welcome to Igris
              </Typography>
              
              <Typography variant="body1" color="text.secondary" paragraph>
                Your all-in-one coding and AI platform with powerful tools for developers.
              </Typography>
              
              <Box
                component="img"
                src="https://via.placeholder.com/400x300?text=Igris+Platform"
                alt="Igris Platform"
                sx={{
                  width: '100%',
                  borderRadius: 2,
                  boxShadow: 3,
                  mt: 2,
                }}
              />
            </Box>
          </Grid>
        )}
        
        {/* Right side - Auth form */}
        <Grid item xs={12} md={isSmallScreen ? 12 : 7}>
          <Paper 
            elevation={3}
            sx={{ 
              p: 4, 
              borderRadius: 2,
              boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" align="center" gutterBottom>
                {isSmallScreen && 'Welcome to Igris'}
              </Typography>
              <Typography variant="h5" gutterBottom>
                {tabValue === 0 ? 'Sign In' : 'Create Account'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {tabValue === 0 
                  ? 'Sign in to access your account and tools' 
                  : 'Register to start using Igris platform'}
              </Typography>
            </Box>
            
            <Tabs 
              value={tabValue} 
              onChange={handleChangeTab}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Sign In" />
              <Tab label="Sign Up" />
            </Tabs>
            
            {successMessage && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {successMessage}
              </Alert>
            )}
            
            <TabPanel value={tabValue} index={0}>
              {/* Sign In Form */}
              <form onSubmit={handleLoginSubmit}>
                {loginError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {loginError}
                  </Alert>
                )}
                
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  margin="normal"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Password"
                  variant="outlined"
                  margin="normal"
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={rememberMe} 
                        onChange={(e) => setRememberMe(e.target.checked)} 
                      />
                    }
                    label="Remember me"
                  />
                  
                  <Link href="#" variant="body2" underline="hover">
                    Forgot password?
                  </Link>
                </Box>
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={isSubmitting}
                  sx={{ mt: 2, mb: 2, py: 1.5 }}
                >
                  {isSubmitting ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              {/* Sign Up Form */}
              <form onSubmit={handleRegisterSubmit}>
                {registerError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {registerError}
                  </Alert>
                )}
                
                <TextField
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  margin="normal"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  margin="normal"
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Password"
                  variant="outlined"
                  margin="normal"
                  type={showPassword ? 'text' : 'password'}
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  helperText="Password must be at least 8 characters long"
                />
                
                <TextField
                  fullWidth
                  label="Confirm Password"
                  variant="outlined"
                  margin="normal"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <FormControlLabel
                  control={<Checkbox required />}
                  label={
                    <Typography variant="body2">
                      I agree to the <Link href="#" underline="hover">Terms of Service</Link> and <Link href="#" underline="hover">Privacy Policy</Link>
                    </Typography>
                  }
                  sx={{ mt: 1 }}
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={isSubmitting}
                  sx={{ mt: 2, mb: 2, py: 1.5 }}
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </TabPanel>
            
            <Divider sx={{ mt: 2, mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>
            
            {/* Social login buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={() => handleSocialLogin('Google')}
                sx={{ flexGrow: 1, borderRadius: 2 }}
              >
                Google
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<GitHubIcon />}
                onClick={() => handleSocialLogin('GitHub')}
                sx={{ flexGrow: 1, borderRadius: 2 }}
              >
                GitHub
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<LinkedInIcon />}
                onClick={() => handleSocialLogin('LinkedIn')}
                sx={{ flexGrow: 1, borderRadius: 2 }}
              >
                LinkedIn
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login; 