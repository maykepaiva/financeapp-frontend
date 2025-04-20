import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

const MetasFinanceirasScreen = ({ navigation }) => {
  const [metas, setMetas] = useState([]);
  const [descricao, setDescricao] = useState("");
  const [valorObjetivo, setValorObjetivo] = useState("");
  const [prazoFinal, setPrazoFinal] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarMetas();
  }, []);

  const carregarMetas = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const response = await api.get("/metas", { headers });
      setMetas(response.data);
    } catch (err) {
      console.error("Erro ao carregar metas financeiras", err);
    } finally {
      setLoading(false);
    }
  };

  const adicionarMeta = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      await api.post("/metas", { descricao, valorObjetivo: parseFloat(valorObjetivo), prazoFinal }, { headers });
      setDescricao("");
      setValorObjetivo("");
      setPrazoFinal("");
      carregarMetas();
    } catch (err) {
      console.error("Erro ao adicionar meta", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Metas Financeiras</Text>
      <TextInput style={styles.input} placeholder="Descrição" value={descricao} onChangeText={setDescricao} />
      <TextInput style={styles.input} placeholder="Valor Objetivo" value={valorObjetivo} onChangeText={setValorObjetivo} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Prazo Final (YYYY-MM-DD)" value={prazoFinal} onChangeText={setPrazoFinal} />
      <TouchableOpacity style={styles.button} onPress={adicionarMeta}>
        <Text style={styles.buttonText}>Adicionar Meta</Text>
      </TouchableOpacity>
      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        <FlatList
          data={metas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.metaTitulo}>{item.descricao}</Text>
              <Text>Objetivo: R$ {parseFloat(item.valorObjetivo).toFixed(2)}</Text>
              <Text>Prazo: {item.prazoFinal}</Text>
              <Text>Status: {item.concluida ? "Concluída" : "Em andamento"}</Text>
            </View>
          )}
        />
      )}
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f4f4f4", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 20 },
  input: { width: "80%", height: 50, backgroundColor: "#fff", marginVertical: 10, padding: 10, borderRadius: 8 },
  button: { width: "80%", height: 50, backgroundColor: "#007bff", justifyContent: "center", alignItems: "center", borderRadius: 8, marginTop: 20 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  card: { width: "100%", padding: 15, backgroundColor: "#fff", borderRadius: 8, marginBottom: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  metaTitulo: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
});

export default MetasFinanceirasScreen;
