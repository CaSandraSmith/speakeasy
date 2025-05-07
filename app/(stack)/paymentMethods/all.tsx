import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PaymentMethod } from "../../types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { COLORS } from "@/app/constants/colors";

export default function AllPaymentMethods() {
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    setPaymentMethods([
      {
        id: 1,
        card_number: "**** **** **** 1234",
        billing_zip: "90210",
        exp_month: 12,
        exp_year: 2025,
        user_id: 101,
      },
      {
        id: 2,
        card_number: "**** **** **** 5678",
        billing_zip: "10001",
        exp_month: 6,
        exp_year: 2024,
        user_id: 101,
      },
    ]);
  }, []);

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
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="create-outline" size={24} color="#444" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="trash-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
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
  title: {
    fontSize: 26,
    fontWeight: "600",
    color: "#DCD7C9",
    marginBottom: 20,
    letterSpacing: 0.8,
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
});
