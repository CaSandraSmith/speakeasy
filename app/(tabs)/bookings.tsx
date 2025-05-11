import { ScrollView, View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useEffect, useState } from "react";
import BookingsList from "../components/BookingsList/BookingsList";
import { Booking, User } from "../types";
import { useRouter } from "expo-router";
import { useAuthFetch } from "@/context/userContext";
import Constants from "expo-constants";
const FLASK_URL = Constants.expoConfig?.extra?.FLASK_URL;

export default function BookingsScreen() {
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const router = useRouter()
  const authFetch = useAuthFetch()

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await authFetch(`${FLASK_URL}/bookings/`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          console.log("data", data);
        } else {
          console.error("Failed to fetch:", response.status);
        }
      } catch (e) {
        console.error("There was an error:", e);
      }
    }

    fetchBookings()
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <BookingsList bookings={upcomingBookings} type={"future"} />
      <View style={styles.section}>
        <BookingsList bookings={upcomingBookings.slice(0, 2)} type={"past"} />
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(stack)/bookings/past")}
        >
          <Text style={styles.buttonText}>View All Past Bookings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A3636", // your background color
    paddingTop: 40,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginTop: 10,
  },
  button: {
    marginTop: 12,
    backgroundColor: "#D6BD98", // accent
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 130,
  },
  buttonText: {
    color: "#1A3636",
    fontWeight: "600",
  },
});
