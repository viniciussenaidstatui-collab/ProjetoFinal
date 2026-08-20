import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useState } from "react";

export default function EditaTarefa({ route, navigation }) {
  const [titulo, setTitulo] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Tarefa</Text>
      <TextInput style={styles.input} placeholder="Título" value={titulo} onChangeText={setTitulo} />
      <Button title="Salvar" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 12 },
});