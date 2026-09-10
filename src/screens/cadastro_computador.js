import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { obterToken, registrarComputador, removerToken, validarToken } from "../services/api";

export default function CadastroComputador({ navigation }) {
  const [numero, setNumero] = useState("");
  const [senhaConfirmacao, setSenhaConfirmacao] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [carregandoUsuario, setCarregandoUsuario] = useState(true);
  const [usuario, setUsuario] = useState({});

  useEffect(() => {
    async function carregarUsuario() {
      try {
        const token = await obterToken();

        if (!token) {
          navigation.reset({ index: 0, routes: [{ name: "login" }] });
          return;
        }

        const resposta = await validarToken(token);
        const dados = resposta.usuario || resposta.user || resposta.data || resposta;

        setUsuario({
          nome: dados.nome,
          cpf: dados.cpf,
          email: dados.email,
          dataNascimento: dados.data_nascimento || dados.dataNascimento,
        });
      } catch (error) {
        if (error.status === 401) {
          await removerToken();
          navigation.reset({ index: 0, routes: [{ name: "login" }] });
        }
      } finally {
        setCarregandoUsuario(false);
      }
    }

    carregarUsuario();
  }, [navigation]);

  async function cadastrar() {
    if (!numero || !senhaConfirmacao) {
      Alert.alert("Dados incompletos", "Informe o número e sua senha.");
      return;
    }

    setCarregando(true);
    try {
      const token = await obterToken();

      if (!token) {
        navigation.reset({ index: 0, routes: [{ name: "login" }] });
        return;
      }

      const resposta = await registrarComputador(token, numero, senhaConfirmacao);
      Alert.alert("Computador registrado", resposta.mensagem, [
        { text: "Voltar para Home", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      if (error.status === 401) {
        await removerToken();
        Alert.alert("Sessão expirada", "Faça login novamente.", [
          { text: "Ir para login", onPress: () => navigation.reset({ index: 0, routes: [{ name: "login" }] }) },
        ]);
        return;
      }

      Alert.alert("Não foi possível registrar", error.message || "Tente novamente.");
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

          <Text style={styles.headerTitle}>Registrar computador</Text>
      
        </View>

        <View style={styles.body}>
          <Text style={styles.sectionTitle}>Dados do usuário</Text>
          <Text style={styles.sectionDescription}>Informações vinculadas ao cadastro atual.</Text>

          {carregandoUsuario ? (
            <ActivityIndicator color="#0074FF" style={styles.userLoading} />
          ) : (
            <View style={styles.userFields}>
              <View style={styles.fullField}>
                <Text style={styles.label}>Nome</Text>
                <TextInput style={styles.readOnlyInput} value={usuario.nome || "Ocultado"} editable={false} />
              </View>
              <View style={styles.splitFields}>
                <View style={styles.halfField}>
                  <Text style={styles.label}>CPF</Text>
                  <TextInput style={styles.readOnlyInput} value={usuario.cpf || "Ocultado"} editable={false} />
                </View>
                <View style={styles.halfField}>
                  <Text style={styles.label}>E-mail</Text>
                  <TextInput style={styles.readOnlyInput} value={usuario.email || "Ocultado"} editable={false} />
                </View>
              </View>
              <View style={styles.fullField}>
                <Text style={styles.label}>Data de nascimento</Text>
                <TextInput
                  style={styles.readOnlyInput}
                  value={usuario.dataNascimento || "Ocultado"}
                  editable={false}
                />
              </View>
            </View>
          )}

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Dados do computador</Text>
          <Text style={styles.sectionDescription}>Informe os dados necessários para realizar o registro.</Text>

          <Text style={styles.label}>Número do computador</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 001"
            placeholderTextColor="#497280"
            value={numero}
            onChangeText={setNumero}
            keyboardType="numeric"
            autoFocus
          />

          <Text style={styles.label}>Confirme sua senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            placeholderTextColor="#497280"
            value={senhaConfirmacao}
            onChangeText={setSenhaConfirmacao}
            secureTextEntry
          />

          <Pressable
            style={({ pressed }) => [styles.registerButton, pressed && styles.buttonPressed]}
            onPress={cadastrar}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.registerButtonText}>Registrar computador</Text>
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
    padding: 20,
  },
  header: {
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "#3505BF",
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 38,
    height: 38,
    marginBottom: 20,
    borderRadius: 11,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  backButtonText: {
    marginTop: -4,
    color: "#FFFFFF",
    fontSize: 30,
    lineHeight: 34,
  },
  headerIcon: {
    alignItems: "center",
    justifyContent: "center",
    width: 56,
    height: 56,
    marginBottom: 16,
    borderRadius: 15,
    backgroundColor: "#0074FF",
  },
  headerIconText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "800",
  },
  headerSubtitle: {
    marginTop: 6,
    color: "#D8DEFF",
    fontSize: 14,
  },
  body: {
    padding: 22,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: "#FFFFFF",
    shadowColor: "#2D3DAB",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 4,
  },
  sectionTitle: {
    color: "#3505BF",
    fontSize: 18,
    fontWeight: "800",
  },
  sectionDescription: {
    marginTop: 5,
    marginBottom: 16,
    color: "#497280",
    fontSize: 13,
    lineHeight: 19,
  },
  userLoading: {
    marginVertical: 24,
  },
  userFields: {
    gap: 12,
  },
  fullField: {
    width: "100%",
  },
  splitFields: {
    flexDirection: "row",
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  label: {
    marginBottom: 7,
    color: "#2D3DAB",
    fontSize: 13,
    fontWeight: "700",
  },
  readOnlyInput: {
    height: 48,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#D8DEFF",
    borderRadius: 10,
    backgroundColor: "#F5F6FF",
    color: "#497280",
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginVertical: 26,
    backgroundColor: "#D8DEFF",
  },
  input: {
    height: 52,
    marginBottom: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#D8DEFF",
    borderRadius: 12,
    color: "#2D3DAB",
    fontSize: 15,
  },
  registerButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    marginTop: 4,
    borderRadius: 12,
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
