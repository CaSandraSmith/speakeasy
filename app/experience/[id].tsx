import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Platform,
  Image,
} from "react-native";
import Constants from "expo-constants";
import { Experience } from "../types";
import { COLORS } from "../constants/colors";

const FLASK_URL = Constants.expoConfig?.extra?.FLASK_URL;
const { width } = Dimensions.get("window");

export default function ShowExperience() {
  const { id } = useLocalSearchParams();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const response = await fetch(`${FLASK_URL}/experiences/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Image */}
      {experience.images?.[0] && (
        <Image 
          source={{ uri: experience.images[0].image_url }} 
          style={styles.image} 
          resizeMode="cover"
        />
      )}


      {/* Title & Location */}
      <View style={styles.header}>
        <Text style={styles.title}>{experience.title}</Text>
        <Text style={styles.location}>{experience.location}</Text>
      </View>

      {/* Tags */}
      <View style={styles.tagsContainer}>
        {experience.tags?.map((tag) => (
          <View key={tag.id} style={styles.tag}>
            <Text style={styles.tagText}>{tag.name}</Text>
          </View>
        ))}
      </View>

      {/* Description */}
      <Text style={styles.description}>{experience.description}</Text>

      {/* Schedule & Price */}
      <View style={styles.infoRow}>
        <Text style={styles.label}>Schedule:</Text>
        <Text style={styles.value}>
          {experience.schedule?.days_of_week} from{" "}
          {experience.schedule?.start_time} - {experience.schedule?.end_time}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Price:</Text>
        <Text style={styles.value}>${experience.price}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    height: 300,
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
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    color: COLORS.secondaryText,
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    color: COLORS.primaryText,
    fontWeight: "400",
  },
});
