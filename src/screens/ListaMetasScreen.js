import React from 'react';
import { View, StyleSheet } from 'react-native';
import ListaMetas from '../components/ListaMetas';

const ListaMetasScreen = () => {
  return (
    <View style={styles.container}>
      <ListaMetas />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
});

export default ListaMetasScreen;
