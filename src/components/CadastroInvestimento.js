import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import api from '../services/api';
import { Picker } from '@react-native-picker/picker';

const CadastroInvestimento = () => {
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');
  const [metas, setMetas] = useState([]);
  const [armazenamentos, setArmazenamentos] = useState([]);
  const [metaId, setMetaId] = useState();
  const [armazenamentoId, setArmazenamentoId] = useState();

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const decoded = jwtDecode(token);
      const userId = decoded.usuarioId;

      const metasResponse = await api.get(`/metas/buscar/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const armazenamentoResponse = await api.get(`/armazenamento`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMetas(metasResponse.data);
      setArmazenamentos(armazenamentoResponse.data);
    } catch (error) {
      Alert.alert('Erro ao carregar dados');
      console.error(error);
    }
  };

  const formatarData = (text) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = '';
    if (cleaned.length > 0) formatted += cleaned.substring(0, 2);
    if (cleaned.length > 2) formatted += '/' + cleaned.substring(2, 4);
    if (cleaned.length > 4) formatted += '/' + cleaned.substring(4, 8);
    setData(formatted);
  };

  const parseDataISO = (dataStr) => {
    const [dia, mes, ano] = dataStr.split('/');
    if (!dia || !mes || !ano) return null;
    return `${ano}-${mes}-${dia}`;
  };

  const handleSubmit = async () => {
    if (!valor || !data || !metaId || !armazenamentoId) {
      Alert.alert('Preencha todos os campos');
      return;
    }

    const dataFormatada = parseDataISO(data);
    if (!dataFormatada || data.length !== 10) {
      Alert.alert('Data inválida. Use o formato DD/MM/AAAA');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      await api.post(`/investimentos/${metaId}/${armazenamentoId}`, {
        valor: parseFloat(valor.replace(',', '.')),
        data: dataFormatada
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert('Investimento cadastrado com sucesso!');
      setValor('');
      setData('');
      setMetaId(null);
      setArmazenamentoId(null);
    } catch (err) {
      console.error(err);
      Alert.alert('Erro ao cadastrar investimento');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Meta Financeira</Text>
      <Picker selectedValue={metaId} onValueChange={setMetaId} style={styles.picker}>
        <Picker.Item label="Selecione..." value={null} />
        {metas.map(meta => (
          <Picker.Item key={meta.id} label={meta.descricao} value={meta.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Tipo de Armazenamento</Text>
      <Picker selectedValue={armazenamentoId} onValueChange={setArmazenamentoId} style={styles.picker}>
        <Picker.Item label="Selecione..." value={null} />
        {armazenamentos.map(arm => (
          <Picker.Item key={arm.id} label={arm.nome} value={arm.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Valor do Investimento</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 1500.00"
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Data do Investimento (DD/MM/AAAA)</Text>
      <TextInput
        style={[styles.input, { borderColor: data.length === 10 ? '#ccc' : '#007bff' }]}
        placeholder="DD/MM/AAAA"
        value={data}
        onChangeText={formatarData}
        keyboardType="numeric"
        maxLength={10}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Salvar Investimento</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontWeight: 'bold', marginTop: 10 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    alignItems: 'center',
    borderRadius: 6,
    marginTop: 20
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});

export default CadastroInvestimento;
