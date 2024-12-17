import React, { createContext, useState, ReactNode, useContext } from 'react';

// Define the type for UserContext
type UserContextType = {
  username: string | null; // The logged-in user's username
  setUsername: (username: string | null) => void; // Function to update the username
};

// Create the UserContext with an undefined default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a Provider component to manage the username state
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(null); // State to store the username

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for consuming the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
