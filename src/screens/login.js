import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { login, salvarToken, salvarUsuario } from "../services/api";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    if (!email || !senha) {
      Alert.alert("Dados incompletos", "Informe seu e-mail e senha.");
      return;
    }

    setCarregando(true);
    try {
      const resposta = await login(email.trim(), senha);

      if (resposta.erro === "s" || !resposta.token) {
        Alert.alert("Não foi possível entrar", resposta.mensagem || "E-mail ou senha inválidos.");
        return;
      }

      await salvarToken(resposta.token);
      const dadosUsuario = resposta.usuario || resposta.user || resposta.data || {};
      await salvarUsuario({
        nome: dadosUsuario.nome,
        cpf: dadosUsuario.cpf,
        email: dadosUsuario.email || email.trim(),
        dataNascimento: dadosUsuario.data_nascimento || dadosUsuario.dataNascimento,
      });
      navigation.reset({ index: 0, routes: [{ name: "home" }] });
    } catch (error) {
      Alert.alert("Erro no login", error.message || "Verifique a conexão com a API.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
       
       


        <View style={styles.formCard}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="seuemail@exemplo.com"
            placeholderTextColor="#497280"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            placeholderTextColor="#497280"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          <Pressable
            style={({ pressed }) => [styles.loginButton, pressed && styles.buttonPressed]}
            onPress={entrar}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Entrar</Text>
            )}
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.registerButton, pressed && styles.buttonPressed]}
            onPress={() => navigation.navigate("cadastro_user")}
            disabled={carregando}
          >
            <Text style={styles.registerButtonText}>Criar uma conta</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D8DEFF",
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  brandMark: {
    alignItems: "center",
    justifyContent: "center",
    width: 58,
    height: 58,
    marginBottom: 22,
    borderRadius: 18,
    backgroundColor: "#3505BF",
    shadowColor: "#2D3DAB",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  brandMarkText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
  },
  eyebrow: {
    marginBottom: 8,
    color: "#2D3DAB",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  title: {
    color: "#3505BF",
    fontSize: 30,
    fontWeight: "800",
  },
  subtitle: {
    maxWidth: 300,
    marginTop: 8,
    marginBottom: 28,
    color: "#497280",
    fontSize: 15,
    lineHeight: 22,
  },
  formCard: {
    padding: 22,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    shadowColor: "#2D3DAB",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 4,
  },
  label: {
    marginBottom: 8,
    color: "#2D3DAB",
    fontSize: 13,
    fontWeight: "700",
  },
  input: {
    height: 52,
    marginBottom: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#D8DEFF",
    borderRadius: 14,
    backgroundColor: "#F8F9FF",
    color: "#3505BF",
    fontSize: 15,
  },
  loginButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    marginTop: 4,
    borderRadius: 14,
    backgroundColor: "#0074FF",
    shadowColor: "#0074FF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.24,
    shadowRadius: 10,
    elevation: 3,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  registerButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    marginTop: 8,
    borderRadius: 14,
  },
  registerButtonText: {
    color: "#3505BF",
    fontSize: 15,
    fontWeight: "700",
  },
  buttonPressed: {
    opacity: 0.78,
  },
});
