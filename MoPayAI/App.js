import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from './screens/HomePage';
import ProfileScreen from './screens/ProfileScreen';
import AddCardPage from './screens/AddCardPage';
import LoginScreen from './screens/LoginScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState, useEffect } from 'react';

const Tab = createBottomTabNavigator();

export default function App() {
  const [jwt, setJwt] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!jwt) {
      setUser(null);
      return;
    }
    fetch('http://localhost:3000/users/me', {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then(res => res.json())
      .then(
        data => {
          console.log(data);
          setUser(data);
        }
      )
      .catch(() => setUser(null));
  }, [jwt]);

  if (!jwt) {
    return <LoginScreen onLogin={setJwt} />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            height: '7.5%',
            paddingTop: '2%',
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'AddCard') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home">
          {() => <HomePage jwt={jwt} user={user} />}
        </Tab.Screen>
        <Tab.Screen name="AddCard" component={AddCardPage} />
        <Tab.Screen name="Profile">
          {() => <ProfileScreen user={user} onLogout={() => setJwt(null)} />}
        </Tab.Screen>
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: 'white',
    paddingTop: '10%',
    paddingHorizontal: '5%',
    width: '100%',
  },
});
