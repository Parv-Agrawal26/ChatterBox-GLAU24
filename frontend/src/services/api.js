const API_BASE_URL = "http://localhost:5000/api";

export const fetchMessages = async (selectedUserId) => {
  const response = await fetch(`${API_BASE_URL}/messages/${selectedUserId}`, {
    credentials: "include",
  });
  return response.json();
};

export const sendMessage = async (receiverId, content) => {
  const response = await fetch(`${API_BASE_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ receiverId, content }),
  });
  return response.json();
};

export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  return response.json();
};

export const register = async (username, email, password) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
    credentials: "include",
  });
  return response.json();
};

export const logout = async () => {
  return fetch(`${API_BASE_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });
};

export const fetchUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    credentials: "include",
  });
  return response.json();
};
