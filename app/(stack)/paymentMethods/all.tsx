// AllPaymentMethods.tsx
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { PaymentMethod } from "../../types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { COLORS } from "../../constants/colors";
import Constants from 'expo-constants';
import { useAuthFetch } from "@/context/userContext";

const FLASK_URL = Constants.expoConfig?.extra?.FLASK_URL;

export default function AllPaymentMethods() {
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const authFetch = useAuthFetch();

  const fetchPaymentMethods = async () => {
    try {
      const response = await authFetch(`${FLASK_URL}/payment_methods/`);
      if (!response.ok) throw new Error('Failed to fetch payment methods');
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
        { text: 'Cancel', style: 'cancel' },
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
              if (!response.ok) throw new Error('Failed to delete payment method');
              setPaymentMethods(methods => methods.filter(method => method.id !== id));
              Alert.alert('Deleted', 'Payment method removed');
            } catch (err) {
              console.error(err);
              Alert.alert('Error', 'Could not delete payment method');
            }
          },
        },
      ]
    );
  };

  const handleEdit = (id: number) => {
    router.push(`/paymentMethods/edit/${id}`);
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const maskCardNumber = (cardNumber: string): string => {
    const visibleDigits = cardNumber.slice(-4);
    return `**** **** **** ${visibleDigits}`;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primaryText} />
        <Text style={styles.loadingText}>Loading payment methods...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
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
            <View style={styles.cardTopRow}>
              <Ionicons name="card-outline" size={20} color={COLORS.background} />
              <Text style={styles.cardNumber}>{maskCardNumber(item.card_number)}</Text>
            </View>
            <View style={styles.cardDetails}>
              <Text style={styles.detail}>Expires {item.exp_month}/{item.exp_year}</Text>
              <Text style={styles.detail}>ZIP {item.billing_zip}</Text>
            </View>
            <View style={styles.cardButtons}>
              <TouchableOpacity onPress={() => handleEdit(item.id)} style={styles.iconButton}>
                <Ionicons name="create-outline" size={22} color={COLORS.background} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.iconButton}>
                <Ionicons name="trash-outline" size={22} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/paymentMethods/add')}
      >
        <Ionicons name="add" size={22} color={COLORS.background} />
        <Text style={styles.addButtonText}>Add Payment Method</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 70,
    paddingHorizontal: 20,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.primaryText,
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
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
    fontSize: 20,
    fontFamily: "PlayfairDisplay-Bold",
    color: COLORS.primaryText,
  },
  listContent: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  cardNumber: {
    fontSize: 16,
    color: COLORS.background,
    fontFamily: "Montserrat-Bold",
  },
  cardDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detail: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: COLORS.background,
  },
  cardButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: COLORS.primaryText,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontFamily: "Montserrat-Bold",
    marginLeft: 8,
  },
});
