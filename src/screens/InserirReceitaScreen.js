import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";
import jwt_decode from "jwt-decode";

const InserirReceitaScreen = ({ navigation }) => {
    const [descricao, setDescricao] = useState("");
    const [valor, setValor] = useState("");
    const [dataRecebimento, setDataRecebimento] = useState("");
    const [categoria, setCategoria] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSalvar = async () => {
        if (!descricao || !valor || !dataRecebimento || !categoria) {
            Alert.alert("Erro", "Preencha todos os campos.");
            return;
        }

        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            const decoded = jwt_decode(token);
            const usuarioId = decoded.sub;
            const headers = { Authorization: `Bearer ${token}` };
            await api.post("/receitas", {
                descricao,
                valor: parseFloat(valor), // Converte para BigDecimal no backend
                dataRecebimento,
                categoria,
                usuarioId,
            }, { headers });
            Alert.alert("Sucesso", "Receita adicionada!");
            navigation.goBack();
        } catch (err) {
            console.error("Erro ao adicionar receita", err);
            Alert.alert("Erro", "Falha ao adicionar receita. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Inserir Receita</Text>
            <TextInput style={styles.input} placeholder="Descrição" value={descricao} onChangeText={setDescricao} />
            <TextInput style={styles.input} placeholder="Valor" value={valor} onChangeText={setValor} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Data (YYYY-MM-DD)" value={dataRecebimento} onChangeText={setDataRecebimento} />
            <TextInput style={styles.input} placeholder="Categoria" value={categoria} onChangeText={setCategoria} />
            <TouchableOpacity style={styles.button} onPress={handleSalvar} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? <ActivityIndicator color="#fff" /> : "Salvar"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#f4f4f4" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
    input: { height: 50, backgroundColor: "#fff", padding: 10, borderRadius: 8, marginBottom: 10 },
    button: { backgroundColor: "#007bff", padding: 15, borderRadius: 8, alignItems: "center", marginBottom: 10 },
    cancelButton: { backgroundColor: "#6c757d", padding: 15, borderRadius: 8, alignItems: "center" },
    buttonText: { color: "#fff", fontSize: 16 },
});

export default InserirReceitaScreen;