/**
 * Zugriff auf das Adressbuch des Geräts via Expo Contacts
 */
import * as Contacts from "expo-contacts";

export const requestContactsPermission = async (): Promise<boolean> => {
  const { status } = await Contacts.requestPermissionsAsync();
  return status === "granted";
};

export const pickDeviceContacts = async () => {
  const granted = await requestContactsPermission();
  if (!granted) return [];

  const { data } = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
  });

  return data.filter((c) => c.phoneNumbers && c.phoneNumbers.length > 0);
};
