import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/screens/LoginScreen";
import CadastroScreen from "./src/screens/CadastroScreen";
import DetalhesFinanceirosScreen from "./src/screens/DetalhesFinanceiros";
import MenuScreen from "./src/screens/MenuScreen";
import OpcoesMetas from "./src/screens/OpcoesMetasScreen";
import ListaMetasScreen from "./src/screens/ListaMetasScreen";
import CadastrarMetaScreen from "./src/screens/CadastroMetaScreen";
import CadastroReceita from "./src/screens/CadastroReceitaScreen";
import CadastroDespesa from "./src/screens/CadastroDespesaScreen";
import CadastroInvestimento from "./src/components/CadastroInvestimento";
import RelatorioScreen from "./src/screens/RelatorioScreen";
import ListarReceitas from "./src/screens/ListarReceitas";
import ListarDespesas from "./src/screens/ListarDespesas";
import ListarInvestimentos from "./src/screens/ListarInvestimentos";
import OpcoesReceitas from "./src/screens/OpcoesReceitasScreen";
import OpcoesDespesas from "./src/screens/OpcoesDespesasScreen";
import OpcoesInvestimentos from "./src/screens/OpcoesInvestimentosScreen";


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="DetalhesFinanceiros" component={DetalhesFinanceirosScreen} /> 
        <Stack.Screen name="OpcoesMetas" component={OpcoesMetas} /> 
        <Stack.Screen name="ListaMetas" component={ListaMetasScreen} /> 
        <Stack.Screen name="CadastrarMetas" component={CadastrarMetaScreen} /> 
        <Stack.Screen name="CadastroReceita" component={CadastroReceita} /> 
        <Stack.Screen name="CadastroDespesa" component={CadastroDespesa} /> 
        <Stack.Screen name="CadastroInvestimento" component={CadastroInvestimento} /> 
        <Stack.Screen name="Relatorio" component={RelatorioScreen} /> 
        <Stack.Screen name="ListarReceitas" component={ListarReceitas} /> 
        <Stack.Screen name="ListarDespesas" component={ListarDespesas} />
        <Stack.Screen name="ListarInvestimentos" component={ListarInvestimentos} />
        <Stack.Screen name="OpcoesReceitas" component={OpcoesReceitas} />
        <Stack.Screen name="OpcoesDespesas" component={OpcoesDespesas} />
        <Stack.Screen name="OpcoesInvestimentos" component={OpcoesInvestimentos} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
