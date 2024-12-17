import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { FIREBASE_DB, doc, getDoc, updateDoc, deleteDoc } from '../FirebaseConfig';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { FontAwesome, Ionicons } from '@expo/vector-icons'

// Define the route prop type for the NoteDetails screen
type NoteDetailsScreenRouteProp = RouteProp<RootStackParamList, 'NoteDetails'>;

const NoteDetails: React.FC = () => {
  const route = useRoute<NoteDetailsScreenRouteProp>();
  const navigation = useNavigation();
  const { item } = route.params; // Get the note object from the route params

  const [noteTitle, setNoteTitle] = useState(item?.title || ''); // Initialize state with the passed title or empty string
  const [noteBody, setNoteBody] = useState(item?.body || ''); // Initialize state with the passed body or empty string
  const [loading, setLoading] = useState(false); // Loading state for fetching, updating, and deleting

  const { id } = item || {}; // Destructure the id from the item, handle case if item is undefined

  useEffect(() => {
    if (!item) {
      alert('No note data found');
      navigation.goBack();
    } else {
      fetchNoteDetails();
    }
  }, [id]);

  // Fetch note details when the screen is loaded
  const fetchNoteDetails = async () => {
    if (id) {
      setLoading(true);
      try {
        const docRef = doc(FIREBASE_DB, 'notes', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setNoteTitle(data?.title || '');
          setNoteBody(data?.body || '');
        }
      } catch (error) {
        console.error('Error fetching note details:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle updating the note
  const handleUpdateNote = async () => {
    if (!noteTitle || !noteBody) {
      alert('Please fill in both title and body.');
      return;
    }

    try {
      setLoading(true);
      const docRef = doc(FIREBASE_DB, 'notes', id);
      await updateDoc(docRef, { title: noteTitle, body: noteBody });
      alert('Note updated!');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating note:', error);
      alert('Failed to update note.');
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting the note with confirmation
  const handleDeleteNote = async () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              setLoading(true);
              const docRef = doc(FIREBASE_DB, 'notes', id);
              await deleteDoc(docRef);
              alert('Note deleted!');
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting note:', error);
              alert('Failed to delete note.');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleUpdateNote} style={styles.iconButton}>
          <FontAwesome name="save" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDeleteNote} style={styles.iconButton}>
          <FontAwesome name="trash" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <TextInput
              style={styles.titleInput}
              placeholder="Note Title"
              value={noteTitle}
              onChangeText={setNoteTitle}
            />
            <TextInput
              style={styles.bodyInput}
              placeholder="Note Body"
              value={noteBody}
              onChangeText={setNoteBody}
              multiline
            />
          </>
        )}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.iconButton}>
          <FontAwesome name="font" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="color-palette" size={30} color="black" />
        </TouchableOpacity>
        
                {/* Attach icon to trigger overlay */} 
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="attach" size={30} color="black" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="timer" size={30} color="black" />
        </TouchableOpacity>
      </View>
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
});

export default NoteDetails;
