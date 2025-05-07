import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Image,
  Pressable,
  FlatList,
  TouchableOpacity,
  Platform,
} from "react-native";
import Constants from "expo-constants";
import { Experience } from "../../types";
import { COLORS } from "../../constants/colors";
import ImageCaroselModal from "../../components/ImageCaroselModal/ImageCaroselModal";
import { useAuthFetch } from "@/context/userContext";
import { Ionicons } from "@expo/vector-icons";

const FLASK_URL = Constants.expoConfig?.extra?.FLASK_URL;
const { width } = Dimensions.get("window");

export default function ShowExperience() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const authFetch = useAuthFetch();

  const formatTime = (time: string | undefined) => {
    if (!time) return "";
    // Convert the ISO 8601 time string (e.g., "14:30:00") into a 12-hour AM/PM format
    const date = new Date(`1970-01-01T${time}Z`); // Use a fixed date to parse the time
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Determine AM/PM and convert the hours to 12-hour format
    const ampm = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    const minute = minutes < 10 ? `0${minutes}` : minutes; // Add leading zero if necessary

    return `${hour12}:${minute} ${ampm}`;
  };

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const response = await authFetch(`${FLASK_URL}/experiences/${id}`, {
          method: "GET",
        });

        if (response.ok) {
          const data = await response.json();
          setExperience(data.experience);
        } else {
          console.error("Failed to fetch experience:", response.status);
        }
      } catch (e) {
        console.error("There was an error:", e);
      }
    };

    fetchExperience();
  }, [id]);

  if (!experience) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  const handleBookPress = () => {
    if (experience) {
      router.push({
        pathname: "/(stack)/experience/createBooking",
        params: {
          id: experience.id.toString(),
          title: experience.title,
          imageUrl: experience.images?.[0]?.image_url,
        },
      });
    }
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={experience.reviews}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={() => (
          <View>
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
            {experience.images?.[0] && (
              <Pressable
                style={styles.imageWrapper}
                onPress={() => setModalVisible(true)}
              >
                <Image
                  source={{ uri: experience.images[0].image_url }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <View style={styles.imagesTextWrapper}>
                  <Text style={styles.imagesText}>
                    {experience.images?.length} image
                    {experience.images?.length === 1 ? "" : "s"}
                  </Text>
                </View>
              </Pressable>
            )}

            <View style={styles.header}>
              <Text style={styles.title}>{experience.title}</Text>
              <Text style={styles.location}>{experience.location}</Text>
            </View>

            <View style={styles.tagsContainer}>
              {experience.tags?.map((tag) => (
                <View key={tag.id} style={styles.tag}>
                  <Text style={styles.tagText}>{tag.name}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.description}>{experience.description}</Text>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Operating Hours:</Text>
              <Text style={styles.daysText}>
                {experience.schedule?.days_of_week}
              </Text>
              <Text style={styles.timeText}>
                {formatTime(experience.schedule?.start_time)} -{" "}
                {formatTime(experience.schedule?.end_time)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Price:</Text>
              <Text style={styles.value}>${experience.price}</Text>
            </View>

            <Text style={styles.reviewHeader}>Reviews</Text>

            <ImageCaroselModal
              visibility={modalVisible}
              setVisibility={setModalVisible}
              images={experience.images || []}
            />
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <Text style={styles.reviewerName}>{item.user_name}</Text>
            <View style={styles.rating}>
              {[...Array(5)].map((_, index) => (
                <Text
                  key={index}
                  style={[
                    styles.star,
                    index < item.rating ? styles.filledStar : styles.emptyStar,
                  ]}
                >
                  ★
                </Text>
              ))}
            </View>
            <Text style={styles.reviewContent}>{item.comment}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ padding: 20, color: COLORS.secondaryText }}>
            No reviews yet.
          </Text>
        }
        contentContainerStyle={styles.container}
      />

      <View style={styles.buttonContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.bookButton} onPress={handleBookPress}>
            <Text style={styles.bookButtonText}>Book</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "space-between",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    zIndex: 100,
    top: 40,
    left: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: "50%",  
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    padding: 20,
    paddingBottom: 25,
    borderTopWidth: 1,
    borderTopColor: COLORS.accent,
  },
  bookButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  bookButtonText: {
    color: "#1A1A1A",
    fontSize: 18,
    fontWeight: "600",
  },
  container: {
    backgroundColor: COLORS.background,
    paddingBottom: 100,
  },
  content: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  image: {
    width: width,
    // height: 300,
    aspectRatio: 4 / 3,
    maxHeight: Platform.OS === "web" ? 400 : undefined,
  },
  imageWrapper: {
    position: "relative",
  },
  imagesTextWrapper: {
    position: "absolute",
    bottom: 15, // Slightly adjusted for a more balanced look
    right: 15, // Adjusted for better spacing from the edge
    paddingHorizontal: 12, // Added horizontal padding to make text more readable
    paddingVertical: 8, // Added vertical padding for balance
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Added transparency for a subtle background
    borderRadius: 12, // Slightly rounded edges for better appearance
    shadowColor: "#000", // Shadow to make text more visible
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  imagesText: {
    color: "white",
    fontSize: 16, // Increased font size for better readability
    fontWeight: "bold", // Added font weight for emphasis
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primaryText,
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    color: COLORS.secondaryText,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  tag: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  tagText: {
    color: "#1A1A1A",
    fontWeight: "600",
  },
  description: {
    paddingHorizontal: 20,
    fontSize: 16,
    color: COLORS.primaryText,
    marginTop: 10,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: "column", // Stack the label, days, and time vertically
    marginTop: 20, // Optional: Add space between info rows
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.secondaryText,
  },
  daysText: {
    fontSize: 16,
    color: COLORS.primaryText,
    marginTop: 5, // Space between days and label
    fontWeight: "500", // Optional: You could make it lighter than the time
  },
  timeText: {
    fontSize: 16,
    color: COLORS.primaryText,
    marginTop: 5, // Space between time and days
    fontWeight: "600", // You can make the time slightly bolder than the days
  },
  value: {
    fontSize: 16,
    color: COLORS.primaryText,
    fontWeight: "400",
  },
  reviewCard: {
    backgroundColor: "#254545",
    padding: 15,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "#323840", // A soft contrasting border
  },
  reviewerName: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primaryText,
  },
  rating: {
    flexDirection: "row",
    marginVertical: 5,
  },
  star: {
    fontSize: 20,
    marginRight: 3,
  },
  filledStar: {
    color: "#FFD700", // Golden color for filled stars
  },
  emptyStar: {
    color: "#D3D3D3", // Light grey for empty stars
  },
  reviewContent: {
    fontSize: 16,
    color: COLORS.secondaryText,
    marginTop: 5,
  },
  reviewHeader: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.primaryText,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondaryText,
  },
});
