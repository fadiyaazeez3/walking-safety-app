import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";

export default function ContactScreen() {
  const [number, setNumber] = useState("");
  const [contacts, setContacts] = useState<string[]>([]);

  useEffect(() => {
    loadContacts();
  }, []);

  const saveContact = async () => {
    if (!number) return;

    const updated = [...contacts, number];
    setContacts(updated);

    await AsyncStorage.setItem("emergencyContacts", JSON.stringify(updated));

    setNumber("");
    Alert.alert("Saved", "Contact added!");
  };

  const loadContacts = async () => {
    const saved = await AsyncStorage.getItem("emergencyContacts");
    if (saved) setContacts(JSON.parse(saved));
  };

  const deleteContact = async (num: string) => {
    const updated = contacts.filter(c => c !== num);
    setContacts(updated);
    await AsyncStorage.setItem("emergencyContacts", JSON.stringify(updated));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Contacts</Text>

      <TextInput
        placeholder="Enter phone number"
        value={number}
        onChangeText={setNumber}
        style={styles.input}
        keyboardType="phone-pad"
      />

      <Button title="Add Contact" onPress={saveContact} />

      <FlatList
        data={contacts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.contactRow}>
            <Text style={styles.contact}>{item}</Text>
            <Button title="Delete" onPress={() => deleteContact(item)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  contact: {
    fontSize: 16,
  },
});