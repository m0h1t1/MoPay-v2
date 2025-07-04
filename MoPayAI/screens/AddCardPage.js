import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import creditCards from '../credit_cards.json';

export default function AddCardPage() {
  const [open, setOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [items, setItems] = useState([
    { label: 'Select card to add...', value: null, disabled: true },
    ...creditCards.map(card => ({ label: card, value: card })),
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [customCard, setCustomCard] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const userCards = [
    'Chase Sapphire Preferred',
    'Citi Double Cash',
    'Amex Gold',
  ];

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Add Card</Text>
        </View>
        <View style={styles.dropdownContainer}>
          <DropDownPicker
            open={open}
            value={selectedCard}
            items={items}
            setOpen={setOpen}
            setValue={setSelectedCard}
            setItems={setItems}
            placeholder="Select card to add..."
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownBox}
            searchable={true}
            searchPlaceholder="Search cards..."
            searchContainerStyle={styles.searchContainer}
            searchTextInputStyle={styles.searchInput}
            listItemContainerStyle={styles.listItemContainer}
            listItemLabelStyle={styles.listItemLabel}
            textStyle={styles.pickerText}
          />
        </View>
        <TouchableOpacity 
          style={[styles.addButton, !selectedCard && styles.addButtonDisabled]}
          activeOpacity={0.8} 
          disabled={!selectedCard}
        >
          <Text style={styles.addButtonText}>Add Card</Text>
        </TouchableOpacity>

        {/* My Cards Section */}
        <View style={styles.myCardsSection}>
          <Text style={styles.myCardsTitle}>My Cards</Text>
          {userCards.length === 0 ? (
            <Text style={styles.noCardsText}>You have no cards yet.</Text>
          ) : (
            userCards.map((card, idx) => (
              <View key={card + idx} style={styles.cardItem}>
                <Text style={styles.cardItemText}>{card}</Text>
              </View>
            ))
          )}
        </View>
      </View>

      <View style={styles.infoBoxBottom}>
        <Text style={styles.infoText}>
          Don't see your card? Enter your card name below and we'll add it to the database ASAP.
        </Text>
        <TouchableOpacity style={styles.submitCardButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.submitCardButtonText}>Request Card</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Suggest a Card</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter card name"
              value={customCard}
              onChangeText={setCustomCard}
            />
            <TouchableOpacity
              style={styles.modalSubmitButton}
              onPress={async () => {
                if (!customCard.trim()) {
                  Alert.alert('Please enter a card name.');
                  return;
                }
                setSubmitting(true);
                try {
                  // Replace this with your backend endpoint that sends the email
                  await fetch('http://localhost:3000/suggest-card', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ card: customCard }),
                  });
                  Alert.alert('Thank you!', 'Your card suggestion has been submitted.');
                  setCustomCard('');
                  setModalVisible(false);
                } catch (e) {
                  Alert.alert('Error', 'Could not submit your suggestion.');
                } finally {
                  setSubmitting(false);
                }
              }}
              disabled={submitting}
            >
              <Text style={styles.modalSubmitButtonText}>{submitting ? 'Submitting...' : 'Submit'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCancel}>
              <Text style={styles.modalCancelText}>Cancel</Text>
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
    justifyContent: 'space-between',
  },
  mainContent: {
    flex: 1,
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
  dropdownContainer: {
    marginTop: 40,
    marginHorizontal: 24,
    zIndex: 100, // Important for dropdown to appear above other elements
  },
  dropdown: {
    borderRadius: 14,
    borderColor: '#ccc',
    minHeight: 44,
    height: 44,
    justifyContent: 'center',
  },
  dropdownBox: {
    borderRadius: 14,
    borderColor: '#ccc',
  },
  addButton: {
    backgroundColor: '#1976D2',
    marginTop: 20,
    marginHorizontal: 24,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    opacity: 1,
  },
  addButtonDisabled: {
    backgroundColor: '#888',
    opacity: 0.7,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  searchContainer: {
    minHeight: 44,
    paddingVertical: 0,
    justifyContent: 'center',
  },
  searchInput: {
    fontSize: 18,
    height: 44,
    borderWidth: 0,
    borderColor: 'transparent',
    outlineWidth: 0,
    shadowColor: 'transparent',
    paddingVertical: 0,
    paddingHorizontal: 12,
  },
  listItemContainer: {
    height: 44,
    justifyContent: 'center',
  },
  listItemLabel: {
    fontSize: 18,
    paddingLeft: 12,
  },
  pickerText: {
    fontSize: 18,
    textAlignVertical: 'center',
    paddingLeft: 12,
  },
  infoBoxBottom: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
    marginTop: 32,
    marginBottom: 24,
    alignItems: 'center',
  },
  infoText: {
    color: '#333',
    fontSize: 13,
    textAlign: 'center',
  },
  submitCardButton: {
    marginTop: 12,
    backgroundColor: '#1976D2',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  submitCardButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalSubmitButton: {
    backgroundColor: '#1976D2',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginBottom: 12,
  },
  modalSubmitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalCancel: {
    marginTop: 4,
  },
  modalCancelText: {
    color: '#1976D2',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  myCardsSection: {
    marginTop: 64,
    marginHorizontal: 24,
    marginBottom: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  myCardsTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1976D2',
  },
  noCardsText: {
    color: '#888',
    fontSize: 15,
    fontStyle: 'italic',
  },
  cardItem: {
    backgroundColor: '#fff',
    borderRadius: 7,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cardItemText: {
    fontSize: 15,
    color: '#222',
  },
}); 