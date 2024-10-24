// hooks/useContacts.ts
import { useState } from 'react';

type Contact = {
  id: string;
  name: string;
  phone: string;
};

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Juan Pérez', phone: '123-456-789' },
    { id: '2', name: 'Ana López', phone: '987-654-321' }
  ]);

  const addContact = (newContact: Contact) => {
    setContacts((prevContacts) => [...prevContacts, newContact]);
  };

  const filterContacts = (searchTerm: string) => {
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return {
    contacts,
    addContact,
    filterContacts,
  };
};
