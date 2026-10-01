import * as SecureStore from "expo-secure-store";

export const API_URL = "http://10.0.2.2:8000/api";
const TOKEN_KEY = "usuario_token";
const USER_KEY = "usuario_dados";

async function request(path, options = {}) {
  const headers = { ...options.headers };
  const authorization = headers.Authorization;

  if (authorization?.startsWith("Bearer ")) {
    headers.Cookie = `token_usuario=${authorization.slice("Bearer ".length)}`;
    delete headers.Authorization;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },
  });

  const data = await response.json().catch(() => ({})); 

  if (!response.ok) {
    const validationErrors = data.errors
      ? Object.values(data.errors).flat().join("\n")
      : null;
    const error = new Error(validationErrors || data.mensagem || "Não foi possível concluir a solicitação.");
    error.status = response.status;
    throw error;
  }

  return data;
}

export function login(email, senha) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify({ email, senha }),
  });
}

export function cadastrarUsuario(dados) {
  return request("/cadastro_usuario", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

export function validarToken(token) {
  return request("/token/validate", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function registrarComputador(token, numero, senhaConfirmacao) {
  return request("/computadores", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      numero_patrimonio: String(numero).trim(),
      senha_confirmacao: senhaConfirmacao,
    }),
  });
}

export function listarComputadores(token, status) {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";

  return request(`/computadores${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function registrarEmprestimo(token, computadorId) {
  return request("/emprestimos", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ computador_id: computadorId }),
  });
}

export function devolverEmprestimo(token, emprestimoId) {
  return request(`/emprestimos/${emprestimoId}/devolver`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function listarEmprestimosAtivos(token) {
  return request("/emprestimos/ativos", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function logout(token) {
  return request("/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function salvarToken(token) {
  return SecureStore.setItemAsync(TOKEN_KEY, token);
}

export function salvarUsuario(usuario) {
  return SecureStore.setItemAsync(USER_KEY, JSON.stringify(usuario));
}

export function obterToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function obterUsuario() {
  const dados = await SecureStore.getItemAsync(USER_KEY);
  return dados ? JSON.parse(dados) : null;
}

export function removerToken() {
  return SecureStore.deleteItemAsync(TOKEN_KEY);
}

export function removerUsuario() {
  return SecureStore.deleteItemAsync(USER_KEY);
}
