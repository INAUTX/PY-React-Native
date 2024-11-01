import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DetailsContactScreen from '../screens/DetailsContactScreen';
import AddContactScreen from '../screens/AddContactScreen';
import ContactListScreen from '../screens/ContactListScreen';


export type RootStackParamList = {
  Contacts: undefined;
  AddContact: undefined;
  DetailsContact: { contactId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Contacts"
        screenOptions={{
          headerTintColor: 'white',
          headerStyle: { backgroundColor: '#007BFF' },
        }}
      >
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
