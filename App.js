import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import Router from './src/routers/route';

export default function App() {
  return (
    <NavigationContainer>
      <Router />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}