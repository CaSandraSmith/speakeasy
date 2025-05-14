import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { PaymentMethod } from "../../types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { COLORS } from "../../constants/colors";
import Constants from 'expo-constants';
const FLASK_URL = Constants.expoConfig?.extra?.FLASK_URL;

export default function AllPaymentMethods() {
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch(`${FLASK_URL}/payment_methods`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
      }

      const data = await response.json();
      setPaymentMethods(data.payment_methods);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      Alert.alert('Error', 'Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to delete this payment method?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${FLASK_URL}/payment_methods/${id}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
              });

              if (!response.ok) {
                throw new Error('Failed to delete payment method');
              }

              setPaymentMethods(methods => methods.filter(method => method.id !== id));
              Alert.alert('Success', 'Payment method deleted successfully');
            } catch (error) {
              console.error('Error deleting payment method:', error);
              Alert.alert('Error', 'Failed to delete payment method');
            }
          },
        },
      ],
    );
  };

  const handleEdit = (id: number) => {
    router.push(`/paymentMethods/edit/${id}`);
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Loading payment methods...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color={COLORS.primaryText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Payment Methods</Text>
        <View style={{ width: 36 }} />
      </View>
      <FlatList
        data={paymentMethods}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="card-outline" size={22} color="#1A3636" />
              <Text style={styles.cardNumber}>{item.card_number}</Text>
            </View>
            <View style={styles.cardDetails}>
              <Text style={styles.detail}>
                Expires{" "}
                <Text style={styles.detailValue}>
                  {item.exp_month}/{item.exp_year}
                </Text>
              </Text>
              <Text style={styles.detail}>
                ZIP <Text style={styles.detailValue}>{item.billing_zip}</Text>
              </Text>
            </View>
            <View style={styles.cardButtons}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => handleEdit(item.id)}
              >
                <Ionicons name="create-outline" size={24} color="#444" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => handleDelete(item.id)}
              >
                <Ionicons name="trash-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/paymentMethods/add')}
      >
        <Ionicons name="add" size={24} color={COLORS.primaryText} />
        <Text style={styles.addButtonText}>Add Payment Method</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A3636",
    padding: 20,
    paddingTop: 70
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.primaryText,
    fontSize: 16,
  },
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButton: {
    width: 36,
    alignItems: "flex-start",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
    color: COLORS.primaryText,
    letterSpacing: 0.5,
  },
  listContent: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#FFF5FB",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  cardNumber: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A3636",
    letterSpacing: 1.2,
  },
  cardDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  detail: {
    fontSize: 16,
    color: "#6A5D4D",
    fontWeight: "500",
  },
  detailValue: {
    fontWeight: "600",
    color: "#1A3636",
  },
  cardButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
    gap: 12,
  },
  iconButton: {
    padding: 6,
    borderRadius: 6,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: COLORS.primaryText,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
