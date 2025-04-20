import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import api from '../services/api';
import FormMetaFinanceira from '../components/FormMetaFinanceira';

const CadastroMetaScreen = ({ navigation }) => {
  const [descricao, setDescricao] = useState('');
  const [valorObjetivo, setValorObjetivo] = useState('');
  const [prazoInicial, setPrazoInicial] = useState('');
  const [prazoFinal, setPrazoFinal] = useState('');

  const formatarData = (data) => {
    const partes = data.split('/');
    if (partes.length === 3) {
      return `${partes[2]}-${partes[1]}-${partes[0]}`;
    }
    return null;
  };

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem("token");
    const decoded = jwtDecode(token);
    const usuarioId = decoded.usuarioId;

    const meta = {
      descricao,
      valorObjetivo: parseFloat(valorObjetivo.replace(',', '.')),
      prazoInicial: formatarData(prazoInicial),
      prazoFinal: formatarData(prazoFinal),
      usuarioId,
    };

    try {
      await api.post("/metas", meta, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert("Sucesso", "Meta cadastrada com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao cadastrar meta:", error);
      Alert.alert("Erro", "Não foi possível cadastrar a meta.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastrar Nova Meta</Text>
      <FormMetaFinanceira
        descricao={descricao}
        setDescricao={setDescricao}
        valor={valorObjetivo}
        setValor={setValorObjetivo}
        prazoInicial={prazoInicial}
        setPrazoInicial={setPrazoInicial}
        prazoFinal={prazoFinal}
        setPrazoFinal={setPrazoFinal}
      />
      <TouchableOpacity style={styles.botao} onPress={handleSubmit}>
        <Text style={styles.botaoTexto}>Salvar Meta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f8f8' },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  botao: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CadastroMetaScreen;
