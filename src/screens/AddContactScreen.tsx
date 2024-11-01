import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import { Contact } from '../models/Contact';
import { addContact } from '../services/ContactService';
import { launchCamera, launchImageLibrary, Asset, ImageLibraryOptions, CameraOptions } from 'react-native-image-picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Contacts: undefined;
  AddContact: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddContact'>;
};

const AddContactScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [photo, setPhoto] = useState<string | undefined>(undefined);

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

    const newContact: Contact = {
      id: Date.now().toString(),
      name,
      phone,
      email,
      photo,
    };

    await addContact(newContact);
    Alert.alert('Éxito', 'Contacto guardado correctamente');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={selectImage}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Button title="Agregar Foto" onPress={selectImage} />
          </View>
        )}
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Nombre*"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono*"
        value={phone}
        keyboardType="phone-pad"
        onChangeText={(text) => setPhone(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        value={email}
        keyboardType="email-address"
        onChangeText={(text) => setEmail(text)}
      />
      <Button title="Guardar" onPress={saveContact} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  image: { width: 150, height: 150, borderRadius: 75, alignSelf: 'center', marginBottom: 20 },
  placeholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
});

export default AddContactScreen;
