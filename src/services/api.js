import * as SecureStore from "expo-secure-store";

export const API_URL = "http://10.0.2.2:8000/api";
const TOKEN_KEY = "usuario_token";
const USER_KEY = "usuario_dados";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
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
      numero: Number(numero),
      senha_confirmacao: senhaConfirmacao,
    }),
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
