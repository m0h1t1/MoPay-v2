import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, TextInput, ScrollView, Alert } from 'react-native';

const categories = [
  { name: 'Restaurants', icon: '🍽️' },
  { name: 'Groceries', icon: '🛒' },
  { name: 'Gas', icon: '⛽' },
  { name: 'Travel', icon: '✈️' },
  { name: 'Shopping', icon: '🛍️' },
  { name: 'Entertainment', icon: '🎬' },
  { name: 'Bills', icon: '💡' },
  { name: 'Other', icon: '🔖' },
];

export default function HomePage({ user }) {
  const [aiResult, setAiResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showCategoryScreen, setShowCategoryScreen] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [spendingCategory, setSpendingCategory] = useState('');
  const [spendingLocation, setSpendingLocation] = useState('');
  const [tempLocation, setTempLocation] = useState('');
  const [userCards, setUserCards] = useState([]);
  const [loadingCards, setLoadingCards] = useState(false);

  // Fetch user's cards on mount or when user changes
  useEffect(() => {
    if (!user || !user.id) {
      setUserCards([]);
      return;
    }
    setLoadingCards(true);
    fetch(`http://localhost:3000/cards/${user.id}`)
      .then(res => res.json())
      .then(cards => {
        setUserCards(cards);
      })
      .catch(() => setUserCards([]))
      .finally(() => setLoadingCards(false));
  }, [user]);

  // Handler for Save Dat Money button
  const handleSaveDatMoney = () => {
    setShowCategoryScreen(true);
  };

  // Handler for selecting a category
  const handleSelectCategory = (category) => {
    setSpendingCategory(category);
    setShowCategoryScreen(false);
    setShowLocationModal(true);
  };

  // Handler for location modal Done
  const handleLocationDone = async () => {
    setSpendingLocation(tempLocation);
    setShowLocationModal(false);
    setTempLocation('');
    await runAIWithCurrentValues(spendingCategory, tempLocation);
  };

  // Handler for continue without entering location
  const handleContinueWithoutLocation = async () => {
    setSpendingLocation('');
    setShowLocationModal(false);
    setTempLocation('');
    await runAIWithCurrentValues(spendingCategory, '');
  };

  // AI logic using fetch
  const runAIWithCurrentValues = async (category, location) => {
    if (!userCards || userCards.length === 0) {
      setAiResult('No cards found for this user.');
      setModalVisible(true);
      return;
    }
    setLoading(true);
    setModalVisible(false);
    const cardsString = userCards.map(card => card.card_name).join(', ');
    let prompt = `For a purchase of type: ${category}`;
    if (location && location.trim()) {
      prompt += `, at ${location.trim()}`;
    }
    prompt += `, which of these cards is the best for me to use: ${cardsString}? Please respond with ONLY the card name, nothing else.`;
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer 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`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a helpful assistant that selects the best credit card for purchases. Respond with ONLY the card name, nothing else.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 50
        })
      });
      const data = await response.json();
      console.log('OpenAI API response:', data);
      if (data.error) {
        setAiResult('OpenAI error: ' + data.error.message);
      } else if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
        setAiResult(data.choices[0].message.content.trim());
      } else {
        setAiResult('No response from assistant.');
      }
    } catch (e) {
      setAiResult('Error contacting assistant.');
    }
    setLoading(false);
    setModalVisible(true);
  };

  const isSaveButtonDisabled = loading || !userCards || userCards.length === 0;

  const handleSaveDatMoneyPress = () => {
    if (!userCards || userCards.length === 0) {
      Alert.alert('Please add a card first');
      return;
    }
    handleSaveDatMoney();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Welcome to MoPayAI, {user && user.username ? user.username : ''}
        </Text>
      </View>
      <View style={styles.centerContent}>
        <TouchableOpacity 
          style={[styles.button, isSaveButtonDisabled && styles.buttonDisabled]} 
          activeOpacity={0.75} 
          onPress={handleSaveDatMoneyPress}
          // no disabled prop so onPress always fires
        >
          <Text style={styles.buttonText}>$ave Dat Money</Text>
        </TouchableOpacity>
        {loading && <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#1976D2" />}
      </View>

      {/* Category Selection Screen */}
      <Modal visible={showCategoryScreen} animationType="slide" transparent={false}>
        <View style={styles.categoryScreen}>
          <Text style={styles.categoryTitle}>Select a Spending Category</Text>
          <ScrollView contentContainerStyle={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.name}
                style={styles.categorySquare}
                onPress={() => handleSelectCategory(cat.name)}
                activeOpacity={0.8}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text style={styles.categoryText}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* Location Input Modal */}
      <Modal visible={showLocationModal} animationType="fade" transparent>
        <View style={styles.locationModalOverlay}>
          <View style={styles.locationModalContent}>
            <Text style={styles.locationModalTitle}>Where are you spending? (Optional)</Text>
            <TextInput
              style={styles.locationInput}
              placeholder="Enter location (e.g. McDonald's)"
              value={tempLocation}
              onChangeText={setTempLocation}
            />
            <View style={styles.locationModalButtons}>
              <TouchableOpacity style={styles.locationModalButton} onPress={handleLocationDone}>
                <Text style={styles.locationModalButtonText}>Done</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.locationModalButton} onPress={handleContinueWithoutLocation}>
                <Text style={styles.locationModalButtonText}>Continue Without Entering</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* AI Result Modal */}
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
  buttonDisabled: {
    backgroundColor: '#b0b0b0',
  },
  // Category screen styles
  categoryScreen: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1976D2',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  categorySquare: {
    width: 140,
    height: 140,
    backgroundColor: '#f2f2f2',
    borderRadius: 18,
    margin: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryIcon: {
    fontSize: 44,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  // Location modal styles
  locationModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationModalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    minWidth: 280,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  locationModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1976D2',
    textAlign: 'center',
  },
  locationInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  locationModalButtons: {
    flexDirection: 'column',
    width: '100%',
  },
  locationModalButton: {
    backgroundColor: '#1976D2',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    alignItems: 'center',
  },
  locationModalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // AI Result modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultPopup: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    minWidth: 280,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#1976D2',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 