import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, FAB } from 'react-native-paper';
import { FormBuilder } from "react-native-paper-form-builder";
import { useForm } from "react-hook-form";
import { deleteDoc, collection, doc, addDoc, getFirestore, onSnapshot, query, where, orderBy, arrayRemove, updateDoc, clearIndexedDbPersistence, getDoc, getDocs } from "firebase/firestore";
import './firebase'

function Bracos({navigation}) {
  const [arms, setArms] = useState([]);
  useEffect(() => {
    const db = getFirestore();
    const _query = query(collection(db, "exercicios"), where('Categoria', '==', 'Braços'));
    const unsubscribe = onSnapshot(_query, (data) => {
      setArms(data.docs.map(doc => {

        const data = doc.data();
        data.id = doc.id;
        console.log(doc.Nome);
        return data;
      }))
    })

    return unsubscribe;
  }, []);
  return ( //cada exercicio mostra o nome, tu carregas e da drop down, quando da dropdown mostrar o botao de editar e apagar
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Os teus exercicios</Text>
      {arms.map((braco) => (
        <View>
        <Text key={braco.id} >{"Nome " + braco.Nome}</Text>
        <Text>{"Sets: " + braco.Sets}</Text>
        <Text>{"Reps: " + braco.Reps}</Text>
        <Text>{"último peso: " + braco.Peso + braco.Medida}</Text>
        <Text>   </Text>
        </View>
      ))}
      <FAB
            small
            icon="plus"
            label="Adicionar novo exercicio"
            uppercase
            onPress={() => navigation.navigate('NewExercise', {type: "arms"})} //mudar para ir para o ecrã de novo carregador
          />
      </View>
  );
}
function NewExercise(props){
  const { control, setFocus, handleSubmit } = useForm({
    mode: 'onChange',
  });
  return(
    
    <View style={{ margin: 20 }}>
     <Text>{"woeoea adicionar: " + props.route.params.type}</Text>
        </View>
  );
}

function Pernas({navigation}) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Aqui veem se os exercicios de pernas</Text></View>
  );
}
const Tab = createMaterialTopTabNavigator();

function HomeScreen({ navigation }){
  return(
    <Tab.Navigator>
          <Tab.Screen name="Upper body day bby" component={Bracos} />
          <Tab.Screen name="Never skip leg day" component={Pernas} />
        </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <SafeAreaProvider>
      
      <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="NewExercise" component={NewExercise} />
      </Stack.Navigator>
        
      </NavigationContainer>
    </SafeAreaProvider>
  );
}


/**/