import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";
import jwtDecode from "jwt-decode";
import { BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const RelatorioScreen = () => {
  const [relatorio, setRelatorio] = useState([]);
  const [mesSelecionado, setMesSelecionado] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarRelatorio();
  }, []);

  const carregarRelatorio = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.usuarioId;
      const headers = { Authorization: `Bearer ${token}` };

      const response = await api.get(`/relatorios/mensal/${userId}`, { headers });

      setRelatorio(response.data);
      setMesSelecionado(response.data[response.data.length - 1]);
    } catch (error) {
      console.error("Erro ao carregar relatório:", error);
      Alert.alert("Erro", "Não foi possível carregar o relatório.");
    } finally {
      setLoading(false);
    }
  };

  const renderMesItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.mesItem,
        mesSelecionado?.mes === item.mes && styles.mesItemSelecionado,
      ]}
      onPress={() => setMesSelecionado(item)}
    >
      <Text style={[styles.mesTexto, mesSelecionado?.mes === item.mes && { color: "#fff" }]}>
        {formatarMes(item.mes)}
      </Text>
    </TouchableOpacity>
  );

  const formatarMes = (mesStr) => {
    const [ano, mes] = mesStr.split("-");
    const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    return `${meses[parseInt(mes) - 1]}/${ano}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Relatório Mensal</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          <FlatList
            data={relatorio}
            horizontal
            keyExtractor={(item) => item.mes}
            renderItem={renderMesItem}
            contentContainerStyle={styles.listaMeses}
            showsHorizontalScrollIndicator={false}
          />

{mesSelecionado && (
  <View style={styles.detalhesContainer}>
    <Text style={styles.mesDetalhe}>{formatarMes(mesSelecionado.mes)}</Text>
    
    <View style={styles.graficoContainer}>
      <BarChart
        data={{
          labels: ["Receita", "Despesa", "Invest.", "Saldo"],
          datasets: [
            {
              data: [
                mesSelecionado.totalReceitas,
                mesSelecionado.totalDespesas,
                mesSelecionado.totalInvestimentos,
                mesSelecionado.saldo
              ]
            }
          ]
        }}
        width={screenWidth - 64} 
        height={260}             
        fromZero
        yAxisLabel="R$ "
        chartConfig={{
          backgroundGradientFrom: "#f4f4f4",
          backgroundGradientTo: "#f4f4f4",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
          labelColor: () => "#000",
          barPercentage: 0.5,
        }}
        style={{ borderRadius: 12 }}
      />
    </View>

    <Text>Receitas: R$ {mesSelecionado.totalReceitas.toFixed(2)}</Text>
    <Text>Despesas: R$ {mesSelecionado.totalDespesas.toFixed(2)}</Text>
    <Text>Investimentos: R$ {mesSelecionado.totalInvestimentos.toFixed(2)}</Text>
    <Text style={{ fontWeight: "bold", marginTop: 10 }}>
      Saldo: R$ {mesSelecionado.saldo.toFixed(2)}
    </Text>
  </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f4", padding: 20 },
  titulo: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },

  listaMeses: { paddingBottom: 10 },
  mesItem: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginHorizontal: 4,
    minWidth: 80,
  },
  mesItemSelecionado: {
    backgroundColor: "#007bff",
  },
  mesTexto: {
    fontWeight: "bold",
    textAlign: "center",
  },

  detalhesContainer: {
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  mesDetalhe: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  graficoContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 0,
    marginHorizontal: 0,
  },
});


export default RelatorioScreen;
