import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

export default function ProfileScreen({ user, onLogout }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>
      {user && (
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Username:</Text>
          <Text style={styles.infoValue}>{user.username}</Text>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{user.email}</Text>
          <Text style={styles.infoLabel}>Phone:</Text>
          <Text style={styles.infoValue}>{user.phone}</Text>
        </View>
      )}
      <View style={styles.spacer} />
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout} activeOpacity={0.8}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
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
    paddingBottom: '5%',
    paddingHorizontal: '5%',
    width: '100%',
  },
  infoBox: {
    backgroundColor: '#f2f2f2',
    borderRadius: 18,
    padding: 20,
    marginHorizontal: '7%',
    marginBottom: 20,
    marginTop: 10,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
    marginTop: 6,
  },
  infoValue: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  spacer: {
    flex: 1,
  },
  logoutButton: {
    backgroundColor: '#D32F2F',
    width: '85%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: '5%',
  },
  logoutText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
}); 