import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import api from '../services/api';
import FormFinanceiro from '../components/FormFinanceiro';

const SimpleForm = () => {
  const [isReceita, setIsReceita] = useState(true);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');
  const [categoria, setCategoria] = useState('');

  const handleHeaderButtonClick = (isReceitaSelected) => {
    setIsReceita(isReceitaSelected);
    setDescricao('');
    setValor('');
    setData('');
    setCategoria('');
  };

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

    let usuarioId = null;

    try {
      const token = await AsyncStorage.getItem("token");
      const decoded = jwtDecode(token);
      usuarioId = decoded.usuarioId;

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const payload = {
        descricao,
        valor: parseFloat(valor.replace(',', '.')),
        categoria,
        usuarioId: parseInt(usuarioId),
      };

      const dataISO = dataFormatada.toISOString().split('T')[0];
      isReceita ? payload.dataRecebimento = dataISO : payload.dataPagamento = dataISO;

      const endpoint = isReceita ? "/receitas" : "/despesas";
      await api.post(endpoint, payload, { headers });

      Alert.alert("Sucesso", "Lançamento salvo com sucesso!");

      setDescricao('');
      setValor('');
      setData('');
      setCategoria('');
    } catch (error) {
      console.error("Erro ao salvar:", error);
      Alert.alert("Erro", "Falha ao enviar os dados. Verifique o preenchimento ou conexão.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerButtons}>
        <TouchableOpacity
          style={[styles.headerButton, isReceita && { backgroundColor: '#007bff' }]}
          onPress={() => handleHeaderButtonClick(true)}
        >
          <Text style={[styles.headerButtonText, isReceita && { color: 'white' }]}>Inserir Receita</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.headerButton, !isReceita && { backgroundColor: '#dc3545' }]}
          onPress={() => handleHeaderButtonClick(false)}
        >
          <Text style={[styles.headerButtonText, !isReceita && { color: 'white' }]}>Inserir Despesa</Text>
        </TouchableOpacity>
      </View>

      <FormFinanceiro
        descricao={descricao}
        setDescricao={setDescricao}
        valor={valor}
        setValor={setValor}
        data={data}
        handleDataChange={handleDataChange}
        categoria={categoria}
        setCategoria={setCategoria}
        isReceita={isReceita}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f8f8', justifyContent: 'flex-start' },
  button: { backgroundColor: '#007bff', paddingVertical: 12, borderRadius: 5, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  headerButtons: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  headerButton: { backgroundColor: '#e0e0e0', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 },
  headerButtonText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
});

export default SimpleForm;
