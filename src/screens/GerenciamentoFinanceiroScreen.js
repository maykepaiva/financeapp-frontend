import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

const GerenciamentoFinanceiroScreen = ({ navigation }) => {
  const [receitas, setReceitas] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("receita");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDadosFinanceiros();
  }, []);

  const carregarDadosFinanceiros = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const receitasRes = await api.get("/receitas/1", { headers });
      const despesasRes = await api.get("/despesas/1", { headers });
      setReceitas(receitasRes.data);
      setDespesas(despesasRes.data);
    } catch (err) {
      console.error("Erro ao carregar dados financeiros", err);
    } finally {
      setLoading(false);
    }
  };

  const adicionarTransacao = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const endpoint = tipo === "receita" ? "/receitas" : "/despesas";
      await api.post(endpoint, { descricao, valor: parseFloat(valor) }, { headers });
      setDescricao("");
      setValor("");
      carregarDadosFinanceiros();
    } catch (err) {
      console.error("Erro ao adicionar transação", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciamento de Finanças</Text>
      <TextInput style={styles.input} placeholder="Descrição" value={descricao} onChangeText={setDescricao} />
      <TextInput style={styles.input} placeholder="Valor" value={valor} onChangeText={setValor} keyboardType="numeric" />
      <View style={styles.toggleContainer}>
        <TouchableOpacity style={[styles.toggleButton, tipo === "receita" && styles.selected]} onPress={() => setTipo("receita")}>
          <Text style={styles.toggleText}>Receita</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toggleButton, tipo === "despesa" && styles.selected]} onPress={() => setTipo("despesa")}>
          <Text style={styles.toggleText}>Despesa</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={adicionarTransacao}>
        <Text style={styles.buttonText}>Adicionar</Text>
      </TouchableOpacity>
      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        <FlatList
          data={[...receitas, ...despesas]}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.transacao}>{item.descricao} - R$ {parseFloat(item.valor).toFixed(2)}</Text>
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
  toggleContainer: { flexDirection: "row", marginVertical: 10 },
  toggleButton: { flex: 1, padding: 10, alignItems: "center", borderWidth: 1, borderRadius: 8, marginHorizontal: 5 },
  selected: { backgroundColor: "#007bff", borderColor: "#007bff" },
  toggleText: { color: "#000" },
  button: { width: "80%", height: 50, backgroundColor: "#007bff", justifyContent: "center", alignItems: "center", borderRadius: 8, marginTop: 20 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  card: { width: "100%", padding: 15, backgroundColor: "#fff", borderRadius: 8, marginBottom: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  transacao: { fontSize: 16, fontWeight: "bold" },
});

export default GerenciamentoFinanceiroScreen;