import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DetailsContactScreen from '../screens/DetailsContactScreen';
import AddContactScreen from '../screens/AddContactScreen';
import ContactListScreen from '../screens/ContactListScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';


export type RootStackParamList = {
  Contacts: undefined;
  AddContact: undefined;
  Onboarding: undefined;
  DetailsContact: { contactId: string };
  Login: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Contacts"
        screenOptions={{
          headerTintColor: 'white',
          headerStyle: { backgroundColor: '#111111' },
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
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
                  <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: 'Iniciar Sesión' }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ title: 'Registrarse' }}
          />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
