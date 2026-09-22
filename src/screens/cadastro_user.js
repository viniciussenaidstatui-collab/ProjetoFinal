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
  const [diaNascimento, setDiaNascimento] = useState("");
  const [mesNascimento, setMesNascimento] = useState("");
  const [anoNascimento, setAnoNascimento] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function cadastrar() {
    const dataNascimento = `${anoNascimento}-${mesNascimento.padStart(2, "0")}-${diaNascimento.padStart(2, "0")}`;
    const dataValida = validarDataNascimento(diaNascimento, mesNascimento, anoNascimento);

    if (!nome || !email || !senha || !cpf || !diaNascimento || !mesNascimento || !anoNascimento) {
      Alert.alert("Dados incompletos", "Preencha todos os campos.");
      return;
    }

    if (!dataValida) {
      Alert.alert("Data inválida", "Informe uma data de nascimento válida no formato dia, mês e ano.");
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
          <View style={styles.dateInput}>
            <Text style={styles.calendarIcon}>▣</Text>
            <View style={styles.datePart}>
              <TextInput
                style={styles.datePartInput}
                placeholder="DD"
                placeholderTextColor="#8493B8"
                value={diaNascimento}
                onChangeText={(value) => setDiaNascimento(value.replace(/\D/g, "").slice(0, 2))}
                keyboardType="number-pad"
                maxLength={2}
              />
              <Text style={styles.datePartLabel}>dia</Text>
            </View>
            <Text style={styles.dateSeparator}>/</Text>
            <View style={styles.datePart}>
              <TextInput
                style={styles.datePartInput}
                placeholder="MM"
                placeholderTextColor="#8493B8"
                value={mesNascimento}
                onChangeText={(value) => setMesNascimento(value.replace(/\D/g, "").slice(0, 2))}
                keyboardType="number-pad"
                maxLength={2}
              />
              <Text style={styles.datePartLabel}>mês</Text>
            </View>
            <Text style={styles.dateSeparator}>/</Text>
            <View style={[styles.datePart, styles.yearPart]}>
              <TextInput
                style={styles.datePartInput}
                placeholder="AAAA"
                placeholderTextColor="#8493B8"
                value={anoNascimento}
                onChangeText={(value) => setAnoNascimento(value.replace(/\D/g, "").slice(0, 4))}
                keyboardType="number-pad"
                maxLength={4}
              />
              <Text style={styles.datePartLabel}>ano</Text>
            </View>
          </View>
          <Text style={styles.inputHint}>Use sua data real de nascimento</Text>

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
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    height: 64,
    marginBottom: 4,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#D8DEFF",
    borderRadius: 14,
    backgroundColor: "#F8F9FF",
  },
  calendarIcon: {
    marginRight: 12,
    color: "#0074FF",
    fontSize: 21,
  },
  datePart: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 42,
  },
  yearPart: {
    minWidth: 66,
  },
  datePartInput: {
    width: "100%",
    padding: 0,
    color: "#3505BF",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },
  datePartLabel: {
    marginTop: 2,
    color: "#8493B8",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  dateSeparator: {
    marginHorizontal: 5,
    color: "#8493B8",
    fontSize: 20,
    fontWeight: "600",
  },
  inputHint: {
    marginBottom: 16,
    color: "#8493B8",
    fontSize: 12,
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

function validarDataNascimento(dia, mes, ano) {
  if (!/^\d{1,2}$/.test(dia) || !/^\d{1,2}$/.test(mes) || !/^\d{4}$/.test(ano)) {
    return false;
  }

  const data = new Date(Number(ano), Number(mes) - 1, Number(dia));
  const hoje = new Date();

  return (
    data.getFullYear() === Number(ano) &&
    data.getMonth() === Number(mes) - 1 &&
    data.getDate() === Number(dia) &&
    data <= hoje
  );
}
