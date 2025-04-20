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

const ListaMetas = () => {
  const [metas, setMetas] = useState([]);

  const carregarMetas = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const decoded = jwtDecode(token);
      const usuarioId = decoded.usuarioId;

      const { data } = await api.get(`/metas/${usuarioId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMetas(data);
    } catch (error) {
      Alert.alert('Erro ao buscar metas');
      console.error(error);
    }
  };

  const removerMeta = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await api.delete(`/metas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      carregarMetas();
    } catch (err) {
      Alert.alert('Erro ao remover meta');
    }
  };

  useEffect(() => {
    carregarMetas();
  }, []);

  const confirmarRemocao = (id) => {
        Alert.alert(
          "Remover Meta",
          "Tem certeza que deseja remover esta Meta?",
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Remover",
              onPress: () => removerMeta(id),
              style: "destructive"
            }
          ]
        );
      };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.descricao}>{item.descricao}</Text>
      <Text>Valor objetivo: R$ {item.valorObjetivo.toFixed(2)}</Text>
      <Text>Prazo: {item.prazoInicial} até {item.prazoFinal}</Text>
      <Text>Status: {item.concluida ? '✅ Concluída' : '⌛ Em andamento'}</Text>

      <Text style={{ marginTop: 5 }}>Investimentos:</Text>
      {item.investimentos && item.investimentos.length > 0 ? (
        item.investimentos.map((inv, i) => (
          <Text key={i}>• R$ {inv.valor.toFixed(2)} - {inv.armazenamentoname}</Text>
        ))
      ) : (
        <Text style={{ fontStyle: 'italic' }}>Nenhum investimento ainda</Text>
      )}
      <TouchableOpacity onPress={() => confirmarRemocao(item.id)}>
        <Text style={styles.remover}>Remover</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.contador}>Total de metas: {metas.length}</Text>

      {metas.length === 0 ? (
        <Text style={styles.vazio}>Nenhuma meta cadastrada.</Text>
      ) : (
        <FlatList
          data={metas}
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

export default ListaMetas;
