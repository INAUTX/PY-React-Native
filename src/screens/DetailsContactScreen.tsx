// src/screens/DetailsContactScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import { Contact } from '../models/Contact';
import { deleteContact, getContactById, updateContact } from '../services/ContactService';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  launchCamera,
  launchImageLibrary,
  Asset,
  ImageLibraryOptions,
  CameraOptions,
} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons'; // Importación corregida

type RootStackParamList = {
  Contacts: undefined; // Agregado
  DetailsContact: { contactId: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'DetailsContact'>;

const DetailsContactScreen: React.FC<Props> = ({ route, navigation }) => {
  const [contact, setContact] = useState<Contact | undefined>(undefined);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [photo, setPhoto] = useState<string | undefined>(undefined);

  useEffect(() => {
    const loadContact = async () => {
      const contactData = await getContactById(route.params.contactId);
      setContact(contactData);
      if (contactData) {
        setName(contactData.name);
        setPhone(contactData.phone);
        setEmail(contactData.email || '');
        setPhoto(contactData.photo);
      }
    };
    loadContact();
  }, [route.params.contactId]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          {isEditing ? (
            <TouchableOpacity onPress={toggleEditMode} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>Cancelar</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity onPress={toggleEditMode} style={styles.headerButtonIcon}>
                <Icon name="pencil" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmDelete} style={styles.headerButtonIcon}>
                <Icon name="trash" size={24} color="white" />
              </TouchableOpacity>
            </>
          )}
        </View>
      ),
    });
  }, [navigation, isEditing]);

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const confirmDelete = () => {
    Alert.alert(
      'Eliminar Contacto',
      '¿Estás seguro de que deseas eliminar este contacto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: handleDelete },
      ],
      { cancelable: true },
    );
  };

  const handleDelete = async () => {
    if (contact) {
      await deleteContact(contact.id);
      Alert.alert('Contacto eliminado', 'El contacto ha sido eliminado exitosamente.');
      navigation.navigate('Contacts'); // Ahora 'Contacts' está definido en RootStackParamList
    }
  };

  const selectImage = () => {
    Alert.alert(
      'Selecciona una imagen',
      'Elige una opción',
      [
        {
          text: 'Cámara',
          onPress: async () => {
            const options: CameraOptions = {
              mediaType: 'photo',
              quality: 0.7,
            };
            const response = await launchCamera(options);
            handleImageResponse(response);
          },
        },
        {
          text: 'Galería',
          onPress: async () => {
            const options: ImageLibraryOptions = {
              mediaType: 'photo',
              quality: 0.7,
              selectionLimit: 1,
            };
            const response = await launchImageLibrary(options);
            handleImageResponse(response);
          },
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ],
      { cancelable: true },
    );
  };

  const handleImageResponse = (response: any) => {
    if (response.didCancel) {
      console.log('El usuario canceló la selección de imagen');
    } else if (response.errorCode) {
      console.error('Error al seleccionar imagen:', response.errorMessage);
    } else if (response.assets && response.assets.length > 0) {
      const asset: Asset = response.assets[0];
      setPhoto(asset.uri);
    }
  };

  const saveContact = async () => {
    if (!name || !phone) {
      Alert.alert('Error', 'Por favor, rellena todos los campos obligatorios');
      return;
    }

    const updatedContact: Contact = {
      id: contact!.id,
      name,
      phone,
      email,
      photo,
    };

    await updateContact(updatedContact);
    setIsEditing(false);
    setContact(updatedContact);
    Alert.alert('Éxito', 'Contacto actualizado correctamente');
  };

  if (!contact) {
    return (
      <View style={styles.container}>
        <Text>Cargando contacto...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={isEditing ? selectImage : undefined}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.image} />
        ) : (
          <View style={styles.placeholder} />
        )}
      </TouchableOpacity>

      {isEditing ? (
        <>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Button title="Guardar Cambios" onPress={saveContact} />
        </>
      ) : (
        <>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.detail}>Teléfono: {phone}</Text>
          {email && <Text style={styles.detail}>Email: {email}</Text>}
        </>
      )}
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
  input: {
    height: 50,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  headerButtons: {
    flexDirection: 'row',
    marginRight: 16,
  },
  headerButton: {
    marginLeft: 16,
  },
  headerButtonIcon: {
    marginLeft: 16,
  },
  headerButtonText: { color: 'white', fontSize: 16 },
});

export default DetailsContactScreen;
