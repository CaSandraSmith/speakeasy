import { useLocalSearchParams } from "expo-router";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Modal,
  Image,
  Pressable,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native";
import Constants from "expo-constants";
import { Experience, ExperienceImage } from "../types";
import { COLORS } from "../constants/colors";

const FLASK_URL = Constants.expoConfig?.extra?.FLASK_URL;
const { width } = Dimensions.get("window");

export default function ShowExperience() {
  const { id } = useLocalSearchParams();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

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
        <Pressable style={styles.imageWrapper} onPress={() => setModalVisible(true)}>
          <Image
            source={{ uri: experience.images[0].image_url }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.imagesTextWrapper}>
            <Text style={styles.imagesText}>{experience.images?.length} image{experience.images?.length === 1 ? "": "s"}</Text>
          </View>
        </Pressable>
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

      {/* Image Modal */}
      <ImageModal
        visibility={modalVisible}
        setVisibility={setModalVisible}
        images={experience.images || []}
        selectedImageIndex={selectedImageIndex}
        setSelectedImageIndex={setSelectedImageIndex}
      />
    </ScrollView>
  );
}

interface Props {
  visibility: boolean;
  setVisibility: Dispatch<SetStateAction<boolean>>;
  images: ExperienceImage[];
  selectedImageIndex: number;
  setSelectedImageIndex: Dispatch<SetStateAction<number>>
}

function ImageModal({
  visibility,
  setVisibility,
  images,
  selectedImageIndex,
  setSelectedImageIndex,
}: Props) {
  if (!images || images.length === 0) return null;

  const currentImage = images[selectedImageIndex];

  const handleNext = () => {
    setSelectedImageIndex(prevIndex => // No need to specify type here as TypeScript already infers it
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const handlePrevious = () => {
    setSelectedImageIndex(prevIndex => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleClose = () => {
    console.log("close button pressed")
    setVisibility(false)
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visibility}
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
      <View style={modalStyles.centeredView}>

        {/* Image Carousel */}
        <Image
          source={{ uri: currentImage.image_url }}
          style={modalStyles.modalImage}
          resizeMode="contain"
        />

        {/* Navigation Buttons */}
        <View style={modalStyles.navigationButtons}>
          <Pressable style={modalStyles.navButton} onPress={handlePrevious}>
            <Text style={modalStyles.navButtonText}>{"<"}</Text>
          </Pressable>
          <Pressable style={modalStyles.navButton} onPress={handleNext}>
            <Text style={modalStyles.navButtonText}>{">"}</Text>
          </Pressable>
        </View>
      </View>
      </TouchableWithoutFeedback>
    </Modal>
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
  imageWrapper: {
    position: "relative"
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

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent background to focus on the modal
    position: "relative"
  },
  modalImage: {
    width: "90%", // Width of the image in the modal
    height: "80%", // Height of the image in the modal
  },
  closeText: {
    color: "white",
    fontSize: 16,
  },
  navigationButtons: {
    position: "absolute",
    top: "50%", // Center vertically
    marginTop: -30, // Adjust based on the height of your buttons
    flexDirection: "row",
    justifyContent: "space-between", // Center horizontally
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  navButton: {
    width: 50,  // Ensure equal width and height to make it circular
    height: 50, // Equal height to make the button circular
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 25, // Half of width/height to make the button circular
    justifyContent: "center",
    alignItems: "center", // Center the text inside the button
    marginHorizontal: 10,  // Add space between the buttons
  },
  navButtonText: {
    color: "white",
    fontSize: 24, // Slightly larger font size for better visibility
  },
});
