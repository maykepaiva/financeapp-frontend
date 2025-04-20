import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import api from '../services/api';

const ListaDespesas = () => {
  const [despesas, setDespesas] = useState([]);

  const carregarDespesas = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const decoded = jwtDecode(token);
      const usuarioId = decoded.usuarioId;

      const { data } = await api.get(`/despesas/${usuarioId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDespesas(data);
    } catch (error) {
      Alert.alert('Erro ao buscar despesas');
      console.error(error);
    }
  };

  const confirmarRemocao = (id) => {
    Alert.alert(
      "Remover Despesa",
      "Tem certeza que deseja remover esta despesa?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          onPress: () => removerDespesa(id),
          style: "destructive"
        }
      ]
    );
  };

  const removerDespesa = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await api.delete(`/despesas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      carregarDespesas();
    } catch (err) {
      Alert.alert('Erro ao remover despesa');
    }
  };
  const formatDate = (dataStr) => {
    if (!dataStr) return '';
    const [ano, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  useEffect(() => {
    carregarDespesas();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.descricao}>{item.descricao}</Text>
      <Text>Valor: R$ {item.valor.toFixed(2)}</Text>
      <Text>Data de Vencimento: {formatDate(item.dataPagamento)}</Text>
      <TouchableOpacity onPress={() => confirmarRemocao(item.id)}>
        <Text style={styles.remover}>Remover</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.contador}>Total de despesas: {despesas.length}</Text>

      {despesas.length === 0 ? (
        <Text style={styles.vazio}>Nenhuma despesa cadastrada.</Text>
      ) : (
        <FlatList
          data={despesas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  descricao: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  remover: {
    color: 'red',
    marginTop: 5,
  },
  vazio: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#777',
  },
  contador: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  }
});

export default ListaDespesas;
