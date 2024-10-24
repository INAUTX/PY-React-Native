import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContactListScreen from '../screens/ContactListScreen';
import AddContactScreen, { Contact } from '../screens/AddContactScreen';

// Definir los tipos para las rutas (opcional, pero útil para TypeScript)
export type RootStackParamList = {
  Contacts: undefined; 
  AddContact: { addContact: (contact: Contact) => void }; 
};

// Crear el stack con los tipos definidos
const Stack = createNativeStackNavigator<RootStackParamList>();

function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Contacts">
        <Stack.Screen
          name="Contacts"
          component={ContactListScreen}
          options={{ title: 'Contactos' }} 
        />
        <Stack.Screen
          name="AddContact"
          component={AddContactScreen}
          options={{ title: 'Agregar Contacto' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
