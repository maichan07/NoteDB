import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  Animated,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function Welcome({ navigation }: Props) {
  // Animation references
  const logoOpacity = useRef(new Animated.Value(0)).current; // For fade-in effect
  const buttonTranslateY = useRef(new Animated.Value(50)).current; // For slide-up effect

  useEffect(() => {
    // Start animations when the component mounts
    Animated.sequence([
      // Fade-in logo
      Animated.timing(logoOpacity, {
        toValue: 1, // Fully visible
        duration: 1000, // Animation duration in ms
        useNativeDriver: true,
      }),
      // Slide-up buttons
      Animated.timing(buttonTranslateY, {
        toValue: 0, // Final position
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ImageBackground
      source={require('../assets/genshin.png')} // Path to your background image
      style={styles.background}
      imageStyle={styles.image}
    >
      <View style={styles.container}>
        {/* Animated Logo */}
        <Animated.Image
          source={require('../assets/S N logo.png')} // Path to your logo image
          style={[styles.logo, { opacity: logoOpacity }]} // Add fade-in animation
        />

        <Text style={styles.title}>Make note make it your own</Text>
        <Text style={styles.subtitle}>Already have an account?</Text>

        {/* Animated Buttons */}
        <Animated.View
          style={{ transform: [{ translateY: buttonTranslateY }] }} // Slide-up animation
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>
          
          <Text style={styles.subtitle}>Create new account</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // Ensures the background image covers the screen
  },
  image: {
    opacity: 0.6, // Makes the background image slightly translucent
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  logo: {
    position: 'absolute',
    top: 80, // Adjust this value to position it better
    width: '70%', // Stretch the logo to 70% of the container's width
    height: '20%',
    aspectRatio: 1, // Ensures width and height maintain the same ratio
    resizeMode: 'contain',
    borderWidth: 2, // Optional border
    borderColor: 'white',
    overflow: 'hidden',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 50,
    marginTop: 50,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgb(0, 0, 0)',
    marginBottom: 1,
    textAlign: 'center',
  },
  button: {
    borderWidth: 1, // Optional border
    borderColor: 'rgb(237, 218, 218)',
    padding: 7,
    backgroundColor: 'rgba(128, 0, 0, 1)',
    borderRadius: 50,
    marginVertical: 10,
    alignItems: 'center',
    width: 180,
  },
  buttonText: {
    color: '#fff',
    fontSize: 21,
    fontWeight: 'bold',
  },
});
