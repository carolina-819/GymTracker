import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {Appbar, Button, DarkTheme, DefaultTheme, Provider as PaperProvider, useTheme} from 'react-native-paper';
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

function Braços() {
  return (
    <View><Text>Aqui veem se os exercicios de braços</Text></View>
  )
}
function Pernas() {
  return (
    <View><Text>Aqui veem se os exercicios de pernas</Text></View>
  )
}
export default function App() {
  return (
    <View style={styles.container}>
      <Tab.Navigator>
      <Tab.Screen name="Braços" component={Braços} />
      <Tab.Screen name="Pernas" component={Pernas} />
    </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
