import { Dispatch, SetStateAction, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import { ExperienceImage } from "../../types";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  visibility: boolean;
  setVisibility: Dispatch<SetStateAction<boolean>>;
  images: ExperienceImage[];
}

export default function ImageCaroselModal({
  visibility,
  setVisibility,
  images,
}: Props) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  if (!images || images.length === 0) return null;

  const currentImage = images[selectedImageIndex];

  const handleNext = () => {
    setSelectedImageIndex(
      (
        prevIndex // No need to specify type here as TypeScript already infers it
      ) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1)
    );
  };

  const handlePrevious = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleClose = () => {
    console.log("close button pressed");
    setVisibility(false);
  };

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
          {images.length > 1 && (
            <>
              <Pressable style={modalStyles.navButton} onPress={handlePrevious}>
                <Text style={modalStyles.navButtonText}>
                  {images.length > 1 && <Ionicons name="chevron-back-outline" size={28} color="white" />}
                </Text>
              </Pressable>

              <Pressable style={modalStyles.navButton} onPress={handleNext}>
                <Text style={modalStyles.navButtonText}>
                  <Ionicons name="chevron-forward-outline" size={28} color="white" />
                </Text>
              </Pressable>
            </>
            )
          }
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent background to focus on the modal
    position: "relative",
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
    width: 50, // Ensure equal width and height to make it circular
    height: 50, // Equal height to make the button circular
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 25, // Half of width/height to make the button circular
    justifyContent: "center",
    alignItems: "center", // Center the text inside the button
    marginHorizontal: 10, // Add space between the buttons
  },
  navButtonText: {
    color: "white",
    fontSize: 24, // Slightly larger font size for better visibility
  },
});
