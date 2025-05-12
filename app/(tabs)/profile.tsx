import React from "react";
import { useAuthFetch, useUser } from "@/context/userContext";
import {
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Booking, User } from "../types";
import { useEffect, useState } from "react";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
const FLASK_URL = Constants.expoConfig?.extra?.FLASK_URL;

export default function Profile() {
  const router = useRouter();
  const {clearToken} = useUser()
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const authFetch = useAuthFetch()

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await authFetch(`${FLASK_URL}/api/current_user`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          console.log("user", data.user);
          setUserInfo(data.user);
        } else {
          console.error("Failed to fetch:", response.status);
        }
      } catch (e) {
        console.error("There was an error:", e);
      }
    };

    fetchUserInfo();
  }, []);

  if (!userInfo) return <Text>Loading</Text>;

  const initials = `${userInfo.first_name[0]}${userInfo.last_name[0]}`;

  const handleLogOut = () => {
    clearToken()
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.profileHeader}>
        <View style={styles.initialsCircle}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
        <View>
          <Text style={styles.name}>
            {userInfo.first_name} {userInfo.last_name}
          </Text>
          <Text style={styles.email}>{userInfo.email}</Text>
        </View>
      </View>

      <View style={styles.card}>
        {userInfo.phone_number && (
          <>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>{userInfo.phone_number}</Text>
          </>
        )}

        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>{userInfo.admin ? "Admin" : "User"}</Text>

        {userInfo.created_at && (
          <>
            <Text style={styles.label}>Account Created</Text>
            <Text style={styles.value}>
              {new Date(userInfo.created_at).toLocaleDateString()}
            </Text>
          </>
        )}

        {userInfo.last_login && (
          <>
            <Text style={styles.label}>Last Login</Text>
            <Text style={styles.value}>
              {new Date(userInfo.last_login).toLocaleString()}
            </Text>
          </>
        )}
      </View>


      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("(stack)/paymentMethods/all")}
      >
        <Text style={styles.buttonText}>Payment Methods</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("(stack)/payments/history")}
      >
        <Text style={styles.buttonText}>Payment History</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogOut}
      >
        <Text style={styles.buttonText}>Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A3636", // your background color
    padding: 20,
    paddingTop: 70
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
  },
  buttonText: {
    color: "#1A3636",
    fontWeight: "600",
  },
  loading: {
    color: "#DCD7C9",
    textAlign: "center",
    marginTop: 50,
    fontSize: 18,
  },
  header: {
    fontSize: 32,
    fontWeight: "700",
    color: "#DCD7C9",
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 16,
  },
  initialsCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E7D2CC",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  initials: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1A3636",
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFF5FB",
  },
  email: {
    fontSize: 14,
    color: "#CFCFCF",
    marginTop: 2,
  },
  card: {
    backgroundColor: "#FFF5FB",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 24,
  },
  label: {
    color: "#6A5D4D",
    fontSize: 13,
    marginTop: 12,
    letterSpacing: 0.5,
  },
  value: {
    color: "#1A3636",
    fontSize: 15,
    fontWeight: "500",
  },
  logoutButton: {
    backgroundColor: "#B85C38",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 40,
  },
  logoutText: {
    color: "#FFF5FB",
    fontSize: 16,
    fontWeight: "600",
  },
});
