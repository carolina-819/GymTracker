import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, FAB, List, Card, Divider, IconButton, Dialog, Portal, Button, Provider as PaperProvider } from 'react-native-paper';
import { FormBuilder } from "react-native-paper-form-builder";
import { useForm } from "react-hook-form";
import { deleteDoc, collection, doc, addDoc, getFirestore, onSnapshot, query, where, orderBy, arrayRemove, updateDoc, clearIndexedDbPersistence, getDoc, getDocs } from "firebase/firestore";
import './firebase'

function Bracos({ navigation }) {
  const [arms, setArms] = useState([]);
  const [dialog, setDialog] = useState(false);
  const hide = () => setDialog(false);
  const show = () => setDialog(true);

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
    <View style={{ flex: 1 }}>
      <Card.Title title="Os teus exercicios" />
      <List.AccordionGroup>
        {arms.map((braco) => (
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flex: 1}}>
            <List.Accordion title={braco.Nome} id={braco.id} onLongPress={show} style={{backgroundColor: 'transparent'}}>
              <List.Item title={"Sets: " + braco.Sets} />
              <List.Item title={"Reps: " + braco.Reps} />
              <List.Item title={"último peso: " + braco.Peso + braco.Medida} />
            </List.Accordion>
            </View>
            <IconButton onPress={() => console.log('Pressed')} icon="delete"/>
            <IconButton onPress={() => console.log('Pressed')} icon="pencil" />
          </View>
        ))}
      </List.AccordionGroup>

      <FAB
        small
        icon="plus"
        label="Adicionar novo exercicio"
        uppercase
        onPress={() => navigation.navigate('New Exercise', { type: "arms" })} //mudar para ir para o ecrã de novo carregador
      />
    </View>
  );
}
function NewExercise(props) {
  const { navigation, route } = props;
  const { control, setFocus, handleSubmit } = useForm({
    mode: 'onChange',
  });
  const [pending, setPending] = React.useState(false);
  const submit = async (data) => {

    //Keyboard.dismiss();
    setPending(true);
    try {
      const db = getFirestore();

      await addDoc(collection(db, "exercicios"), {
        Nome: data.nome,
        Notas: (data.notas ? data.notas : " "),
        Peso: Number(data.peso),
        Reps: Number(data.reps),
        Sets: Number(data.sets),
        Categoria: (props.route.params.type == 'arms') ? "Braços" : "Pernas" ,
        Medida: data.medida
      });


      //setNotification("New charger added");
      navigation.goBack();
      console.log("done");

    } catch (e) {
      //setNotification(e.message)
      console.log(e);
    }

    setPending(false);
  };

  return (

    <View style={{ margin: 20 }}>
      <Text>{"woeoea adicionar: " + props.route.params.type}</Text>
      <FormBuilder
        control={control}
        setFocus={setFocus}
        formConfigArray={[
          {name: 'nome',
            type: 'text',
            textInputProps: {
              label: 'Name',
            },
            rules: {
              required: {
                value: true,
                message: 'Nome é obrigatório',
              },
            },
          },
          {name: 'notas',
            type: 'text',
            textInputProps: {
              label: 'Notas',
            },
          },
          {name: 'peso',
            type: 'text',
            textInputProps: {
              label: 'Peso',
            },
            rules: {
              required: {
                value: true,
                message: 'Peso é obrigatório',
              },
            },
          },
          {name: 'medida',
            type: 'select',
            textInputProps: {
              label: 'Medida',
            },
            rules: {
              required: {
                value: true,
                message: 'Medida é pbrigatória',
              },
            },
            options: [
              {
                id: 1,
                value: 'Kg',
                label: 'Kg',
              },
              {
                id: 2,
                value: 'Lbs',
                label: 'Lbs',
              },
            ],
          },
          {name: 'sets',
            type: 'text',
            textInputProps: {
              label: 'Sets',
            },
            rules: {
              required: {
                value: true,
                message: 'Sets é obrigatório',
              },
            },
            
          },
          { name: 'reps',
            type: 'text',
            textInputProps: {
              label: 'Reps',
            },
            rules: {
              required: {
                value: true,
                message: 'Reps é obrigatório',
              },
            },
            
          },

        ]} />
        <Button mode="contained" disabled={pending} onPress={handleSubmit(submit)}>
          Guardar Alterações
        </Button>
        <Button mode="contained" onPress={navigation.goBack} color="#787878">
          Cancelar
        </Button>
    </View>
  );
}

function Pernas({ navigation }) {
  const [legs, setLegs] = useState([]);
  const [dialog, setDialog] = useState(false);
  const hide = () => setDialog(false);
  const show = () => setDialog(true);

  useEffect(() => {
    const db = getFirestore();
    const _query = query(collection(db, "exercicios"), where('Categoria', '==', 'Pernas'));
    const unsubscribe = onSnapshot(_query, (data) => {
      setLegs(data.docs.map(doc => {

        const data = doc.data();
        data.id = doc.id;
        console.log(doc.Nome);
        return data;
      }))
    })

    return unsubscribe;
  }, []);

  return ( //cada exercicio mostra o nome, tu carregas e da drop down, quando da dropdown mostrar o botao de editar e apagar
    <View style={{ flex: 1 }}>
      <Card.Title title="Os teus exercicios" />
      <List.AccordionGroup>
        {legs.map((perna) => (
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flex: 1}}>
            <List.Accordion title={perna.Nome} id={perna.id} onLongPress={show} style={{backgroundColor: 'transparent'}}>
              <List.Item title={"Sets: " + perna.Sets} />
              <List.Item title={"Reps: " + perna.Reps} />
              <List.Item title={"último peso: " + perna.Peso + perna.Medida} />
            </List.Accordion>
            </View>
            <IconButton onPress={() => console.log('Pressed')} icon="delete"/>
            <IconButton onPress={() => console.log('Pressed')} icon="pencil" />
          </View>
        ))}
      </List.AccordionGroup>

      <FAB
        small
        icon="plus"
        label="Adicionar novo exercicio"
        uppercase
        onPress={() => navigation.navigate('New Exercise', { type: "legs" })} //mudar para ir para o ecrã de novo carregador
      />
    </View>
  );
}
const Tab = createMaterialTopTabNavigator();

function HomeScreen({ navigation }) {
  return (
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
       <PaperProvider>

      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="New Exercise" component={NewExercise} />
        </Stack.Navigator>

      </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
    
  );
}


/**/