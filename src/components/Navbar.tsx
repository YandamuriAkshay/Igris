import React, { useState, Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { 
  HomeIcon, 
  CodeBracketIcon, 
  MicrophoneIcon, 
  Cog6ToothIcon, 
  UserIcon, 
  ArrowRightOnRectangleIcon, 
  Bars3Icon, 
  XMarkIcon 
} from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would come from auth context in a real app

  const handleLogout = () => {
    setIsLoggedIn(false);
    // In a real app, you would call logout API and handle navigation
  };

  const handleLogin = () => {
    // For demo purpose - toggle login state
    setIsLoggedIn(!isLoggedIn);
  };

  const navigation = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Code Editor', path: '/code-editor', icon: CodeBracketIcon },
    { name: 'Voice Assistant', path: '/voice-assistant', icon: MicrophoneIcon },
    { name: 'Settings', path: '/settings', icon: Cog6ToothIcon },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Disclosure as="nav" className="bg-secondary-light sticky top-0 z-10">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Link to="/" className="text-white font-bold text-xl tracking-wider">
                    IGRIS
                  </Link>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={`${
                          isActive(item.path)
                            ? 'bg-primary text-white'
                            : 'text-gray-300 hover:bg-secondary hover:text-white'
                        } px-3 py-2 rounded-md text-sm font-medium flex items-center`}
                      >
                        <item.icon className="h-5 w-5 mr-1" aria-hidden="true" />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  {isLoggedIn ? (
                    <Menu as="div" className="ml-3 relative">
                      <div>
                        <Menu.Button className="max-w-xs bg-secondary-light rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                          <span className="sr-only">Open user menu</span>
                          <img
                            className="h-8 w-8 rounded-full"
                            src="https://via.placeholder.com/150"
                            alt="User profile"
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-secondary-light ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/profile"
                                className={`${
                                  active ? 'bg-secondary' : ''
                                } block px-4 py-2 text-sm text-gray-300 hover:text-white`}
                              >
                                <div className="flex items-center">
                                  <UserIcon className="h-5 w-5 mr-2" />
                                  Profile
                                </div>
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/settings"
                                className={`${
                                  active ? 'bg-secondary' : ''
                                } block px-4 py-2 text-sm text-gray-300 hover:text-white`}
                              >
                                <div className="flex items-center">
                                  <Cog6ToothIcon className="h-5 w-5 mr-2" />
                                  Settings
                                </div>
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleLogout}
                                className={`${
                                  active ? 'bg-secondary' : ''
                                } block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white`}
                              >
                                <div className="flex items-center">
                                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                                  Sign out
                                </div>
                              </button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  ) : (
                    <Link
                      to="/login"
                      onClick={handleLogin} // For demo only
                      className="text-gray-300 hover:bg-secondary hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
                      Sign in
                    </Link>
                  )}
                </div>
              </div>
              <div className="-mr-2 flex md:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="bg-secondary-light inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`${
                    isActive(item.path)
                      ? 'bg-primary text-white'
                      : 'text-gray-300 hover:bg-secondary hover:text-white'
                  } block px-3 py-2 rounded-md text-base font-medium flex items-center`}
                >
                  <item.icon className="h-5 w-5 mr-2" aria-hidden="true" />
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-700">
              {isLoggedIn ? (
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src="https://via.placeholder.com/150"
                      alt="User profile"
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-white">John Doe</div>
                    <div className="text-sm font-medium leading-none text-gray-400">john@example.com</div>
                  </div>
                </div>
              ) : (
                <div className="px-5">
                  <Link
                    to="/login"
                    onClick={handleLogin} // For demo only
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-secondary flex items-center"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                    Sign in
                  </Link>
                </div>
              )}
              {isLoggedIn && (
                <div className="mt-3 px-2 space-y-1">
                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-secondary flex items-center"
                  >
                    <UserIcon className="h-5 w-5 mr-2" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-secondary flex items-center"
                  >
                    <Cog6ToothIcon className="h-5 w-5 mr-2" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-secondary w-full text-left flex items-center"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar; 