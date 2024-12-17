import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'; // Import Firebase Auth
import { getFirestore, doc, setDoc } from 'firebase/firestore'; // Import Firestore functions
import { FIREBASE_APP } from '../FirebaseConfig'; // Import your Firebase config

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function Register({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!username || !email || !birthday || !password || !confirmPassword) {
      Alert.alert('Registration Failed', 'Please fill out all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Registration Failed', 'Passwords do not match.');
      return;
    }

    try {
      // Step 1: Register the user with Firebase Authentication
      const auth = getAuth(FIREBASE_APP); // Initialize Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password); // Create user with email and password
      const user = userCredential.user;

      // Step 2: Store additional user info in Firestore
      const db = getFirestore(FIREBASE_APP); // Initialize Firestore
      const userDocRef = doc(db, 'users', user.uid); // Reference to the Firestore document for the user

      await setDoc(userDocRef, {
        username: username,
        email: email,
        birthday: birthday,
        createdAt: new Date(), // Store timestamp when the user is created
      });

      Alert.alert('Registration Successful', 'Welcome user.');

      // Navigate to Dashboard after registration
      navigation.replace('Dashboard', { newNote: undefined });
    } catch (error) {
      console.error(error);
      Alert.alert('Registration Failed', 'An error occurred during registration.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../assets/S N logo.png')} style={styles.logo} />
      <Text style={styles.title}>Register</Text>

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Birthday (YYYY-MM-DD)"
        value={birthday}
        onChangeText={setBirthday}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Styled Register Button */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: 'rgba(128, 0, 0, 1)', // Button background color
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff', // Button text color
    fontSize: 16,
    fontWeight: 'bold',
  },
});
