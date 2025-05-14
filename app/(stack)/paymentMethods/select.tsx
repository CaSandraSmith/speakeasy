import { useEffect, useState, Dispatch, SetStateAction } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Modal,
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
  handleBooking: (n: number) => void;
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
      const response = await authFetch(`${FLASK_URL}/payment_methods/`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch payment methods");
      }

      const data = await response.json();
      setPaymentMethods(data.payment_methods);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      Alert.alert("Error", "Failed to load payment methods");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBookingClick = () => {
    console.log("selectedPayment", selectedPayment);
    if (!selectedPayment) {
      Alert.alert("Missing Information", "Please select a payment method");
      return;
    } else {
      handleBooking(selectedPayment.id);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const closeModal = () => setVisibility(false);

  const maskCardNumber = (cardNumber: string): string => {
    const visibleDigits = cardNumber.slice(-4);
    return `•••• •••• •••• ${visibleDigits}`;
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visibility}
      onRequestClose={closeModal}
    >
      {/* Backdrop to dismiss modal */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={closeModal}
      />

      {/* Bottom drawer modal content */}
      <View style={styles.bottomSheet}>
        <View style={styles.headerWrapper}>
          <TouchableOpacity onPress={closeModal} style={styles.backButton}>
            <Ionicons
              name="chevron-back"
              size={28}
              color={COLORS.primaryText}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Payment Methods</Text>
          <View style={{ width: 36 }} />
        </View>

        {loading ? (
          <View style={styles.centered}>
            <Text style={styles.loadingText}>Loading payment methods...</Text>
          </View>
        ) : (
          <FlatList
            data={paymentMethods}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const isSelected = selectedPayment?.id === item.id;

              return (
                <TouchableOpacity
                  onPress={() => setSelectedPayment(item)}
                  style={[styles.card, isSelected && styles.cardSelected]}
                  activeOpacity={0.8}
                >
                  <View style={styles.cardHeader}>
                    <Ionicons
                      name={isSelected ? "checkmark-circle" : "ellipse-outline"}
                      size={24}
                      color={isSelected ? COLORS.primary : "#B0B0B0"} // Select color or gray
                    />
                    <Text style={styles.cardNumber}>{maskCardNumber(item.card_number)}</Text>
                  </View>
                  <View style={styles.cardDetails}>
                    <Text style={styles.detail}>
                      Expires{" "}
                      <Text style={styles.detailValue}>
                        {item.exp_month}/{item.exp_year}
                      </Text>
                    </Text>
                    <Text style={styles.detail}>
                      ZIP{" "}
                      <Text style={styles.detailValue}>{item.billing_zip}</Text>
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        )}
        <View className="p-5 pt-2">
          <TouchableOpacity
            className={`bg-accent rounded-3xl py-4 items-center justify-center`}
            onPress={() => handleCreateBookingClick()}
          >
            <Text className="text-background text-lg font-semibold font-montserrat-bold">
              Create Booking
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: SCREEN_HEIGHT * 0.92,
    backgroundColor: "#1A3636",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingTop: 30,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
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
cardSelected: {
  borderColor: COLORS.primary,
  shadowColor: COLORS.primary,
  shadowOpacity: 0.4,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 6,
},
});
