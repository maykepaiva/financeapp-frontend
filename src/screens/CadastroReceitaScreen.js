import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import api from '../services/api';
import FormFinanceiro from '../components/FormFinanceiro';

const CadastroReceita = () => {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');
  
  const handleDataChange = (text) => {
    const cleanedText = text.replace(/\D/g, '');
    let formattedText = '';

    if (cleanedText.length > 0) formattedText += cleanedText.substring(0, 2);
    if (cleanedText.length > 2) formattedText += '/' + cleanedText.substring(2, 4);
    if (cleanedText.length > 4) formattedText += '/' + cleanedText.substring(4, 8);

    setData(formattedText);
  };

  const parseDate = (dateString) => {
    const parts = dateString.split('/');
    if (parts.length === 3 && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return date.getDate() === day && date.getMonth() === month && date.getFullYear() === year ? date : null;
    }
    return null;
  };

  const handleSubmit = async () => {
    const dataFormatada = parseDate(data);

    if (!dataFormatada) {
      alert('Por favor, insira uma data válida no formato DD/MM/AAAA.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const decoded = jwtDecode(token);
      const usuarioId = decoded.usuarioId;

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const payload = {
        descricao,
        valor: parseFloat(valor.replace(',', '.')),
        usuarioId: parseInt(usuarioId),
        dataRecebimento: dataFormatada.toISOString().split('T')[0],
      };

      await api.post("/receitas", payload, { headers });

      Alert.alert("Sucesso", "Receita salva com sucesso!");

      setDescricao('');
      setValor('');
      setData('');
    } catch (error) {
      console.error("Erro ao salvar:", error);
      Alert.alert("Erro", "Falha ao enviar os dados.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Receita</Text>
      <FormFinanceiro
        descricao={descricao}
        setDescricao={setDescricao}
        valor={valor}
        setValor={setValor}
        data={data}
        handleDataChange={handleDataChange}
        isReceita={true}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Salvar Receita</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f8f8' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  button: { backgroundColor: '#007bff', padding: 12, borderRadius: 5, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontWeight: 'bold' },
});

export default CadastroReceita;
