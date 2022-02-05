import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, FAB, CardTitle, List, Card, Divider, IconButton, ActivityIndicator, Dialog, Portal, Button, Provider as PaperProvider } from 'react-native-paper';
import { FormBuilder } from "react-native-paper-form-builder";
import { useForm } from "react-hook-form";
import {
  LineChart,
} from "react-native-chart-kit";
import { deleteDoc, collection, doc, addDoc, getFirestore, onSnapshot, query, where, orderBy, arrayRemove, updateDoc, clearIndexedDbPersistence, getDoc, getDocs, limitToLast } from "firebase/firestore";
import './firebase'
import { clickProps } from 'react-native-web/dist/cjs/modules/forwardedProps';


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
        Categoria: (props.route.params.type == 'arms') ? "Braços" : "Pernas",
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
          {
            name: 'nome',
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
          {
            name: 'notas',
            type: 'text',
            textInputProps: {
              label: 'Notas',
            },
          },
          {
            name: 'peso',
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
          {
            name: 'medida',
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
          {
            name: 'sets',
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
          {
            name: 'reps',
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

function EditExercise(props) {
  const { navigation, route } = props;
 
  const [pending, setPending] = React.useState(false);
  const [ex, setEx] = React.useState(null);
  const submit = async (data) => {

    //Keyboard.dismiss();
    setPending(true);
    try {
      const db = getFirestore();

      if(ex.Peso != data.peso){
        const currDate = new Date();
        await addDoc(collection(db, "historico"), {
          exID: props.route.params.id,
          newWeight: Number(data.peso),
          oldWeight: Number(ex.Peso),
          timestamp: currDate,
        });
      }
      
      await updateDoc(doc(db, "exercicios", props.route.params.id), {
        Nome: data.nome,
        Notas: (data.notas ? data.notas : " "),
        Peso: Number(data.peso),
        Reps: Number(data.reps),
        Sets: Number(data.sets),
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
  useEffect(() => {
    const db = getFirestore();
    const _query = doc(db, "exercicios", props.route.params.id);
    const docSnap = onSnapshot(_query, (doc) => {
      const d = doc.data();
      d.id = doc.id;
      setEx(d);
      
    });
    return docSnap;
  }, []);

  const { control, setFocus, handleSubmit } = useForm({
    mode: 'onChange',
  });

  if (!ex) {
    return <ActivityIndicator/>
}
  return (

    <View style={{ margin: 20 }}>
      <Text>{"Editar exercício: " + ex.Nome}</Text>
      <FormBuilder
        control={control}
        setFocus={setFocus}
        formConfigArray={[
          {
            name: 'nome',
            type: 'text',
            textInputProps: {
              label: 'Nome',
            },
            rules: {
              required: {
                value: true,
                message: 'Nome é obrigatório',
              },
            },
            defaultValue: ex.Nome,
          },
          {
            name: 'notas',
            type: 'text',
            textInputProps: {
              label: 'Notas',
            },
          },
          {
            name: 'peso',
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
            defaultValue: ex.Peso.toString(),
          },
          {
            name: 'medida',
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
            defaultValue: ex.Medida.toString(),
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
          {
            name: 'sets',
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
            defaultValue: ex.Sets.toString(),

          },
          {
            name: 'reps',
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
            defaultValue: ex.Reps.toString(),

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
function AllExercises(props) {
  const [exercise, setExercise] = useState([]);
  const [dialog, setDialog] = useState(false);
  const hide = () => setDialog(false);
  const show = () => setDialog(true);

  useEffect(() => {
    const db = getFirestore();
    const _query = query(collection(db, "exercicios"), where('Categoria', '==', props.type));
    const unsubscribe = onSnapshot(_query, (data) => {
      setExercise(data.docs.map(doc => {

        const data = doc.data();
        data.id = doc.id;
        return data;
      }))
    })

    return unsubscribe;
  }, []);

  return ( //cada exercicio mostra o nome, tu carregas e da drop down, quando da dropdown mostrar o botao de editar e apagar
    <ScrollView>
      <Card.Title title={props.type} />
      {exercise.map((item) => (
        <View>

          <List.Item left={props =>
            <List.Icon {...props}
              icon="eye"
            />
          }
            onPress={() => props.navigation.navigate('Single Exercise', { id: item.id })}
            title={item.Nome}
            key={item.id}
            style={{ backgroundColor: 'grey' }} />
          <List.Item title={"Sets: " + item.Sets} />
          <List.Item title={"Reps: " + item.Reps} />
          <List.Item title={"último peso: " + item.Peso + item.Medida} />



        </View>
      ))}

      <FAB
        small
        icon="plus"
        label="Adicionar novo exercicio"
        uppercase
        onPress={() => props.navigation.navigate('New Exercise', { type: "arms" })} //mudar para ir para o ecrã de novo carregador
      />
    </ScrollView>
  );
}

function SingleEx(props) {
  const { navigation, route } = props;
  const [ex, setEx] = useState({});

  useEffect(async () => {
    const db = getFirestore();
    const _query = doc(db, "exercicios", props.route.params.id);
    const docSnap = onSnapshot(_query, (doc) => {
      const d = doc.data();
      d.id = doc.id;
      setEx(d);
    });

    return docSnap;
  }, []);
  const uwu = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
      }
    ],
    legend: ["Rainy Days"] // optional
  };
  return (
    <View>
      <Card.Title title={ex.Nome} right={() => (
        <View style={{flexDirection: 'row'}}>
        <IconButton
          icon="pencil"
          size={20}
          onPress={() => props.navigation.navigate('Edit Exercise', { id: props.route.params.id })}
        />
        <IconButton
          icon="delete"
          size={20}
          onPress={() => console.log('Apagar')}
        />
        </View>
      )} />

      <List.Item title={"Sets"} right={() => (
        <View>
          <Text>{ex.Sets}</Text>
        </View>
      )} />
      <List.Item title={"Reps"} right={() => (
        <View>
          <Text>{ex.Reps}</Text>
        </View>
      )} />
      <List.Item title={"Peso"} right={() => (
        <View>
          <Text>{ex.Peso + " " + ex.Medida}</Text>
        </View>
      )} />
      <List.Item title={"Notas"} description={ex.Notas} />
      <LineChart

  data={uwu}
  width={220}
  height={220}
  chartConfig={{
    backgroundColor: "#e26a00",
    backgroundGradientFrom: "#fb8c00",
    backgroundGradientTo: "#ffa726",
    decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726"
    }
  }}
/>
      
    </View>
  );
}
const Tab = createMaterialTopTabNavigator();

function HomeScreen({ navigation }) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Upper body day bby" children={() => <AllExercises type={'Braços'} navigation={navigation}/>}/>
      <Tab.Screen name="Never skip leg day" children={() => <AllExercises type={'Pernas'} navigation={navigation}/>} />
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
            <Stack.Screen name="Single Exercise" component={SingleEx} />
            <Stack.Screen name="Edit Exercise" component={EditExercise} />
          </Stack.Navigator>

        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>

  );
}


/**/