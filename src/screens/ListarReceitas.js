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

const ListaReceitas = () => {
  const [receitas, setReceitas] = useState([]);

  const carregarReceitas = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const decoded = jwtDecode(token);
      const usuarioId = decoded.usuarioId;

      const { data } = await api.get(`/receitas/${usuarioId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReceitas(data);
    } catch (error) {
      Alert.alert('Erro ao buscar receitas');
      console.error(error);
    }
  };
  const formatDate = (dataStr) => {
    if (!dataStr) return '';
    const [ano, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const removerReceita = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await api.delete(`/receitas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      carregarReceitas();
    } catch (err) {
      Alert.alert('Erro ao remover receita');
    }
  };

  useEffect(() => {
    carregarReceitas();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.descricao}>{item.descricao}</Text>
      <Text>Valor: R$ {item.valor.toFixed(2)}</Text>
      <Text>Data: {formatDate(item.dataRecebimento)}</Text>
      <TouchableOpacity onPress={() => confirmarRemocao(item.id)}>
        <Text style={styles.remover}>Remover</Text>
      </TouchableOpacity>
    </View>
  );

  const confirmarRemocao = (id) => {
      Alert.alert(
        "Remover Receita",
        "Tem certeza que deseja remover esta receita?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Remover",
            onPress: () => removerReceita(id),
            style: "destructive"
          }
        ]
      );
    };

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.contador}>Total de receitas: {receitas.length}</Text>

      {receitas.length === 0 ? (
        <Text style={styles.vazio}>Nenhuma receita cadastrada.</Text>
      ) : (
        <FlatList
          data={receitas}
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

export default ListaReceitas;
