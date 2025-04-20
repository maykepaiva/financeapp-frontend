import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api"; // Importe a instância api do api.js

const ReceitasDespesasScreen = ({ navigation }) => {
    const [receitas, setReceitas] = useState([]);
    const [despesas, setDespesas] = useState([]);
    const [saldo, setSaldo] = useState(0);
    const [loading, setLoading] = useState(true); // Adiciona estado de carregamento

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        setLoading(true); // Inicia o carregamento
        try {
            const token = await AsyncStorage.getItem("token");
            const responseReceitas = await api.get("/receitas", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const responseDespesas = await api.get("/despesas", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setReceitas(responseReceitas.data);
            setDespesas(responseDespesas.data);

            const totalReceitas = responseReceitas.data.reduce((acc, receita) => acc + receita.valor, 0);
            const totalDespesas = responseDespesas.data.reduce((acc, despesa) => acc + despesa.valor, 0);

            setSaldo(totalReceitas - totalDespesas);
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
            Alert.alert("Erro", "Não foi possível carregar os dados.");
        } finally {
            setLoading(false); // Finaliza o carregamento
        }
    };

    const removerReceita = async (id) => {
        Alert.alert(
            "Remover Receita",
            "Tem certeza que deseja remover esta receita?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Remover",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem("token");
                            await api.delete(`/receitas/${id}`, {
                                headers: { Authorization: `Bearer ${token}` },
                            });
                            carregarDados();
                            Alert.alert("Sucesso", "Receita removida!");
                        } catch (error) {
                            Alert.alert("Erro", "Não foi possível remover a receita.");
                        }
                    },
                },
            ]
        );
    };

    const removerDespesa = async (id) => {
        Alert.alert(
            "Remover Despesa",
            "Tem certeza que deseja remover esta despesa?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Remover",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem("token");
                            await api.delete(`/despesas/${id}`, {
                                headers: { Authorization: `Bearer ${token}` },
                            });
                            carregarDados();
                            Alert.alert("Sucesso", "Despesa removida!");
                        } catch (error) {
                            Alert.alert("Erro", "Não foi possível remover a despesa.");
                        }
                    },
                },
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* ... (restante do código da interface) ... */}
        </View>
    );
};

// Estilos da Tela
const styles = StyleSheet.create({
    // ... (seus estilos) ...
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default ReceitasDespesasScreen;