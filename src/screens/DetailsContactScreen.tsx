import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Contact } from '../models/Contact';
import { getContactById } from '../services/ContactService';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  DetailsContact: { contactId: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'DetailsContact'>;

const DetailsContactScreen: React.FC<Props> = ({ route }) => {
  const [contact, setContact] = useState<Contact | undefined>(undefined);

  useEffect(() => {
    const loadContact = async () => {
      const contactData = await getContactById(route.params.contactId);
      setContact(contactData);
    };
    loadContact();
  }, [route.params.contactId]);

  if (!contact) {
    return (
      <View style={styles.container}>
        <Text>Cargando contacto...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {contact.photo ? (
        <Image source={{ uri: contact.photo }} style={styles.image} />
      ) : (
        <View style={styles.placeholder} />
      )}
      <Text style={styles.name}>{contact.name}</Text>
      <Text style={styles.detail}>Teléfono: {contact.phone}</Text>
      {contact.email && <Text style={styles.detail}>Email: {contact.email}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 16 },
  image: { width: 150, height: 150, borderRadius: 75, marginBottom: 20 },
  placeholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#ccc',
    marginBottom: 20,
  },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  detail: { fontSize: 18, marginBottom: 10 },
});

export default DetailsContactScreen;
