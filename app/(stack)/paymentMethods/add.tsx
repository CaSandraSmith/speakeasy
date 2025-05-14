import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Constants from "expo-constants";
import { COLORS } from "../../constants/colors";
import { useAuthFetch } from "@/context/userContext";
import Toast from "react-native-toast-message";

const FLASK_URL = Constants.expoConfig?.extra?.FLASK_URL;

export default function CreatePaymentMethod() {
  const router = useRouter();
  const authFetch = useAuthFetch();

  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [billingZip, setBillingZip] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");

  const handleCreate = async () => {
    if (!cardNumber || !billingZip || !expMonth || !expYear || !cvv) {
      Toast.show({
        type: "error",
        text1: "Please fill in all fields",
        position: "bottom",
      });

      return;
    }

    const cardNumberWithoutDashes = cardNumber.replace(/-/g, "");
    setLoading(true);

    try {
      const res = await authFetch(`${FLASK_URL}/payment_methods/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          card_number: cardNumberWithoutDashes,
          billing_zip: billingZip,
          exp_month: parseInt(expMonth),
          exp_year: parseInt(expYear),
          cvv: cvv,
        }),
      });

      if (!res.ok) throw new Error("Creation failed");

      Toast.show({
        type: "success",
        text1: "Payment method added!",
        position: "bottom",
      });

      router.push("/paymentMethods/all");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to add payment method.");
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    let formattedValue = value.replace(/\D/g, "");
    if (formattedValue.length > 4) {
      formattedValue = formattedValue.replace(/(\d{4})(?=\d)/g, "$1-");
    }
    setCardNumber(formattedValue);
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color={COLORS.primaryText} />
        </TouchableOpacity>

        <Text style={styles.title}>Add Payment Method</Text>

        <Text style={styles.label}>Card Number</Text>
        <TextInput
          style={styles.input}
          placeholder="1234-5678-9012-3456"
          placeholderTextColor="#aaa"
          value={cardNumber}
          onChangeText={formatCardNumber}
          keyboardType="number-pad"
          maxLength={19}
        />

        <Text style={styles.label}>Billing ZIP</Text>
        <TextInput
          style={styles.input}
          placeholder="12345"
          placeholderTextColor="#aaa"
          value={billingZip}
          onChangeText={setBillingZip}
          keyboardType="number-pad"
        />

        <Text style={styles.label}>CVV</Text>
        <TextInput
          style={styles.input}
          placeholder="123"
          placeholderTextColor="#aaa"
          value={cvv}
          onChangeText={setCvv}
          keyboardType="number-pad"
          maxLength={4}
        />

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Exp Month</Text>
            <TextInput
              style={styles.input}
              placeholder="MM"
              placeholderTextColor="#aaa"
              value={expMonth}
              onChangeText={setExpMonth}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Exp Year</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY"
              placeholderTextColor="#aaa"
              value={expYear}
              onChangeText={setExpYear}
              keyboardType="number-pad"
              maxLength={4}
            />
          </View>
        </View>
      </View>

      <View>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleCreate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.background} />
          ) : (
            <Text style={styles.saveButtonText}>Add Payment Method</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    paddingTop: 70,
    justifyContent: "space-between",
  },
  wrapper: {
    flex: 1,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    color: COLORS.primaryText,
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "serif",
  },
  label: {
    color: COLORS.accent,
    fontSize: 14,
    marginBottom: 6,
    marginLeft: 4,
    fontWeight: "500",
    fontFamily: "serif",
  },
  input: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    color: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.accent,
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  column: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: COLORS.accent,
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 16,
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  saveButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "serif",
  },
});
