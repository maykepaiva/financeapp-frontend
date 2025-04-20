import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import api from '../services/api';

const ListaInvestimentos = () => {
  const [investimentos, setInvestimentos] = useState([]);

  const carregarInvestimentos = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const decoded = jwtDecode(token);
      const usuarioId = decoded.usuarioId;

      const { data } = await api.get(`/investimentos/${usuarioId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvestimentos(data);
    } catch (error) {
      Alert.alert('Erro ao buscar investimentos');
      console.error(error);
    }
  };

  const removerInvestimento = (id) => {
    Alert.alert(
      "Confirmar exclusão",
      "Deseja realmente remover este investimento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              await api.delete(`/investimentos/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              carregarInvestimentos();
            } catch (err) {
              Alert.alert('Erro ao remover investimento');
            }
          }
        }
      ]
    );
  };

  const formatDate = (dataStr) => {
    if (!dataStr) return '';
    const [ano, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  useEffect(() => {
    carregarInvestimentos();
  }, []);

  const confirmarRemocao = (id) => {
      Alert.alert(
        "Remover Investimento",
        "Tem certeza que deseja remover este investimento?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Remover",
            onPress: () => removerInvestimento(id),
            style: "destructive"
          }
        ]
      );
    };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.descricao}>Investimento</Text>
      <Text>Valor investido: R$ {item.valor?.toFixed(2)}</Text>
      <Text>Data: {formatDate(item.data)}</Text>
      <Text>Investimento: {item.armazenamentoname}</Text>

      <TouchableOpacity style={styles.botaoRemover} onPress={() => confirmarRemocao(item.id)}>
        <Text style={styles.remover}>Remover</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.contador}>Total de investimentos: {investimentos.length}</Text>

      {investimentos.length === 0 ? (
        <Text style={styles.vazio}>Nenhum investimento cadastrado.</Text>
      ) : (
        <FlatList
          data={investimentos}
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
    color: '#333',
  },
  remover: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  botaoRemover: {
    backgroundColor: 'red',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'flex-start',
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
  },
});

export default ListaInvestimentos;
