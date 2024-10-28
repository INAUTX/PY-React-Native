import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContactListScreen from '../screens/ContactListScreen';
import AddContactScreen from '../screens/AddContactScreen';
import DetailsContactScreen from '../screens/DetailsContactScreen';

export type RootStackParamList = {
  Contacts: undefined;
  AddContact: undefined;
  DetailsContact: { contactId: string };
};

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
        <Stack.Screen
          name="DetailsContact"
          component={DetailsContactScreen}
          options={{ title: 'Detalles del Contacto' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;