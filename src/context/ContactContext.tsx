import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define el tipo para un contacto
export type Contact = {
  id: string;
  name: string;
  phone: string;
};

// Define el tipo para el contexto
type ContactContextType = {
  contacts: Contact[];
  addContact: (contact: Contact) => void;
};

// Inicializar el contexto
const ContactContext = createContext<ContactContextType | undefined>(undefined);

// Proveedor del contexto que envolverá la aplicación
export const ContactProvider = ({ children }: { children: ReactNode }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);

  const addContact = (contact: Contact) => {
    setContacts((prevContacts) => [...prevContacts, contact]);
  };

  return (
    <ContactContext.Provider value={{ contacts, addContact }}>
      {children}
    </ContactContext.Provider>
  );
};

// Hook para usar el contexto
export const useContacts = (): ContactContextType => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContacts debe ser usado dentro de ContactProvider');
  }
  return context;
};
