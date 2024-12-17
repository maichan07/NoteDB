import React, { useState } from 'react';
import { View, TextInput, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // Import Firebase Authentication

// Define LoginProps to expect setIsLoggedIn
type LoginProps = StackScreenProps<RootStackParamList, 'Login'> & {
  setIsLoggedIn: (val: boolean) => void;
};

const Login: React.FC<LoginProps> = ({ navigation, setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }

    try {
      const auth = getAuth(); // Initialize Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password); // Sign in the user

      setIsLoggedIn(true); // Set logged in status
      navigation.replace('Dashboard', { newNote: undefined }); // Navigate to the Dashboard
    } catch (error: unknown) { // Explicitly type error as unknown
      if (error instanceof Error) { // Check if error is an instance of Error
        console.error(error.message);
        alert('Invalid credentials, please try again.'); // Show alert for invalid credentials
      } else {
        console.error('An unknown error occurred');
        alert('An unknown error occurred. Please try again later.');
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../assets/S N logo.png')} style={styles.logo} />

      {/* Input Fields */}
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Enter email"
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Enter password"
        secureTextEntry
        style={styles.input}
      />

      {/* Styled Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 40,
  },
  input: {
    width: '80%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  button: {
    backgroundColor: 'rgba(128, 0, 0, 1)', // Background color for the button
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff', // Text color
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Login;
