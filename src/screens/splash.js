import { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { obterToken, removerToken, validarToken } from "../services/api";

export default function Splash({ navigation }) {
  useEffect(() => {
    async function verificarSessao() {
      try {
        const token = await obterToken();

        if (!token) {
          navigation.replace("login");
          return;
        }

        await validarToken(token);
        navigation.replace("home");
      } catch {
        await removerToken();
        navigation.replace("login");
      }
    }

    verificarSessao();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task App</Text>
      <ActivityIndicator size="large" style={{ marginTop: 16 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold" },
});
