import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, StyleSheet, Image, Text } from 'react-native';
import { Contact } from '../models/Contact';
import { getContacts } from '../services/ContactService';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Contacts: undefined;
  AddContact: undefined;
  DetailsContact: { contactId: string };
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Contacts'>;
};

const ContactListScreen: React.FC<Props> = ({ navigation }) => {
  const [search, setSearch] = useState<string>('');
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadContacts);
    return unsubscribe;
  }, [navigation]);

  const loadContacts = async () => {
    const allContacts = await getContacts();
    setContacts(allContacts);
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(search.toLowerCase()),
  );

  const renderItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => navigation.navigate('DetailsContact', { contactId: item.id })}
    >
      {item.photo ? (
        <Image source={{ uri: item.photo }} style={styles.contactImage} />
      ) : (
        <View style={styles.contactPlaceholder} />
      )}
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phone}</Text>
      </View>
    </TouchableOpacity>
  );

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
        renderItem={renderItem}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddContact')}
      >
        <Text style={styles.addButtonText}>Agregar Contacto</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBar: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 16,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  contactItem: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  contactImage: { width: 60, height: 60, borderRadius: 30 },
  contactPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ccc',
  },
  contactInfo: { marginLeft: 16 },
  contactName: { fontSize: 18, fontWeight: 'bold' },
  contactPhone: { fontSize: 16, color: 'gray' },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 5,
    margin: 16,
    alignItems: 'center',
  },
  addButtonText: { color: 'white', fontSize: 18 },
});

export default ContactListScreen;
