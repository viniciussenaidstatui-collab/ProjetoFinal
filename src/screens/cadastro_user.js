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
import { cadastrarUsuario, login, salvarToken, salvarUsuario } from "../services/api";

export default function CadastroUser({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function cadastrar() {
    if (!nome || !email || !senha || !cpf || !dataNascimento) {
      Alert.alert("Dados incompletos", "Preencha todos os campos.");
      return;
    }

    setCarregando(true);
    try {
      const resposta = await cadastrarUsuario({
        nome: nome.trim(),
        email: email.trim(),
        senha,
        cpf: cpf.replace(/\D/g, ""),
        data_nascimento: dataNascimento,
      });

      if (resposta.erro === "s") {
        Alert.alert("Não foi possível cadastrar", resposta.mensagem);
        return;
      }

      const loginResposta = await login(email.trim(), senha);

      if (loginResposta.erro === "s" || !loginResposta.token) {
        Alert.alert("Cadastro realizado", "Faça login para continuar.", [
          { text: "Ir para login", onPress: () => navigation.replace("login") },
        ]);
        return;
      }

      await salvarToken(loginResposta.token);
      await salvarUsuario({
        nome: nome.trim(),
        cpf: cpf.replace(/\D/g, ""),
        email: email.trim(),
        dataNascimento: dataNascimento,
      });
      navigation.reset({ index: 0, routes: [{ name: "home" }] });
    } catch (error) {
      Alert.alert("Erro no cadastro", error.message || "Verifique os dados e tente novamente.");
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
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}
            onPress={() => navigation.goBack()}
            disabled={carregando}
          >
            <Text style={styles.backButtonText}>‹</Text>
          </Pressable>
          <View>
            
            <Text style={styles.title}>Crie sua conta</Text>
           
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Nome completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Como podemos chamar você?"
            placeholderTextColor="#497280"
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
          />

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
            placeholder="Mínimo de 6 caracteres"
            placeholderTextColor="#497280"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          <Text style={styles.label}>CPF</Text>
          <TextInput
            style={styles.input}
            placeholder="Somente números"
            placeholderTextColor="#497280"
            value={cpf}
            onChangeText={setCpf}
            keyboardType="numeric"
            maxLength={14}
          />

          <Text style={styles.label}>Data de nascimento</Text>
          <TextInput
            style={styles.input}
            placeholder="AAAA-MM-DD"
            placeholderTextColor="#497280"
            value={dataNascimento}
            onChangeText={setDataNascimento}
            keyboardType="numbers-and-punctuation"
            maxLength={10}
          />

          <Pressable
            style={({ pressed }) => [styles.registerButton, pressed && styles.buttonPressed]}
            onPress={cadastrar}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.registerButtonText}>Criar minha conta</Text>
            )}
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
  header: {
    marginBottom: 24,
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    marginBottom: 18,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  backButtonText: {
    marginTop: -4,
    color: "#3505BF",
    fontSize: 32,
    lineHeight: 36,
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
    maxWidth: 320,
    marginTop: 8,
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
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#D8DEFF",
    borderRadius: 14,
    backgroundColor: "#F8F9FF",
    color: "#3505BF",
    fontSize: 15,
  },
  registerButton: {
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
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  buttonPressed: {
    opacity: 0.78,
  },
});
