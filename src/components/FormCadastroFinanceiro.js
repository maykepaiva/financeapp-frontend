import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

const FormFinanceiro = ({
  descricao,
  setDescricao,
  valor,
  setValor,
  data,
  handleDataChange,
  categoria,
  setCategoria,
}) => {
  return (
    <View>
      <Text>Descrição</Text>
      <TextInput style={styles.input} value={descricao} onChangeText={setDescricao} />

      <Text>Valor</Text>
      <TextInput
        style={styles.input}
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
      />

      <Text>Data (DD/MM/AAAA)</Text>
      <TextInput style={styles.input} value={data} onChangeText={handleDataChange} />

      <Text>Categoria</Text>
      <TextInput style={styles.input} value={categoria} onChangeText={setCategoria} />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default FormFinanceiro;
