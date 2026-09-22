import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  devolverEmprestimo,
  listarComputadores,
  listarEmprestimosAtivos,
  obterToken,
  removerToken,
  registrarEmprestimo,
} from "../services/api";

export default function Emprestimos({ navigation }) {
  const [computadores, setComputadores] = useState([]);
  const [emprestimos, setEmprestimos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [acaoId, setAcaoId] = useState(null);
  const [erro, setErro] = useState("");

  async function carregar(duranteAtualizacao = false) {
    if (duranteAtualizacao) {
      setAtualizando(true);
    } else {
      setCarregando(true);
    }
    setErro("");

    try {
      const token = await obterToken();

      if (!token) {
        navigation.reset({ index: 0, routes: [{ name: "login" }] });
        return;
      }

      const [computadoresResposta, emprestimosResposta] = await Promise.all([
        listarComputadores(token, "disponivel"),
        listarEmprestimosAtivos(token),
      ]);

      setComputadores(computadoresResposta.computadores || computadoresResposta.data || []);
      setEmprestimos(emprestimosResposta.emprestimos || emprestimosResposta.data || []);
    } catch (error) {
      if (error.status === 401) {
        await removerToken();
        navigation.reset({ index: 0, routes: [{ name: "login" }] });
        return;
      }

      setErro(error.message || "Não foi possível carregar os computadores.");
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => carregar());
    return unsubscribe;
  }, [navigation]);

  async function retirar(computador) {
    setAcaoId(`retirar-${computador.id}`);

    try {
      const token = await obterToken();
      if (!token) {
        navigation.reset({ index: 0, routes: [{ name: "login" }] });
        return;
      }

      const resposta = await registrarEmprestimo(token, computador.id);
      Alert.alert("Retirada realizada", resposta.mensagem || "Computador retirado com sucesso.");
      await carregar(true);
    } catch (error) {
      Alert.alert("Não foi possível retirar", error.message || "Tente novamente.");
    } finally {
      setAcaoId(null);
    }
  }

  function confirmarDevolucao(emprestimo) {
    Alert.alert(
      "Devolver computador",
      `Deseja devolver o computador ${numeroComputador(emprestimo)}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Devolver", onPress: () => devolver(emprestimo) },
      ],
    );
  }

  async function devolver(emprestimo) {
    setAcaoId(`devolver-${emprestimo.id}`);

    try {
      const token = await obterToken();
      if (!token) {
        navigation.reset({ index: 0, routes: [{ name: "login" }] });
        return;
      }

      const resposta = await devolverEmprestimo(token, emprestimo.id);
      Alert.alert("Devolução realizada", resposta.mensagem || "Computador devolvido com sucesso.");
      await carregar(true);
    } catch (error) {
      Alert.alert("Não foi possível devolver", error.message || "Tente novamente.");
    } finally {
      setAcaoId(null);
    }
  }

  function renderComputador({ item }) {
    const retirando = acaoId === `retirar-${item.id}`;

    return (
      <View style={styles.card}>
        <View style={styles.cardIcon}>
          <Text style={styles.cardIconText}>PC</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Computador {item.numero_patrimonio}</Text>
          <Text style={styles.cardMeta}>Disponível para retirada</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
          onPress={() => retirar(item)}
          disabled={acaoId !== null}
        >
          {retirando ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.actionButtonText}>Pegar</Text>}
        </Pressable>
      </View>
    );
  }

  function renderEmprestimo({ item }) {
    const devolvendo = acaoId === `devolver-${item.id}`;

    return (
      <View style={[styles.card, styles.activeCard]}>
        <View style={styles.activeIcon}>
          <Text style={styles.cardIconText}>PC</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Computador {numeroComputador(item)}</Text>
          <Text style={styles.cardMeta}>Retirado em {formatarData(item.retirado_em)}</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.returnButton, pressed && styles.pressed]}
          onPress={() => confirmarDevolucao(item)}
          disabled={acaoId !== null}
        >
          {devolvendo ? <ActivityIndicator color="#3505BF" /> : <Text style={styles.returnButtonText}>Devolver</Text>}
        </Pressable>
      </View>
    );
  }

  const lista = [
    { type: "activeHeader", id: "active-header" },
    ...(emprestimos.length ? emprestimos.map((item) => ({ type: "active", id: `active-${item.id}`, item })) : [{ type: "activeEmpty", id: "active-empty" }]),
    { type: "availableHeader", id: "available-header" },
    ...(computadores.length ? computadores.map((item) => ({ type: "available", id: `available-${item.id}`, item })) : [{ type: "availableEmpty", id: "available-empty" }]),
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={({ pressed }) => [styles.backButton, pressed && styles.pressed]} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <View>
          <Text style={styles.eyebrow}>LABORATÓRIO</Text>
          <Text style={styles.title}>Computadores</Text>
        </View>
      </View>

      {carregando ? (
        <View style={styles.centered}>
          <ActivityIndicator color="#0074FF" size="large" />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.list}
          data={lista}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={atualizando} onRefresh={() => carregar(true)} tintColor="#0074FF" />}
          ListHeaderComponent={erro ? <Text style={styles.error}>{erro}</Text> : null}
          ListEmptyComponent={<Text style={styles.empty}>Nenhum computador disponível no momento.</Text>}
          renderItem={({ item }) => {
            if (item.type === "activeHeader") {
              return <Text style={styles.sectionTitle}>Minha retirada atual</Text>;
            }
            if (item.type === "availableHeader") {
              return <Text style={styles.sectionTitle}>Computadores disponíveis</Text>;
            }
            if (item.type === "activeEmpty") {
              return <Text style={styles.empty}>Você não está com nenhum computador retirado.</Text>;
            }
            if (item.type === "availableEmpty") {
              return <Text style={styles.empty}>Nenhum computador disponível no momento.</Text>;
            }
            return item.type === "active" ? renderEmprestimo({ item: item.item }) : renderComputador({ item: item.item });
          }}
        />
      )}
    </View>
  );
}

function numeroComputador(emprestimo) {
  return emprestimo.computador?.numero_patrimonio || emprestimo.computador_id;
}

function formatarData(valor) {
  if (!valor) return "agora";
  return new Date(valor).toLocaleDateString("pt-BR");
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#D8DEFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
    paddingTop: 28,
    backgroundColor: "#3505BF",
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    marginRight: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  backText: { marginTop: -4, color: "#FFFFFF", fontSize: 32 },
  eyebrow: { marginBottom: 5, color: "#C9D5FF", fontSize: 11, fontWeight: "800", letterSpacing: 1.2 },
  title: { color: "#FFFFFF", fontSize: 28, fontWeight: "800" },
  list: { padding: 20, paddingBottom: 36 },
  sectionTitle: { marginTop: 8, marginBottom: 12, color: "#2D3DAB", fontSize: 16, fontWeight: "800" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 82,
    marginBottom: 12,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    elevation: 2,
    shadowColor: "#2D3DAB",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  activeCard: { borderWidth: 1, borderColor: "#BFCBFF" },
  cardIcon: { alignItems: "center", justifyContent: "center", width: 48, height: 48, borderRadius: 15, backgroundColor: "#E9E2FF" },
  activeIcon: { alignItems: "center", justifyContent: "center", width: 48, height: 48, borderRadius: 15, backgroundColor: "#D8F2EA" },
  cardIconText: { color: "#3505BF", fontSize: 13, fontWeight: "900" },
  cardContent: { flex: 1, marginHorizontal: 12 },
  cardTitle: { color: "#3505BF", fontSize: 15, fontWeight: "800" },
  cardMeta: { marginTop: 5, color: "#497280", fontSize: 12 },
  actionButton: { alignItems: "center", justifyContent: "center", minWidth: 72, height: 38, paddingHorizontal: 12, borderRadius: 11, backgroundColor: "#0074FF" },
  actionButtonText: { color: "#FFFFFF", fontSize: 13, fontWeight: "800" },
  returnButton: { alignItems: "center", justifyContent: "center", minWidth: 78, height: 38, paddingHorizontal: 10, borderWidth: 1, borderColor: "#3505BF", borderRadius: 11 },
  returnButtonText: { color: "#3505BF", fontSize: 12, fontWeight: "800" },
  empty: { paddingVertical: 24, color: "#497280", textAlign: "center" },
  error: { marginBottom: 12, color: "#B42318", fontSize: 13 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  pressed: { opacity: 0.72 },
});