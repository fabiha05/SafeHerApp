// context/ContactsContext.js
import React, { createContext, useState } from "react";

export const ContactsContext = createContext();

export const ContactsProvider = ({ children }) => {
  // Start with empty — user khud add karega
  const [contacts, setContacts] = useState([]);

  return (
    <ContactsContext.Provider value={{ contacts, setContacts }}>
      {children}
    </ContactsContext.Provider>
  );
};
