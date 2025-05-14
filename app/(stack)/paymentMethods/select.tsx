import { useEffect, useState, Dispatch, SetStateAction } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { PaymentMethod } from "../../types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { COLORS } from "../../constants/colors";
import Constants from "expo-constants";
import { useAuthFetch } from "@/context/userContext";

const FLASK_URL = Constants.expoConfig?.extra?.FLASK_URL;
const SCREEN_HEIGHT = Dimensions.get("window").height;

interface Props {
  visibility: boolean;
  setVisibility: Dispatch<SetStateAction<boolean>>;
  handleBooking: (paymentMethodId: number) => void;
}

export default function SelectPaymentMethod({
  visibility,
  setVisibility,
  handleBooking,
}: Props) {
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const authFetch = useAuthFetch();

  const fetchPaymentMethods = async () => {
    try {
      const response = await authFetch(`${FLASK_URL}/payment_methods/`);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setPaymentMethods(data.payment_methods);
      } else {
        console.error("Failed to fetch payment methods:", response.status);
      }
    } catch (err) {
      console.error("Error fetching payment methods:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visibility) {
      fetchPaymentMethods();
    }
  }, [visibility]);

  const handleConfirm = () => {
    if (!selectedPayment) return;
    handleBooking(selectedPayment.id);
  };

  const maskCardNumber = (cardNumber: string): string => {
    const visibleDigits = cardNumber.slice(-4);
    return `**** **** **** ${visibleDigits}`;
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visibility}
      onRequestClose={() => setVisibility(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => setVisibility(false)}
              style={styles.backButton}
            >
              <Ionicons name="close" size={24} color={COLORS.primaryText} />
            </TouchableOpacity>
            <Text style={styles.title}>Select Payment Method</Text>
            <View style={{ width: 24 }} />
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primaryText} />
              <Text style={styles.loadingText}>Loading payment methods...</Text>
            </View>
          ) : (
            <FlatList
              data={paymentMethods}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContainer}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => setSelectedPayment(item)}
                  style={[
                    styles.card,
                    selectedPayment?.id === item.id && styles.cardSelected,
                  ]}
                >
                  <View style={styles.cardContent}>
                    <View>
                      <Text style={styles.cardTitle}>
                        {maskCardNumber(item.card_number)}
                      </Text>
                      <Text style={styles.cardDetails}>
                        Expires {item.exp_month}/{item.exp_year}
                      </Text>
                    </View>
                    <Ionicons
                      name={
                        selectedPayment?.id === item.id
                          ? "checkmark-circle"
                          : "ellipse-outline"
                      }
                      size={24}
                      color={
                        selectedPayment?.id === item.id
                          ? COLORS.accent
                          : COLORS.background
                      }
                    />
                  </View>
                </TouchableOpacity>
              )}
            />
          )}

          {/* Confirm Button */}
          <TouchableOpacity
            onPress={handleConfirm}
            disabled={!selectedPayment}
            style={styles.confirmButton}
          >
            <Text style={styles.confirmButtonText}>Create Booking</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: COLORS.background,
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: SCREEN_HEIGHT * 0.92,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingTop: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backButton: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontFamily: "PlayfairDisplay-Bold",
    color: COLORS.primaryText,
  },
  loadingContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.primaryText,
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardSelected: {
    borderColor: COLORS.accent,
  },
  cardTitle: {
    color: COLORS.background,
    fontSize: 20,
    fontFamily: "Montserrat-Bold",
    marginBottom: 4,
  },
  cardDetails: {
    color: COLORS.background,
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
  },
  confirmButton: {
    marginTop: 10,
    backgroundColor: COLORS.primaryText,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    color: COLORS.background,
    fontSize: 18,
    fontFamily: "Montserrat-Bold",
  },
  cardContent: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
}

});
