import React from 'react';
import { View, StyleSheet } from 'react-native';
import CadastroInvestimento from '../components/CadastroInvestimento';

const CadastroInvestimentoScreen = () => {
  return (
    <View style={styles.container}>
      <CadastroInvestimento />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4'
  }
});

export default CadastroInvestimentoScreen;
