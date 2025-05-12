import { Booking, Reservation } from "@/app/types";
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
import { useRouter } from "expo-router";

interface Props {
  bookings: Booking[];
  type: string;
  back?: () => void
}

export default function BookingsList({ bookings, type, back }: Props) {
  const router = useRouter();
  const title = type === "past" ? "Past" : "Upcoming";

  const formatDateWithSuffix = (dateStr: string): string => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const year = date.getFullYear();
    const month = date.toLocaleString("en-US", { month: "long" });
  
    const getDaySuffix = (d: number): string => {
      if (d >= 11 && d <= 13) return "th";
      switch (d % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };
  
    return `${month} ${day}${getDaySuffix(day)}, ${year}`;
  }

  const convertTimeToAmPm = (timeStr: string): string => {
    const [hoursStr, minutesStr, secondsStr] = timeStr.split(":");
    let hours = parseInt(hoursStr, 10);
    const period = hours >= 12 ? "PM" : "AM";
    
    // Convert to 12-hour format
    hours = hours % 12 || 12; // 0 becomes 12
  
    return `${hours}${period}`;
  }

  const timeMarkup = (reservation: Reservation) => {
    let returned = ''

    if (reservation.start_time) {
      returned += ` · ${convertTimeToAmPm(reservation.start_time)}`

      if (reservation.end_time) {
        returned += ` - ${convertTimeToAmPm(reservation.end_time)}`
      }
    }

    return returned
  }
  
  // Navigate to booking info page
  const handleBookingPress = (bookingId: string | number) => {
    router.push({
      pathname: '/(stack)/experience/bookingInfo',
      params: { bookingId: bookingId.toString() }
    });
  };

  return (
    <FlatList
      data={bookings}
      keyExtractor={(item) => item.id.toString()}
      scrollEnabled={false}
      ListHeaderComponent={() => (
        <View style={styles.headerWrapper}>
          {back ? (
            <TouchableOpacity
              onPress={() => back()}
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
        <TouchableOpacity style={styles.card} onPress={() => handleBookingPress(item.id)}>
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
            <Text style={styles.date}>{formatDateWithSuffix(item.reservations[0].date)} 
              {timeMarkup(item.reservations[0])}
            </Text>
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
    textAlign: "center"
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
