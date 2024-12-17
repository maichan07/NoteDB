import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../App';
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB } from '../FirebaseConfig'; // Import your Firebase configuration

type DashboardScreenNavigationProp = DrawerNavigationProp<RootStackParamList, 'Dashboard'>;

const Dashboard: React.FC = () => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [notes, setNotes] = useState<{ id: string; title: string; body: string }[]>([]);

  // Function to fetch notes from Firestore
  const fetchNotes = async () => {
    try {
      const notesCollection = collection(FIREBASE_DB, 'notes');
      const snapshot = await getDocs(notesCollection);
      const notesList = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        body: doc.data().body,
      }));
      setNotes(notesList);
    } catch (error) {
      console.error('Error fetching notes: ', error);
    }
  };

  // Use useFocusEffect to refresh notes whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [])
  );

  // Navigate to 'Notes' screen for adding or editing notes
  const handleAddNote = () => {
    navigation.navigate('Notes', { id: undefined }); // Pass undefined for creating a new note
  };

  const handleEditNote = (note: { id: string; title: string; body: string }) => {
    navigation.navigate('NoteDetails', { item: note });
  };

  // Delete a note and update the display
  const handleDeleteNote = async (id: string) => {
    try {
      await deleteDoc(doc(FIREBASE_DB, 'notes', id));
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id)); // Remove from local state
    } catch (error) {
      console.error('Error deleting note: ', error);
    }
  };

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      {/* Menu button */}
      <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.menuButton}>
        <MaterialIcons name="menu" size={30} color="black" />
      </TouchableOpacity>

      {/* Profile Section */}
      <TouchableOpacity onPress={pickImage} style={styles.profileContainer}>
        <Image
          source={
            profileImage
              ? { uri: profileImage }
              : require('../assets/icon.png') // Replace with your default profile image path
          }
          style={styles.profileImage}
        />
        <Text style={styles.profileText}>Tap to change your profile picture</Text>
      </TouchableOpacity>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <TouchableOpacity onPress={() => console.log('Search for:', searchQuery)} style={styles.searchIcon}>
          <MaterialIcons name="search" size={24} color="#888" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Notes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Add Button */}
      <TouchableOpacity onPress={handleAddNote} style={styles.addButton}>
        <MaterialIcons name="add" size={30} color="white" />
      </TouchableOpacity>

      {/* Scrollable List of Notes */}
      <Text style={styles.title}>Your Notes</Text>
      <ScrollView style={styles.notesContainer}>
        {notes.length === 0 ? (
          <Text>No notes created yet. Tap the '+' to create a note.</Text>
        ) : (
          notes.map(note => (
            <View key={note.id} style={styles.noteItem}>
              <TouchableOpacity onPress={() => handleEditNote(note)} style={{ flex: 1 }}>
                <Text style={styles.noteTitle}>{note.title}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteNote(note.id)}>
                <MaterialIcons name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  menuButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#0a7ea4',
  },
  profileText: {
    marginTop: 10,
    fontSize: 14,
    color: '#888',
  },
  addButton: {
    backgroundColor: '#0a7ea4',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    zIndex: 2,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    width: '90%',
    padding: 10,
    borderRadius: 30,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 16,
    height: 40,
  },
  searchIcon: {
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  notesContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  noteItem: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  noteTitle: {
    fontSize: 18,
    color: '#333',
    flex: 1,
  },
});

export default Dashboard;