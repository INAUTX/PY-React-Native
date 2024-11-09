import AsyncStorage from '@react-native-async-storage/async-storage';
import { Contact } from '../models/contact';
import axios from 'axios';
import { BASE_URL, API_KEY } from '@env';

const CONTACTS_KEY = '@contacts';

export const getContacts = async (): Promise<Contact[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(CONTACTS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error al obtener los contactos', e);
    return [];
  }
};

export const saveContacts = async (contacts: Contact[]) => {
  try {
    const jsonValue = JSON.stringify(contacts);
    await AsyncStorage.setItem(CONTACTS_KEY, jsonValue);
  } catch (e) {
    console.error('Error al guardar los contactos', e);
  }
};

export const addContact = async (contact: Contact) => {
  const contacts = await getContacts();
  contacts.push(contact);
  await saveContacts(contacts);
};

export const getContactById = async (id: string): Promise<Contact | undefined> => {
  const contacts = await getContacts();
  return contacts.find((contact) => contact.id === id);
};

export const updateContact = async (updatedContact: Contact): Promise<void> => {
  const contacts = await getContacts();
  const index = contacts.findIndex((contact) => contact.id === updatedContact.id);
  if (index !== -1) {
    contacts[index] = updatedContact;
    await AsyncStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
  }
};

export const deleteContact = async (id: string): Promise<void> => {
  const contacts = await getContacts();
  const updatedContacts = contacts.filter((contact) => contact.id !== id);
  await AsyncStorage.setItem(CONTACTS_KEY, JSON.stringify(updatedContacts));
};

export const getWeatherByCoordinates = async (latitude: number, longitude: number) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        lat: latitude,
        lon: longitude,
        units: 'metric', 
        lang: 'es',
        appid: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener el clima:', error, );
    throw error;
  }
};