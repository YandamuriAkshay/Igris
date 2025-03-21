import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import {
  UserIcon,
  PencilIcon,
  LockClosedIcon,
  BellIcon,
  CodeBracketIcon,
  CameraIcon,
  Cog6ToothIcon,
  TrashIcon,
  CloudArrowUpIcon,
  ClockIcon,
  StarIcon,
  EllipsisVerticalIcon,
  EnvelopeIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { getAriaChecked, getAriaSelected } from '../utils/aria';
import { useAriaAttributes } from '../hooks/useAriaAttributes';
import { analyzeSkills } from '../services/aiService';
import { Skill, AiSuggestion } from '../types';

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
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div className="py-3">
          {children}
        </div>
      )}
    </div>
  );
}

// Mock user data
const mockUserData = {
  id: '123456',
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'Developer',
  bio: 'Full-stack developer with a passion for AI and machine learning. Building tools that make developers more productive.',
  location: 'San Francisco, CA',
  joinDate: new Date('2023-06-15'),
  avatarUrl: 'https://via.placeholder.com/150',
  githubUsername: 'johndoe',
  twitterUsername: 'johndoe',
  linkedinUrl: 'linkedin.com/in/johndoe',
  website: 'johndoe.dev',
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Machine Learning'],
  stats: {
    projects: 12,
    contributions: 156,
    followers: 48,
    following: 72,
  },
  notifications: {
    email: true,
    push: true,
    newsletter: false,
    updates: true,
  },
  recentActivity: [
    { id: 1, type: 'code', title: 'Created a React component', date: new Date('2023-10-15'), description: 'Built a reusable data table component with sorting and filtering' },
    { id: 2, type: 'app', title: 'Generated a new app', date: new Date('2023-10-10'), description: 'Created a new music player app using the App Builder' },
    { id: 3, type: 'code', title: 'Fixed a bug in CodeEditor', date: new Date('2023-10-05'), description: 'Fixed syntax highlighting issue for Python code' },
  ]
};

interface ToggleButtonProps {
  isEnabled: boolean;
  onChange: () => void;
  label: string;
  disabled?: boolean;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ isEnabled, onChange, label, disabled }) => {
  const ariaAttributes = useAriaAttributes({
    isEnabled,
    label: `Toggle ${label}`,
  });

  return (
    <button
      type="button"
      onClick={onChange}
      className="toggle-button"
      disabled={disabled}
      {...ariaAttributes}
    />
  );
};

interface TabButtonProps {
  isSelected: boolean;
  onClick: () => void;
  controls: string;
  icon: React.ReactNode;
  label: string;
  id: string;
}

const TabButton: React.FC<TabButtonProps> = ({ isSelected, onClick, controls, icon, label, id }) => {
  const ariaAttributes = useAriaAttributes({
    isSelected,
    label,
    controls,
    id,
  });

  return (
    <button
      role="tab"
      onClick={onClick}
      className="tab-button"
      tabIndex={isSelected ? 0 : -1}
      {...ariaAttributes}
    >
      <div className="flex items-center justify-center space-x-2">
        {icon}
        <span>{label}</span>
      </div>
    </button>
  );
};

const Profile: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(mockUserData);
  const [formData, setFormData] = useState(mockUserData);
  const [newSkill, setNewSkill] = useState('');
  const [avatarMenuAnchor, setAvatarMenuAnchor] = useState<null | HTMLElement>(null);
  const [skills, setSkills] = useState<Skill[]>([
    { name: 'JavaScript', level: 85 },
    { name: 'React', level: 90 },
    { name: 'Node.js', level: 75 },
    { name: 'TypeScript', level: 80 },
    { name: 'Python', level: 70 },
  ]);
  const [aiSuggestions, setAiSuggestions] = useState<AiSuggestion[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // Handle tab change
  const handleChangeTab = (newValue: number) => {
    setTabValue(newValue);
  };
  
  // Toggle edit mode
  const toggleEditMode = () => {
    if (editMode) {
      // Discard changes if canceling edit mode
      setFormData(userData);
    }
    setEditMode(!editMode);
    setSuccessMessage(null);
  };
  
  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Handle notification toggle
  const handleNotificationChange = (notificationType: string) => {
    setFormData({
      ...formData,
      notifications: {
        ...formData.notifications,
        [notificationType]: !formData.notifications[notificationType as keyof typeof formData.notifications],
      },
    });
  };
  
  // Add new skill
  const handleAddSkill = () => {
    if (newSkill.trim() !== '' && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill('');
    }
  };
  
  // Remove skill
  const handleRemoveSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill),
    });
  };
  
  // Save profile changes
  const handleSaveProfile = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setUserData(formData);
      setEditMode(false);
      setSuccessMessage('Profile updated successfully!');
      setIsLoading(false);
      
      // Clear success message after a few seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }, 1000);
  };
  
  // Open avatar menu
  const handleAvatarMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAvatarMenuAnchor(event.currentTarget);
  };
  
  // Close avatar menu
  const handleAvatarMenuClose = () => {
    setAvatarMenuAnchor(null);
  };
  
  // Upload new avatar
  const handleAvatarUpload = () => {
    // This would normally open a file picker
    console.log('Avatar upload clicked');
    handleAvatarMenuClose();
  };
  
  // Remove avatar
  const handleAvatarRemove = () => {
    setFormData({
      ...formData,
      avatarUrl: 'https://via.placeholder.com/150?text=No+Image',
    });
    handleAvatarMenuClose();
  };

  // Update AI suggestion function
  const getAiSuggestions = async () => {
    setIsAiLoading(true);
    try {
      const suggestions = await analyzeSkills(skills);
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="relative h-48 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-end space-x-4">
                <div className="relative">
                  <img
                    src={formData.avatarUrl}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-gray-800 bg-gray-800"
                  />
                  {editMode && (
                    <button
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                      className="absolute bottom-0 right-0 p-1 bg-blue-600 rounded-full text-white hover:bg-blue-700"
                      title="Change profile picture"
                      aria-label="Change profile picture"
                    >
                      <CameraIcon className="w-4 h-4" />
                    </button>
                  )}
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    aria-label="Upload profile picture"
                    onChange={handleAvatarUpload}
                  />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white">{formData.name}</h1>
                  <p className="text-gray-200">{formData.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {/* Navigation */}
            <nav className="flex space-x-4 mb-6">
              <a href="#about" className="nav-link">About</a>
              <a href="#skills" className="nav-link">Skills</a>
              <a href="#activity" className="nav-link">Activity</a>
              <a href="#notifications" className="nav-link">Notifications</a>
              <a href="#security" className="nav-link">Security</a>
            </nav>

            <Tab.Group onChange={setTabValue} defaultIndex={0}>
              <div role="tablist" className="flex space-x-1 rounded-xl bg-gray-700 p-1 mb-6">
                <TabButton
                  isSelected={tabValue === 0}
                  onClick={() => setTabValue(0)}
                  controls="about-panel"
                  icon={<UserIcon className="w-4 h-4" />}
                  label="About"
                  id="about-tab"
                />
                <TabButton
                  isSelected={tabValue === 1}
                  onClick={() => setTabValue(1)}
                  controls="skills-panel"
                  icon={<CodeBracketIcon className="w-4 h-4" />}
                  label="Skills"
                  id="skills-tab"
                />
                <TabButton
                  isSelected={tabValue === 2}
                  onClick={() => setTabValue(2)}
                  controls="activity-panel"
                  icon={<ClockIcon className="w-4 h-4" />}
                  label="Activity"
                  id="activity-tab"
                />
                <TabButton
                  isSelected={tabValue === 3}
                  onClick={() => setTabValue(3)}
                  controls="notifications-panel"
                  icon={<BellIcon className="w-4 h-4" />}
                  label="Notifications"
                  id="notifications-tab"
                />
                <TabButton
                  isSelected={tabValue === 4}
                  onClick={() => setTabValue(4)}
                  controls="security-panel"
                  icon={<LockClosedIcon className="w-4 h-4" />}
                  label="Security"
                  id="security-tab"
                />
              </div>

              <Tab.Panels className="mt-6">
                <Tab.Panel id="about-panel" className="space-y-6">
                  <div className="bg-gray-700 rounded-lg p-6">
                    <h2 className="text-lg font-medium text-white mb-4">Bio</h2>
                    {editMode ? (
                      <textarea
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={4}
                        name="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Tell us about yourself"
                      />
                    ) : (
                      <p className="text-gray-300">{formData.bio}</p>
                    )}
                  </div>

                  <div className="bg-gray-700 rounded-lg p-6">
                    <h2 className="text-lg font-medium text-white mb-4">Social Profiles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300" htmlFor="githubUsername">GitHub Username</label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="githubUsername"
                            id="githubUsername"
                            placeholder="Enter your GitHub username"
                            value={editMode ? formData.githubUsername : userData.githubUsername}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            className="mt-1 block w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300" htmlFor="twitterUsername">Twitter Username</label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="twitterUsername"
                            id="twitterUsername"
                            placeholder="Enter your Twitter username"
                            value={editMode ? formData.twitterUsername : userData.twitterUsername}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            className="mt-1 block w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300" htmlFor="linkedinUrl">LinkedIn URL</label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="linkedinUrl"
                            id="linkedinUrl"
                            placeholder="Enter your LinkedIn URL"
                            value={editMode ? formData.linkedinUrl : userData.linkedinUrl}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            className="mt-1 block w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab.Panel>

                <Tab.Panel id="skills-panel" className="space-y-6">
                  <div className="bg-gray-700 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-medium text-white">Professional Skills</h2>
                      <button
                        onClick={getAiSuggestions}
                        disabled={isAiLoading}
                        className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        <SparklesIcon className="w-4 h-4 mr-2" />
                        {isAiLoading ? 'Getting Suggestions...' : 'Get AI Suggestions'}
                      </button>
                    </div>

                    {aiSuggestions.length > 0 && (
                      <div className="mb-4 p-4 bg-blue-900/20 rounded-lg">
                        <h3 className="text-sm font-medium text-blue-300 mb-2">AI Suggestions</h3>
                        <ul className="space-y-2">
                          {aiSuggestions.map((suggestion, index) => (
                            <li key={index} className="text-sm text-blue-200 flex items-center">
                              <SparklesIcon className="w-4 h-4 mr-2" />
                              <div>
                                <span>{suggestion.suggestion}</span>
                                <span className="ml-2 text-xs text-blue-300">
                                  ({suggestion.priority} priority - {suggestion.category})
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="space-y-4">
                      {skills.map((skill, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-300">{skill.name}</span>
                              <span className="text-sm text-gray-400">{skill.level}%</span>
                            </div>
                            <div className="h-2 bg-gray-600 rounded-full">
                              <div
                                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                                style={{ width: `${skill.level}%` }}
                              />
                            </div>
                          </div>
                          {editMode && (
                            <button
                              onClick={() => {
                                setSkills(skills.filter((_, i) => i !== index));
                              }}
                              className="ml-4 p-1 text-red-400 hover:text-red-300"
                              title={`Remove ${skill.name} skill`}
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {editMode && (
                      <div className="mt-4 flex space-x-2">
                        <input
                          type="text"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="Add a new skill"
                          className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => {
                            if (newSkill.trim()) {
                              setSkills([...skills, { name: newSkill.trim(), level: 50 }]);
                              setNewSkill('');
                            }
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-700"
                          title="Add new skill"
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                </Tab.Panel>

                <Tab.Panel id="activity-panel" className="space-y-6">
                  <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
                  <div className="space-y-4">
                    {userData.recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="bg-white border rounded-lg shadow-sm p-4"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            {activity.type === 'code' ? (
                              <CodeBracketIcon className="w-5 h-5 text-blue-500" />
                            ) : (
                              <StarIcon className="w-5 h-5 text-blue-500" />
                            )}
                            <h3 className="text-sm font-medium text-gray-900">
                              {activity.title}
                            </h3>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">
                              {activity.date.toLocaleDateString()}
                            </span>
                            <button 
                              className="text-gray-400 hover:text-gray-500"
                              title="More options"
                            >
                              <EllipsisVerticalIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">{activity.description}</p>
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      <ClockIcon className="w-5 h-5 mr-2" />
                      View All Activity
                    </button>
                  </div>
                </Tab.Panel>

                <Tab.Panel id="notifications-panel" className="space-y-6">
                  <h2 className="text-lg font-medium text-gray-900">Notification Preferences</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-4 border-b">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                        <p className="text-sm text-gray-500">Receive emails about your account activity</p>
                      </div>
                      <div className="flex items-center">
                        <ToggleButton
                          isEnabled={formData.notifications.email}
                          onChange={() => handleNotificationChange('email')}
                          label="Email notifications"
                          disabled={!editMode}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Push Notifications</h3>
                        <p className="text-sm text-gray-500">Receive browser notifications for important updates</p>
                      </div>
                      <div className="flex items-center">
                        <ToggleButton
                          isEnabled={formData.notifications.push}
                          onChange={() => handleNotificationChange('push')}
                          label="Push notifications"
                          disabled={!editMode}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Newsletter</h3>
                        <p className="text-sm text-gray-500">Receive our monthly newsletter with new features</p>
                      </div>
                      <div className="flex items-center">
                        <ToggleButton
                          isEnabled={formData.notifications.newsletter}
                          onChange={() => handleNotificationChange('newsletter')}
                          label="Newsletter"
                          disabled={!editMode}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Product Updates</h3>
                        <p className="text-sm text-gray-500">Get notified when we launch new features</p>
                      </div>
                      <div className="flex items-center">
                        <ToggleButton
                          isEnabled={formData.notifications.updates}
                          onChange={() => handleNotificationChange('updates')}
                          label="Product updates"
                          disabled={!editMode}
                        />
                      </div>
                    </div>
                  </div>
                </Tab.Panel>

                <Tab.Panel id="security-panel" className="space-y-6">
                  <h2 className="text-lg font-medium text-gray-900">Security Settings</h2>
                  
                  <div className="bg-white border rounded-lg shadow-sm p-6 space-y-6">
                    <div>
                      <h3 className="text-base font-medium text-gray-900">Change Password</h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                            Current Password
                          </label>
                          <input
                            type="password"
                            id="current-password"
                            name="current-password"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                            New Password
                          </label>
                          <input
                            type="password"
                            id="new-password"
                            name="new-password"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            id="confirm-password"
                            name="confirm-password"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                        <button
                          type="button"
                          className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Update Password
                        </button>
                      </div>
                    </div>

                    <div className="pt-6">
                      <h3 className="text-base font-medium text-gray-900">Two-Factor Authentication</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Add an extra layer of security to your account by enabling two-factor authentication.
                      </p>
                      <div className="mt-4">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Enable 2FA
                        </button>
                      </div>
                    </div>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={toggleEditMode}
                className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
                title={editMode ? "Cancel editing profile" : "Edit profile"}
                aria-label={editMode ? "Cancel editing profile" : "Edit profile"}
              >
                {editMode ? 'Cancel' : 'Edit Profile'}
              </button>
              {editMode && (
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
                  title="Save profile changes"
                  aria-label="Save profile changes"
                >
                  Save Changes
                </button>
              )}
            </div>

            {successMessage && (
              <div className="text-green-600 bg-green-100 p-4 rounded-md mt-4" role="alert">
                {successMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 