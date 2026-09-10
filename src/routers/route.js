import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Splash from "../screens/splash";
import Login from "../screens/login";
import CadastroUser from "../screens/cadastro_user";
import Home from "../screens/home";
import Tarefas from "../screens/tarefas";
import EditaTarefa from "../screens/edita_tarefa";
import CadastroComputador from "../screens/cadastro_computador";

const Stack = createNativeStackNavigator();

export default function Router() {
  return (
    <Stack.Navigator initialRouteName="splash">
      <Stack.Screen name="splash" component={Splash} />
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="cadastro_user" component={CadastroUser} />
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="tarefas" component={Tarefas} />
      <Stack.Screen name="edita_tarefa" component={EditaTarefa} />
      <Stack.Screen name="cadastro_computador" component={CadastroComputador} />
    </Stack.Navigator>
  );
}
