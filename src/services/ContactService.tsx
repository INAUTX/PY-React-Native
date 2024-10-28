import AsyncStorage from '@react-native-async-storage/async-storage';
import { Contact } from '../models/contact';

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
