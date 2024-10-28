import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useContacts } from '../hooks/useContacts'; // Importar el hook
import { Contact } from './AddContactScreen';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  ContactList: undefined;
  AddContact: { addContact: (contact: Contact) => void };
};

type ContactListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ContactList'>;

type Props = {
  navigation: ContactListScreenNavigationProp;
};

const ContactListScreen: React.FC<Props> = ({ navigation }) => {
  const [search, setSearch] = useState<string>('');
  const { contacts, addContact, filterContacts } = useContacts(); // Usar el hook

  const filteredContacts = filterContacts(search);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar contactos"
        value={search}
        onChangeText={(text) => setSearch(text)}
      />
      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('EditContact', { contact: item })}>
            <Text style={styles.contact}>{item.name} - {item.phone}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddContact', { addContact })}
      >
        <Text style={styles.addButtonText}>Agregar Contacto</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  searchBar: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, paddingHorizontal: 8 },
  contact: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  addButton: { backgroundColor: '#007BFF', padding: 16, borderRadius: 5, marginTop: 20 },
  addButtonText: { color: 'white', textAlign: 'center' },
});

export default ContactListScreen;
