import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons'; 

const MenuScreen = ({ navigation }) => {
  const menuItems = [
    { icon: <Ionicons name="cash-outline" size={24} color="#00BFFF" />, label: "Receitas", screen: "OpcoesReceitas" },
    { icon: <Ionicons name="card-outline" size={24} color="#00BFFF" />, label: "Despesas", screen: "OpcoesDespesas" },
    { icon: <MaterialCommunityIcons name="target" size={24} color="#00BFFF" />, label: "Metas Financeiras", screen: "OpcoesMetas" },
    { icon: <Ionicons name="cash-outline" size={24} color="#00BFFF" />, label: "Investimento", screen: "OpcoesInvestimentos" },
    { icon: <FontAwesome5 name="chart-line" size={22} color="#00BFFF" />, label: "Relatórios", screen: "Relatorio" },
    { icon: <Ionicons name="log-out-outline" size={24} color="#666" />, label: "Sair", screen: "Login" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Olá👋</Text>
      <ScrollView>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem} onPress={() => navigation.navigate(item.screen)}>
            <View style={styles.iconContainer}>{item.icon}</View>
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8', paddingTop: 50, paddingHorizontal: 20 },
  header: { fontSize: 24, fontWeight: '600', marginBottom: 20 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 30,
    alignItems: 'center',
    marginRight: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default MenuScreen;
