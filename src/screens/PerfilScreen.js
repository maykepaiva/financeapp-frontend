import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

const PerfilScreen = ({ navigation }) => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDadosUsuario();
  }, []);

  const carregarDadosUsuario = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const response = await api.get("/usuarios/perfil", { headers });
      setNome(response.data.nome);
      setEmail(response.data.email);
    } catch (err) {
      console.error("Erro ao carregar perfil", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSalvar = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      await api.put("/usuarios/perfil", { nome}, { headers });
      alert("Dados atualizados com sucesso!");
    } catch (err) {
      alert("Erro ao atualizar perfil");
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil do Usuário</Text>
      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        <>
          <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome" />
          <TextInput style={styles.input} value={email} editable={false} placeholder="E-mail" />
          <TouchableOpacity style={styles.button} onPress={handleSalvar}>
            <Text style={styles.buttonText}>Salvar Alterações</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Sair da Conta</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f4f4f4" },
  title: { fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 20 },
  input: { width: "80%", height: 50, backgroundColor: "#fff", marginVertical: 10, padding: 10, borderRadius: 8 },
  button: { width: "80%", height: 50, backgroundColor: "#007bff", justifyContent: "center", alignItems: "center", borderRadius: 8, marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  logoutButton: { width: "80%", height: 50, backgroundColor: "#ff4d4d", justifyContent: "center", alignItems: "center", borderRadius: 8, marginTop: 20 },
  logoutText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default PerfilScreen;
