import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av'; // Import Audio component from expo-av
import { FIREBASE_AUTH, FIREBASE_DB, addDoc, collection } from '../FirebaseConfig'; // Correct import path

const Notes: React.FC = () => {
  const navigation = useNavigation();

  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [isOverlayVisible, setIsOverlayVisible] = useState(false); // Overlay state
  const [selectedOption, setSelectedOption] = useState(''); // Audio or Image option
  const [sound, setSound] = useState<Audio.Sound | null>(null); // State to hold the audio sound instance

  // Function to save the note to Firestore
  const handleSaveNote = async () => {
    if (!noteTitle || !noteBody) {
      alert('Please enter both title and body');
      return;
    }

    try {
      const user = FIREBASE_AUTH.currentUser; // Get the current logged-in user
      if (user) {
        // Prepare the note data to be saved
        const noteData = {
          title: noteTitle,
          body: noteBody,
          userId: user.uid, // Save user ID to associate the note with the logged-in user
          createdAt: new Date(),
          // Optionally, include audio or image if selected
          attachmentType: selectedOption || null, // Audio or Image
          attachmentUrl: selectedOption === 'Audio' ? 'your_audio_url' : selectedOption === 'Image' ? 'your_image_url' : null,
        };

        // Add the note to Firestore under a collection named "notes"
        await addDoc(collection(FIREBASE_DB, 'notes'), noteData);

        console.log('Note saved to Firestore');
        navigation.goBack();
      } else {
        alert('User is not logged in');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      alert('There was an error saving your note. Please try again.');
    }
  };

  const handleDeleteNote = () => {
    console.log('Note deleted');
    navigation.goBack();
  };

  const handleAttachPress = () => {
    setIsOverlayVisible(!isOverlayVisible); // Toggle overlay visibility
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option); // Set selected option
    setIsOverlayVisible(false); // Close the overlay after selection
    if (option === 'Audio') {
      playAudio(); 
    }
  };

  // Function to play audio using expo-av
  const playAudio = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/audio.mp3') // Replace with your actual audio file path
    );
    setSound(sound);
    await sound.playAsync(); // Play the audio
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSaveNote} style={styles.iconButton}>
          <FontAwesome name="save" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDeleteNote} style={styles.iconButton}>
          <FontAwesome name="trash" size={30} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <TextInput
          style={styles.titleInput}
          placeholder="Note Title"
          value={noteTitle} // Display the note title here
          onChangeText={setNoteTitle}
        />
        <TextInput
          style={styles.bodyInput}
          placeholder="Note Body"
          value={noteBody}
          onChangeText={setNoteBody}
          multiline
        />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.iconButton}>
          <FontAwesome name="font" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="color-palette" size={30} color="black" />
        </TouchableOpacity>

        {/* Attach icon to trigger overlay */} 
        <TouchableOpacity style={styles.iconButton} onPress={handleAttachPress}>
          <Ionicons name="attach" size={30} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="timer" size={30} color="black" />
        </TouchableOpacity>
      </View>

      {/* Overlay (Modal) for audio or image selection */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isOverlayVisible}
        onRequestClose={() => setIsOverlayVisible(false)} // Close the overlay when tapping outside
      >
        <View style={styles.overlay}>
          <View style={styles.overlayContent}>
            <Text style={styles.overlayTitle}>Select Attachment Type</Text>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleOptionSelect('Audio')}
            >
              <Text style={styles.optionText}>Audio</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleOptionSelect('Image')}
            >
              <Text style={styles.optionText}>Image</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Display selected option */} 
      {selectedOption && <Text style={styles.selectedOptionText}>Selected: {selectedOption}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  titleInput: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontSize: 18,
  },
  bodyInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  iconButton: {
    padding: 10,
    marginLeft: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingBottom: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  overlayContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  overlayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionButton: {
    padding: 10,
    margin: 5,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  optionText: {
    color: 'white',
    fontSize: 16,
  },
  selectedOptionText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Notes;
