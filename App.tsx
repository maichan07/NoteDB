import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer'; // Import DrawerNavigator
import Welcome from './screens/Welcome';
import Login from './screens/Login';
import Register from './screens/Register';
import Dashboard from './screens/Dashboard';
import Notes from './screens/Notes';
import NoteDetails from './screens/NoteDetails';

import Logout from './menu/Logout';


import { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB } from './FirebaseConfig'; // Import Firebase config
import { onAuthStateChanged } from 'firebase/auth'; // Firebase Auth listener

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Dashboard: { newNote?: { title: string; body: string } };
  Notes: { id?: string };
  Logout: undefined;
  NoteDetails: { item: { id: string, title: string, body: string } };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();  // Create Drawer navigator

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Premium" component={Dashboard} />
      <Drawer.Screen name="Themes" component={Dashboard} />
      <Drawer.Screen name="About Us" component={Dashboard} />
      <Drawer.Screen name="Log Out" component={Logout} />
    </Drawer.Navigator>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check for authentication state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        setIsLoggedIn(true);  // User is logged in
      } else {
        setIsLoggedIn(false); // No user is logged in
      }
    });

    return () => unsubscribe(); // Clean up the listener on component unmount
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? "Dashboard" : "Welcome"}>
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          children={(props) => <Login {...props} setIsLoggedIn={setIsLoggedIn} />}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DrawerNavigator}  // Use DrawerNavigator here
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Notes"
          component={Notes}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NoteDetails"
          component={NoteDetails}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
