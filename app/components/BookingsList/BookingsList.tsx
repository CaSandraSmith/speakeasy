import { Booking } from "@/app/types";
import {
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  View,
  StyleSheet,
} from "react-native";
import { COLORS } from "@/app/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";

interface Props {
  bookings: Booking[];
  type: string;
}

export default function BookingsList({ bookings, type }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const isStatusPage = pathname?.startsWith("/bookings/");
  const title = type === "past" ? "Past" : "Upcoming";

  return (
    <FlatList
      data={bookings}
      keyExtractor={(item) => item.id.toString()}
      scrollEnabled={false}
      ListHeaderComponent={() => (
        <View style={styles.headerWrapper}>
          {isStatusPage ? (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons
                name="chevron-back"
                size={28}
                color={COLORS.primaryText}
              />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 36 }} />
          )}
          <View style={styles.headerCenter}>
            <Text style={styles.header}>Your {title} Bookings</Text>
          </View>
          {/* Empty view for spacing symmetry */}
          <View style={{ width: 36 }} />
        </View>
      )}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card}>
          {item.experience?.images?.[0] && (
            <Image
              source={{ uri: item.experience.images[0].image_url }}
              resizeMode="cover"
              style={styles.image}
            />
          )}
          <View style={styles.content}>
            <Text style={styles.title}>{item.experience?.title}</Text>
            <Text style={styles.code}>
              Confirmation Code: {item.confirmation_code}
            </Text>
            <Text style={styles.date}>August 10th, 2025 · 2pm–5pm</Text>
          </View>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
  },
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  backButton: {
    width: 36,
    alignItems: "flex-start",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.primaryText,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 180,
  },
  content: {
    padding: 16,
    gap: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  code: {
    fontSize: 14,
    color: "#6B6B6B",
    fontWeight: "400",
  },
  date: {
    fontSize: 14,
    color: COLORS.secondaryText,
    fontWeight: "500",
  },
});
