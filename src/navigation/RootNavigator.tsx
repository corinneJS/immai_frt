import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { IconButton } from 'react-native-paper';

// Import des écrans
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/main/HomeScreen';
import ChatScreen from '../screens/main/ChatScreen';
import ExercisesScreen from '../screens/main/ExercisesScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import MeditationListScreen from '../screens/main/meditation/MeditationListScreen';
import MeditationDetailScreen from '../screens/main/meditation/MeditationDetailScreen';
import MeditationPlayerScreen from '../screens/main/meditation/MeditationPlayerScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        
        switch (route.name) {
          case 'Home':
            iconName = 'home';
            break;
          case 'Chat':
            iconName = 'chat';
            break;
          case 'Exercises':
            iconName = 'meditation';
            break;
          case 'Profile':
            iconName = 'account';
            break;
          default:
            iconName = 'circle';
        }

        return <IconButton icon={iconName} size={size} iconColor={color} />;
      },
      headerShown: true,
      tabBarActiveTintColor: '#6200ee',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen 
      name="Home" 
      component={HomeScreen}
      options={{ title: 'Accueil' }}
    />
    <Tab.Screen 
      name="Chat" 
      component={ChatScreen}
      options={{ title: 'Discussion' }}
    />
    <Tab.Screen 
      name="Exercises" 
      component={ExercisesNavigator}
      options={{ title: 'Exercices', headerShown: false }}
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{ title: 'Profil' }}
    />
  </Tab.Navigator>
);

const ExercisesNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="ExercisesList" 
      component={ExercisesScreen}
      options={{ title: 'Exercices' }}
    />
    <Stack.Screen 
      name="MeditationList" 
      component={MeditationListScreen}
      options={{ title: 'Méditations' }}
    />
    <Stack.Screen 
      name="MeditationDetail" 
      component={MeditationDetailScreen}
      options={{ title: 'Détails de la méditation' }}
    />
    <Stack.Screen 
      name="MeditationPlayer" 
      component={MeditationPlayerScreen}
      options={{ 
        title: 'Méditation en cours',
        headerTransparent: true,
        headerTintColor: '#fff'
      }}
    />
  </Stack.Navigator>
);

const RootNavigator = () => {
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);

  return (
    <Stack.Navigator>
      {!isAuthenticated ? (
        // Stack d'authentification
        <Stack.Group screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Group>
      ) : (
        // Stack principal
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;