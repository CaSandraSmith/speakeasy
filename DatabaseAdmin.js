import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  ScrollView,
  Alert
} from 'react-native';
import axios from 'axios';
import Config from 'react-native-config'; // For environment variables

// Use environment variables or fallback to defaults
const API_URL = Config.DB_API_URL || 'http://localhost:3000/api';

const DatabaseAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/status`);
      setStatus(response.data);
    } catch (err) {
      setError(`Connection error: ${err.message}`);
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const resetDatabase = async () => {
    Alert.alert(
      'Reset Database',
      'This will reset the database with basic data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await axios.post(`${API_URL}/reset`);
              Alert.alert('Success', 'Database reset with basic data');
              checkStatus();
            } catch (err) {
              setError(`Reset error: ${err.message}`);
            } finally {
              setLoading(false);
            }
          }
        },
      ]
    );
  };

  const seedDatabase = async () => {
    Alert.alert(
      'Seed Database',
      'This will populate the database with realistic test data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Seed', 
          onPress: async () => {
            setLoading(true);
            try {
              await axios.post(`${API_URL}/seed`);
              Alert.alert('Success', 'Database seeded with realistic data');
              checkStatus();
            } catch (err) {
              setError(`Seeding error: ${err.message}`);
            } finally {
              setLoading(false);
            }
          }
        },
      ]
    );
  };

  const createTestUser = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/seed/test-user`);
      Alert.alert(
        'Test User Created',
        `Email: ${response.data.user.email}\nPassword: ${response.data.user.password}`
      );
      checkStatus();
    } catch (err) {
      setError(`Error creating test user: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Database Admin Panel</Text>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      <View style={styles.statusContainer}>
        <Text style={styles.sectionTitle}>Status</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : status ? (
          <View>
            <Text style={styles.statusText}>
              Connected: <Text style={styles.highlight}>Yes</Text>
            </Text>
            <Text style={styles.statusTitle}>Table Counts:</Text>
            <Text style={styles.statusText}>Users: {status.counts.user_count}</Text>
            <Text style={styles.statusText}>Bundles: {status.counts.bundle_count}</Text>
            <Text style={styles.statusText}>Experiences: {status.counts.experience_count}</Text>
            <Text style={styles.statusText}>Bookings: {status.counts.booking_count}</Text>
            <Text style={styles.statusText}>Reviews: {status.counts.review_count}</Text>
          </View>
        ) : (
          <Text style={styles.statusText}>Not connected</Text>
        )}
      </View>
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={checkStatus}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Refresh Status</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.warningButton]} 
          onPress={resetDatabase}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Reset Database</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]} 
          onPress={seedDatabase}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Seed Realistic Data</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={createTestUser}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Create Test User</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Developer Notes</Text>
        <Text style={styles.infoText}>
          This panel is for development purposes only. Make sure your database is running 
          and the API server is accessible at {API_URL}.
        </Text>
        <Text style={styles.infoText}>
          If you're having connection issues, check your environment variables in the .env file.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorContainer: {
    padding: 12,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#c62828',
  },
  statusContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 4,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  buttonsContainer: {
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2196f3',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  warningButton: {
    backgroundColor: '#f44336',
  },
  primaryButton: {
    backgroundColor: '#4caf50',
  },
  secondaryButton: {
    backgroundColor: '#ff9800',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoContainer: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 8,
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
  },
});

export default DatabaseAdmin;