import React, {useEffect, useState} from 'react';
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
import {Contact} from '../models/Contact';
import {
  deleteContact,
  getContactById,
  updateContact,
} from '../services/ContactService';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  launchCamera,
  launchImageLibrary,
  Asset,
  ImageLibraryOptions,
  CameraOptions,
} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';

import MapView, {
  Marker,
  MapPressEvent,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import {ScrollView} from 'react-native';
import WeatherWidget from '../components/WeatherWidget';

type RootStackParamList = {
  Contacts: undefined;
  DetailsContact: {contactId: string};
};

type Props = NativeStackScreenProps<RootStackParamList, 'DetailsContact'>;

const DetailsContactScreen: React.FC<Props> = ({route, navigation}) => {
  const [contact, setContact] = useState<Contact | undefined>(undefined);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [initialRegion] = useState({
    latitude: 4.711,
    longitude: -74.0721,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    const loadContact = async () => {
      const contactData = await getContactById(route.params.contactId);
      setContact(contactData);
      if (contactData) {
        setName(contactData.name);
        setPhone(contactData.phone);
        setEmail(contactData.email || '');
        setPhoto(contactData.photo);
        setLatitude(contactData.latitude || null);
        setLongitude(contactData.longitude || null);
      }
    };
    loadContact();
  }, [route.params.contactId]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          {isEditing ? (
            <TouchableOpacity
              onPress={toggleEditMode}
              style={styles.headerButton}>
              <Text style={styles.headerButtonText}>Cancelar</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                onPress={toggleEditMode}
                style={styles.headerButtonIcon}>
                <Icon name="pencil" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmDelete}
                style={styles.headerButtonIcon}>
                <Icon name="trash" size={24} color="white" />
              </TouchableOpacity>
            </>
          )}
        </View>
      ),
    });
  }, [navigation, isEditing, contact]);

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const confirmDelete = () => {
    Alert.alert(
      'Eliminar Contacto',
      `¿Estás seguro de que deseas eliminar este contacto?`,
      [
        {text: 'Cancelar', style: 'cancel'},
        {text: 'Eliminar', style: 'destructive', onPress: handleDelete},
      ],
      {cancelable: true},
    );
  };

  const handleDelete = async () => {
    if (contact) {
      await deleteContact(contact.id);
      Alert.alert(
        'Contacto eliminado',
        'El contacto ha sido eliminado exitosamente.',
      );
      navigation.navigate('Contacts');
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
      {cancelable: true},
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

  const handleMapPress = (event: MapPressEvent) => {
    if (isEditing) {
      const {latitude, longitude} = event.nativeEvent.coordinate;
      setLatitude(latitude);
      setLongitude(longitude);
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
      latitude: latitude || undefined,
      longitude: longitude || undefined,
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <TouchableOpacity onPress={isEditing ? selectImage : undefined}>
          {photo ? (
            <Image source={{uri: photo}} style={styles.image} />
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
              placeholder="Nombre*"
            />
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={text => setPhone(text.replace(/[^0-9]/g, ''))}
              keyboardType="phone-pad"
              placeholder="Teléfono*"
            />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="Correo Electrónico"
            />
          </>
        ) : (
          <>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.detail}>Teléfono: {phone}</Text>
            {email && <Text style={styles.detail}>Email: {email}</Text>}
          </>
        )}

        {latitude && longitude ? (
          <View style={styles.map}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              onPress={handleMapPress}
              initialRegion={{
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              showsUserLocation={true}
              showsMyLocationButton={true}
              scrollEnabled={isEditing}
              zoomEnabled={isEditing}
              rotateEnabled={isEditing}
              pitchEnabled={isEditing}>
              <Marker coordinate={{latitude, longitude}} />
            </MapView>
            <View style={styles.weatherOverlay}>
            <WeatherWidget latitude={latitude} longitude={longitude} />
          </View>
          </View>
        ) : (
          isEditing && (
            <View style={styles.mapPlaceholder}>
              <Button
                title="Agregar Ubicación"
                onPress={() => {
                  setLatitude(initialRegion.latitude);
                  setLongitude(initialRegion.longitude);
                }}
              />
            </View>
          )
        )}

        {isEditing && <Button title="Guardar Cambios" onPress={saveContact} />}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  weatherOverlay: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {flex: 1, alignItems: 'center', padding: 16},
  image: {width: 150, height: 150, borderRadius: 75, marginBottom: 20},
  placeholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#ccc',
    marginBottom: 20,
  },
  name: {fontSize: 24, fontWeight: 'bold', marginBottom: 20},
  detail: {fontSize: 18, marginBottom: 10},
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
  headerButtonText: {color: 'white', fontSize: 16},
  map: {
    width: '100%',
    height: 330,
    marginBottom: 20,
  },
  mapPlaceholder: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    marginBottom: 20,
  },
});

export default DetailsContactScreen;
