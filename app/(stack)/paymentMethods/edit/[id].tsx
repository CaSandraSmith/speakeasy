import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Constants from "expo-constants";
import { COLORS } from "../../../constants/colors";
import { useAuthFetch } from "@/context/userContext";
import Toast from "react-native-toast-message";

const FLASK_URL = Constants.expoConfig?.extra?.FLASK_URL;

export default function EditPaymentMethod() {
  const { id } = useLocalSearchParams(); // payment method ID
  const router = useRouter();
  const authFetch = useAuthFetch();

  const [loading, setLoading] = useState(true);
  const [cardNumber, setCardNumber] = useState("");
  const [billingZip, setBillingZip] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    const fetchPaymentMethod = async () => {
      try {
        const res = await authFetch(`${FLASK_URL}/payment_methods/${id}`, {
          method: "GET",
        });

        if (!res.ok) throw new Error("Failed to load payment method");
        const data = await res.json();

        // Format card number with dashes
        setCardNumber(formatCardNumberForDisplay(data.card_number));
        setBillingZip(data.billing_zip);
        setExpMonth(data.exp_month.toString());
        setExpYear(data.exp_year.toString());
        setCvv(data.cvv);
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Unable to load payment method.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethod();
  }, [id]);

  const handleUpdate = async () => {
    if (!cardNumber || !billingZip || !expMonth || !expYear || !cvv) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    // Remove dashes from card number before sending to database
    const cardNumberWithoutDashes = cardNumber.replace(/-/g, "");

    try {
      const res = await authFetch(`${FLASK_URL}/payment_methods/${id}`, {
        method: "PUT",
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

      if (!res.ok) throw new Error("Update failed");

      Toast.show({
        type: "success",
        text1: "Payment method updated!",
        position: "bottom",
      });

      router.push("/paymentMethods/all");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update payment method.");
    }
  };

  const formatCardNumberForDisplay = (cardNumber: string) => {
    // Remove non-numeric characters
    let formattedValue = cardNumber.replace(/\D/g, "");

    // Add dashes every 4 digits
    if (formattedValue.length > 4) {
      formattedValue = formattedValue.replace(/(\d{4})(?=\d)/g, "$1-");
    }

    return formattedValue;
  };

  const formatCardNumber = (value: string) => {
    // Remove non-numeric characters
    let formattedValue = value.replace(/\D/g, "");

    // Add dashes every 4 digits
    if (formattedValue.length > 4) {
      formattedValue = formattedValue.replace(/(\d{4})(?=\d)/g, "$1-");
    }

    setCardNumber(formattedValue);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.primaryText} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color={COLORS.primaryText} />
        </TouchableOpacity>

        <Text style={styles.title}>Edit Payment Method</Text>

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
        <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
          <Text style={styles.saveButtonText}>Update</Text>
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
  center: {
    justifyContent: "center",
    alignItems: "center",
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
