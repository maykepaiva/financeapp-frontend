import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

const SugestaoInvestimentoScreen = ({ navigation }) => {
  const [investimentos, setInvestimentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buscarSugestoes();
  }, []);

  const buscarSugestoes = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const response = await api.get("/investimentos/sugestoes", { headers });
      setInvestimentos(response.data);
    } catch (err) {
      console.error("Erro ao buscar sugestões de investimento", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sugestões de Investimento</Text>
      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        <FlatList
          data={investimentos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.investTitle}>{item.tipoInvestimento}</Text>
              <Text>Valor Mínimo: R$ {item.valorMinimo.toFixed(2)}</Text>
              <Text>Risco: {item.risco}</Text>
              <Text>{item.descricao}</Text>
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
  card: { width: "100%", padding: 15, backgroundColor: "#fff", borderRadius: 8, marginBottom: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  investTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  button: { width: "80%", height: 50, backgroundColor: "#007bff", justifyContent: "center", alignItems: "center", borderRadius: 8, marginTop: 20 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default SugestaoInvestimentoScreen;
