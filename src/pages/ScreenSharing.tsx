import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  Chip,
  IconButton,
  Divider,
  Tooltip,
  Alert,
} from '@mui/material';
import {
  ScreenShare as ScreenShareIcon,
  StopScreenShare as StopScreenShareIcon,
  ContentCopy as CopyIcon,
  People as PeopleIcon,
  Chat as ChatIcon,
  Code as CodeIcon,
  VideocamOff as VideocamOffIcon,
  Videocam as VideocamIcon,
  MicOff as MicOffIcon,
  Mic as MicIcon,
} from '@mui/icons-material';
import { VideoCameraIcon, PhoneIcon, MicrophoneIcon, XMarkIcon } from '@heroicons/react/24/solid';

const ScreenSharing: React.FC = () => {
  const [roomId, setRoomId] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const [copySuccess, setCopySuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [participantName, setParticipantName] = useState<string>('');
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Array<{author: string, text: string, time: string}>>([]);
  const [messageInput, setMessageInput] = useState<string>('');
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  
  // Generate a random room ID
  const generateRoomId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Create a new room
  const createRoom = () => {
    const newRoomId = generateRoomId();
    setRoomId(newRoomId);
    setIsHost(true);
    // Mock adding current user as a participant
    setParticipants(['You (Host)']);
  };

  // Join an existing room
  const joinRoom = () => {
    if (!roomId.trim()) {
      setErrorMessage('Please enter a valid room ID');
      return;
    }
    
    setErrorMessage(null);
    // In a real implementation, this would verify the room exists
    setParticipants(prev => [...prev, 'You']);
  };

  // Toggle screen sharing
  const toggleScreenSharing = async () => {
    if (!isSharing) {
      try {
        const mediaStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        
        if (screenVideoRef.current) {
          screenVideoRef.current.srcObject = mediaStream;
          screenVideoRef.current.onloadedmetadata = () => {
            screenVideoRef.current?.play();
          };
        }
        
        setIsSharing(true);

        // Listen for the end of screen sharing
        mediaStream.getVideoTracks()[0].onended = () => {
          stopSharing();
        };
      } catch (error) {
        console.error('Error sharing screen:', error);
        setErrorMessage('Failed to start screen sharing');
      }
    } else {
      if (screenVideoRef.current && screenVideoRef.current.srcObject) {
        const tracks = (screenVideoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        screenVideoRef.current.srcObject = null;
      }
      setIsSharing(false);
    }
  };

  // Toggle camera
  const toggleCamera = async () => {
    if (!isCameraOn) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream;
          localVideoRef.current.onloadedmetadata = () => {
            localVideoRef.current?.play();
          };
        }
        
        setIsCameraOn(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setErrorMessage('Failed to access camera');
      }
    } else {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const tracks = (localVideoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        localVideoRef.current.srcObject = null;
      }
      setIsCameraOn(false);
    }
  };

  // Toggle microphone
  const toggleMicrophone = async () => {
    if (!isMicOn) {
      try {
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setIsMicOn(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
        setErrorMessage('Failed to access microphone');
      }
    } else {
      setIsMicOn(false);
    }
  };

  // Copy room ID to clipboard
  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const stopSharing = () => {
    if (screenVideoRef.current && screenVideoRef.current.srcObject) {
      const tracks = (screenVideoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      screenVideoRef.current.srcObject = null;
    }
    setIsSharing(false);
  };

  const joinMeeting = () => {
    if (participantName.trim()) {
      setIsJoined(true);
      // Here you would typically connect to a video call service
    }
  };

  const sendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        author: participantName,
        text: messageInput,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, newMessage]);
      setMessageInput('');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Screen Sharing</h1>

      {!isJoined ? (
        <div className="bg-secondary-light rounded-lg shadow-lg p-6 max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4">Join Meeting</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">Your Name</label>
            <input
              type="text"
              className="w-full bg-secondary-dark text-white px-3 py-2 rounded border border-gray-700"
              placeholder="Enter your name"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-1">Meeting ID</label>
            <div className="flex">
              <input
                type="text"
                className="w-full bg-secondary-dark text-white px-3 py-2 rounded-l border border-gray-700"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter meeting ID"
                title="Meeting ID"
              />
              <button
                className="bg-secondary px-3 py-2 rounded-r border border-l-0 border-gray-700 hover:bg-gray-700"
                onClick={copyRoomId}
              >
                {copySuccess ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          <button
            className="w-full bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded font-medium"
            onClick={joinMeeting}
            disabled={!participantName.trim()}
          >
            Join Meeting
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-secondary-light rounded-lg shadow-lg overflow-hidden">
            <div className="bg-secondary px-4 py-2 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Meeting: {roomId}</h2>
              <div className="flex space-x-2">
                <button
                  className={`p-2 rounded ${isMicOn ? 'bg-green-600' : 'bg-gray-600'} hover:opacity-80`}
                  onClick={toggleMicrophone}
                  title={isMicOn ? "Mute microphone" : "Unmute microphone"}
                >
                  <MicrophoneIcon className="h-5 w-5 text-white" />
                </button>
                <button
                  className={`p-2 rounded ${isCameraOn ? 'bg-green-600' : 'bg-gray-600'} hover:opacity-80`}
                  onClick={toggleCamera}
                  title={isCameraOn ? "Turn off camera" : "Turn on camera"}
                >
                  <VideoCameraIcon className="h-5 w-5 text-white" />
                </button>
                <button
                  className={`p-2 rounded ${isSharing ? 'bg-red-600' : 'bg-primary'} hover:opacity-80`}
                  onClick={isSharing ? stopSharing : toggleScreenSharing}
                  title={isSharing ? "Stop sharing screen" : "Share screen"}
                >
                  {isSharing ? (
                    <XMarkIcon className="h-5 w-5 text-white" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  )}
                </button>
                <button
                  className="p-2 rounded bg-red-600 hover:bg-red-700"
                  onClick={() => setIsJoined(false)}
                  title="Leave meeting"
                >
                  <PhoneIcon className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
            <div className="relative bg-black aspect-video">
              {isSharing ? (
                <video
                  ref={screenVideoRef}
                  autoPlay
                  className="absolute inset-0 w-full h-full"
                />
              ) : (
                <div className="flex justify-center items-center h-full text-gray-500">
                  {isCameraOn ? (
                    <video
                      ref={localVideoRef}
                      autoPlay
                      muted
                      className="w-full h-full"
                    />
                  ) : (
                    <p>No active screen share</p>
                  )}
                </div>
              )}
              {isCameraOn && !isSharing && (
                <div className="absolute bottom-4 right-4 w-32 aspect-video rounded overflow-hidden border-2 border-white">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    className="w-full h-full"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-secondary-light rounded-lg shadow-lg flex flex-col h-[500px]">
            <div className="bg-secondary px-4 py-2">
              <h2 className="text-lg font-semibold">Chat</h2>
            </div>
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
              {chatMessages.length === 0 ? (
                <div className="text-center text-gray-500 my-8">
                  <p>No messages yet</p>
                  <p className="text-sm mt-2">Send a message to start the conversation</p>
                </div>
              ) : (
                chatMessages.map((msg, idx) => (
                  <div key={idx} className={`max-w-[80%] ${msg.author === participantName ? 'ml-auto' : ''}`}>
                    <div
                      className={`rounded-lg px-3 py-2 ${
                        msg.author === participantName
                          ? 'bg-primary text-white rounded-br-none'
                          : 'bg-secondary-dark text-white rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm font-medium">{msg.author}</p>
                      <p>{msg.text}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{msg.time}</p>
                  </div>
                ))
              )}
            </div>
            <div className="p-3 border-t border-gray-700">
              <div className="flex">
                <input
                  type="text"
                  className="flex-grow bg-secondary-dark text-white px-3 py-2 rounded-l border border-gray-700"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-r"
                  onClick={sendMessage}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Add missing components from Material UI
const List: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <Box component="ul" sx={{ padding: 0, margin: 0, listStyle: 'none' }}>
    {children}
  </Box>
);

const ListItem: React.FC<{children: React.ReactNode, key: number, sx?: any}> = ({ children, sx }) => (
  <Box component="li" sx={{ ...sx }}>
    {children}
  </Box>
);

const Avatar: React.FC<{children: React.ReactNode, sx?: any}> = ({ children, sx }) => (
  <Box sx={{ 
    width: 40, 
    height: 40, 
    borderRadius: '50%', 
    bgcolor: 'primary.main',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    ...sx
  }}>
    {children}
  </Box>
);

export default ScreenSharing; 