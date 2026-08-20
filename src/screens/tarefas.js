import { View, Text, FlatList, StyleSheet } from "react-native";

const tarefasMock = [
  { id: "1", titulo: "Estudar React Native" },
  { id: "2", titulo: "Terminar projeto SENAI" },
];

export default function Tarefas({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tarefas</Text>
      <FlatList
        data={tarefasMock}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.item} onPress={() => navigation.navigate("edita_tarefa", { id: item.id })}>
            {item.titulo}
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  item: { padding: 12, borderBottomWidth: 1, borderColor: "#eee" },
});