import { View, Text, StyleSheet, Alert, Pressable, ScrollView } from "react-native";
import { logout, obterToken, removerToken, removerUsuario } from "../services/api";

export default function Home({ navigation }) {
  async function sair() {
    try {
      const token = await obterToken();

      if (token) {
        await logout(token);
      }
    } catch {
      // O token local ainda deve ser removido para encerrar a sessão no app.
    } finally {
      await removerToken();
      await removerUsuario();
      navigation.reset({ index: 0, routes: [{ name: "login" }] });
    }
  }

  function confirmarSaida() {
    Alert.alert("Sair da conta", "Deseja encerrar sua sessão?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: sair },
    ]);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>PAINEL PRINCIPAL</Text>
          <Text style={styles.title}>Olá, seja bem-vindo!</Text>
          
        </View>
       
      </View>

      <Text style={styles.sectionTitle}>Acesso rápido</Text>

      
      <Pressable
        style={({ pressed }) => [styles.actionCard, pressed && styles.buttonPressed]}
        onPress={() => navigation.navigate("cadastro_computador")}
      >
        <View style={[styles.actionIcon, styles.purpleIcon]}>
          <Text style={styles.actionIconText}>+</Text>
        </View>
        <View style={styles.actionCopy}>
          <Text style={styles.actionTitle}>Registrar computador</Text>
          <Text style={styles.actionDescription}>Adicione um computador à sua conta.</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.logoutButton, pressed && styles.buttonPressed]}
        onPress={confirmarSaida}
      >
        <Text style={styles.logoutButtonText}>Sair da conta</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#D8DEFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 42,
  },
  eyebrow: {
    marginBottom: 8,
    color: "#2D3DAB",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  title: {
    maxWidth: 250,
    color: "#3505BF",
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 8,
    color: "#497280",
    fontSize: 15,
  },
  brandMark: {
    alignItems: "center",
    justifyContent: "center",
    width: 54,
    height: 54,
    borderRadius: 17,
    backgroundColor: "#3505BF",
  },
  brandMarkText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
  },
  sectionTitle: {
    marginBottom: 14,
    color: "#2D3DAB",
    fontSize: 16,
    fontWeight: "800",
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 92,
    marginBottom: 14,
    padding: 16,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    shadowColor: "#2D3DAB",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  actionIcon: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    height: 48,
    borderRadius: 15,
  },
  blueIcon: {
    backgroundColor: "#D8DEFF",
  },
  purpleIcon: {
    backgroundColor: "#E9E2FF",
  },
  actionIconText: {
    color: "#3505BF",
    fontSize: 25,
    fontWeight: "700",
  },
  actionCopy: {
    flex: 1,
    marginLeft: 14,
  },
  actionTitle: {
    color: "#3505BF",
    fontSize: 16,
    fontWeight: "800",
  },
  actionDescription: {
    marginTop: 5,
    color: "#497280",
    fontSize: 13,
    lineHeight: 18,
  },
  arrow: {
    marginLeft: 8,
    color: "#0074FF",
    fontSize: 30,
    fontWeight: "300",
  },
  logoutButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#497280",
    borderRadius: 14,
  },
  logoutButtonText: {
    color: "#497280",
    fontSize: 15,
    fontWeight: "700",
  },
  buttonPressed: {
    opacity: 0.78,
  },
});
