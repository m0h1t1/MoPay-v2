import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';

export default function HomePage({ user }) {
  const [aiResult, setAiResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const sendPrompt = async (prompt) => {
    setLoading(true);
    setAiResult('');
    try {
      const res = await fetch('http://localhost:3000/assistant/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setAiResult(data.reply);
      setModalVisible(true);
    } catch (e) {
      setAiResult('Error contacting assistant');
      setModalVisible(true);
    }
    setLoading(false);
  };

  const spendingCategory = "restaurants";
  const spendingLocation = "Chipotle";
  const cards = "Chase Sapphire Preferred, Citi Double Cash, American Express: Gold";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Welcome to MoPayAI, {user && user.username ? user.username : ''}
        </Text>
      </View>
      <View style={styles.centerContent}>
        <TouchableOpacity 
          style={styles.button} 
          activeOpacity={0.75} 
          onPress={() => sendPrompt(`For a purchase of type: ${spendingCategory}, at ${spendingLocation}, which of these cards is the best for me to use: ${cards}?`)} 
          disabled={loading}
        >
          <Text style={styles.buttonText}>$ave Dat Money</Text>
        </TouchableOpacity>
        {loading && <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#1976D2" />}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.resultPopup}>
              <Text style={styles.resultText}>{aiResult}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
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
    paddingTop: '25%',
    paddingBottom: '10%',
    paddingHorizontal: '5%',
    width: '100%',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#1976D2',
    width: 375,
    height: 375,
    borderRadius: 200,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultPopup: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    minWidth: 260,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  resultText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 18,
    color: '#222',
  },
  closeButton: {
    backgroundColor: '#1976D2',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 