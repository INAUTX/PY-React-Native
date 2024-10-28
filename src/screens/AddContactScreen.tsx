import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type Contact = {
  id: string;
  name: string;
  phone: string;
  email?: string;
};

type RootStackParamList = {
  ContactList: undefined;
  AddContact: { addContact: (contact: Contact) => void };
};

type AddContactScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddContact'>;
type AddContactScreenRouteProp = RouteProp<RootStackParamList, 'AddContact'>;

type Props = {
  navigation: AddContactScreenNavigationProp;
  route: AddContactScreenRouteProp;
};

const AddContactScreen: React.FC<Props> = ({ navigation, route }) => {
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  
  const saveContact = () => {

    if (!name || !phone) {
      Alert.alert('Error', 'Por favor, rellena todos los campos');
      return;
    }

    const newContact: Contact = {
      id: Math.random().toString(), 
      name,
      phone,
    };

    route.params.addContact(newContact); 
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={phone}
        onChangeText={(text) => setPhone(text)}
      />
      
      <Button title="Guardar" onPress={saveContact} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, paddingHorizontal: 8 },
});

export default AddContactScreen;