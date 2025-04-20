import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

const FormMetaFinanceira = ({
  descricao, setDescricao,
  valor, setValor,
  prazoInicial, setPrazoInicial,
  prazoFinal, setPrazoFinal
}) => {
  const handleDataChange = (setter) => (text) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = '';
    if (cleaned.length > 0) formatted += cleaned.substring(0, 2);
    if (cleaned.length > 2) formatted += '/' + cleaned.substring(2, 4);
    if (cleaned.length > 4) formatted += '/' + cleaned.substring(4, 8);
    setter(formatted);
  };

  return (
    <View>
      <Text>Descrição</Text>
      <TextInput 
      style={styles.input} 
      value={descricao} 
      onChangeText={setDescricao}
      placeholder="Ex: Comprar casa, carro, viagem..." />

      <Text>Valor Objetivo</Text>
      <TextInput style={styles.input} 
      value={valor} 
      onChangeText={setValor} 
      keyboardType="numeric"
      placeholder="Ex: 10000.00"
      />

      <Text>Prazo Inicial (DD/MM/AAAA)</Text>
      <TextInput
        style={styles.input}
        value={prazoInicial}
        onChangeText={handleDataChange(setPrazoInicial)}
        keyboardType="numeric"
        maxLength={10}
        placeholder="DD/MM/AAAA"
      />

      <Text>Prazo Final (DD/MM/AAAA)</Text>
      <TextInput
        style={styles.input}
        value={prazoFinal}
        onChangeText={handleDataChange(setPrazoFinal)}
        keyboardType="numeric"
        maxLength={10}
        placeholder="DD/MM/AAAA"
      />
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

export default FormMetaFinanceira;
