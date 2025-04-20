import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const FormFinanceiro = ({ descricao, setDescricao, valor, setValor, data, handleDataChange, isReceita }) => {
  return (
    <>
      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Salário de Abril / Conta de Luz"
        value={descricao}
        onChangeText={setDescricao}
      />

      <Text style={styles.label}>Valor</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 1500.00 / 120.50"
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
      />

      <Text style={styles.label}>{isReceita ? 'Data a Receber' : 'Data a Vencer'}</Text>
      <TextInput
        style={[styles.input, { borderColor: data.length === 10 ? 'gray' : 'blue' }]}
        placeholder="DD/MM/AAAA"
        value={data}
        onChangeText={handleDataChange}
        keyboardType="number-pad"
        maxLength={10}
      />
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
});

export default FormFinanceiro;
