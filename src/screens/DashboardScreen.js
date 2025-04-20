import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";
import { PieChart } from "react-native-chart-kit";
import jwtDecode from "jwt-decode";

const DashboardScreen = ({ navigation }) => {
    const [receitas, setReceitas] = useState([]);
    const [despesas, setDespesas] = useState([]);
    const [saldo, setSaldo] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDadosFinanceiros();
    }, []);

    const fetchDadosFinanceiros = async () => {
        try {
            setLoading(true); // Inicia o carregamento
            const token = await AsyncStorage.getItem("token");
            const decoded = jwtDecode(token);
            const userId = decoded.usuarioId;
            const headers = { Authorization: `Bearer ${token}` };
            const receitasRes = await api.get(`/receitas/${userId}`, { headers });
            const despesasRes = await api.get(`/despesas/${userId}`, { headers });
            setReceitas(receitasRes.data);
            setDespesas(despesasRes.data);
            calcularSaldo(receitasRes.data, despesasRes.data);
        } catch (err) {
            console.error("Erro ao buscar dados financeiros", err);
            Alert.alert("Erro", "Falha ao carregar dados. Tente novamente.");
        } finally {
            setLoading(false); // Finaliza o carregamento
        }
    };

    const calcularSaldo = (receitas, despesas) => {
        const totalReceitas = receitas.reduce((sum, r) => sum + parseFloat(r.valor), 0);
        const totalDespesas = despesas.reduce((sum, d) => sum + parseFloat(d.valor), 0);
        setSaldo(totalReceitas - totalDespesas);
    };

    const dataChart = [
        { name: "Receitas", population: saldo >= 0 ? saldo : 0, color: "#4CAF50", legendFontColor: "#000", legendFontSize: 12 },
        { name: "Despesas", population: saldo < 0 ? -saldo : 0, color: "#F44336", legendFontColor: "#000", legendFontSize: 12 }
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Visão Geral</Text>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007bff" />
                </View>
            ) : (
                <>
                    <PieChart
                        data={dataChart}
                        width={300}
                        height={180}
                        chartConfig={{
                            backgroundColor: "#f4f4f4",
                            backgroundGradientFrom: "#f4f4f4",
                            backgroundGradientTo: "#f4f4f4",
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        }}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        absolute
                    />
                    <Text style={styles.saldo}>Saldo Atual: R$ {saldo.toFixed(2)}</Text>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Menu")}>
                        <Text style={styles.buttonText}>Gerenciar Finanças</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.refreshButton} onPress={fetchDadosFinanceiros}>
                        <Text style={styles.buttonText}>Atualizar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.financialDetailsButton} onPress={() => navigation.navigate("DetalhesFinanceiros")}>
                        <Text style={styles.buttonText}>Detalhes Financeiros</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f4f4f4" },
  title: { fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 10 },
  saldo: { fontSize: 20, fontWeight: "bold", marginVertical: 10 },
  button: { width: "80%", height: 50, backgroundColor: "#007bff", justifyContent: "center", alignItems: "center", borderRadius: 8, marginTop: 20 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  refreshButton: { width: "80%", height: 50, backgroundColor: "#28a745", justifyContent: "center", alignItems: "center", borderRadius: 8, marginTop: 10 },
  financialDetailsButton: { width: "80%", height: 50, backgroundColor: "#6c757d", justifyContent: "center", alignItems: "center", borderRadius: 8, marginTop: 10 },
});

export default DashboardScreen;

//deletar