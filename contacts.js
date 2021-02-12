const fs = require('fs');
const path = require('path');
const contactsPath = path.join(__dirname, '/db/contacts.json');
const shortid = require('shortid');
require('colors');

function listContacts() {
  fs.readFile(contactsPath, 'utf-8', (err, data) => {
    if (err) return console.error(err.message);

    console.log('List of contacts:'.magenta);
    console.table(JSON.parse(data));
  });
}

function getContactById(contactId) {
  fs.readFile(contactsPath, 'utf-8', (err, data) => {
    if (err) return console.error(err.message);

    const contacts = JSON.parse(data);
    const contact = contacts.find(({ id }) => id === contactId);

    if (!contact)
      return console.error(`Contact with ID ${contactId} not found!`.red);

    console.log(`Contact with ID ${contactId}:`.magenta);
    console.table(contact);
  });
}

function removeContact(contactId) {
  fs.readFile(contactsPath, (err, data) => {
    if (err) return console.error(err.message);

    const contacts = JSON.parse(data);
    const newContacts = contacts.filter(({ id }) => id !== contactId);

    if (contacts.length === newContacts.length) {
      return console.error(`Contact with ID: ${contactId} not found!`.red);
    }

    fs.writeFile(contactsPath, JSON.stringify(newContacts), err => {
      if (err) return console.error(err.message);

      console.log(
        'Contact deleted successfully! New list of contacts:'.magenta,
      );
      console.table(newContacts);
    });
  });
}

function addContact(name, email, phone) {
  fs.readFile(contactsPath, (err, data) => {
    if (err) return console.error(err.message);

    const contacts = JSON.parse(data);

    if (
      contacts.find(
        contact => contact.name.toLowerCase() === name.toLowerCase(),
      )
    )
      return console.warn('This name already exists!'.yellow);

    if (contacts.find(contact => contact.email === email))
      return console.warn('This email already exists!'.yellow);

    if (contacts.find(contact => contact.phone === phone))
      return console.warn('This phone already exists!'.yellow);

    const newContact = { id: shortid.generate(), name, email, phone };
    const newContacts = [...contacts, newContact];

    fs.writeFile(contactsPath, JSON.stringify(newContacts), err => {
      if (err) return console.error(err.message);

      console.log('Contact added successfully! New list of contacts:'.magenta);
      console.table(newContacts);
    });
  });
}

module.exports = { listContacts, getContactById, removeContact, addContact };
