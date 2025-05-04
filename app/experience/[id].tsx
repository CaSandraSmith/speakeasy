import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Constants from 'expo-constants';
import { Experience } from "../types";

const FLASK_URL = Constants.expoConfig?.extra?.FLASK_URL;

export default function ShowExperience() {
  const { id } = useLocalSearchParams();
  const [experience, setExperience] = useState<Experience>({
    id: "",
    title: "",
    description: "",
    price: 0,
    location: "",
    schedule: [],
    images: [],
    reviews: [],
    tags: [],
  });

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const response = await fetch(`${FLASK_URL}/experiences/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include' // Necessary for cookies/session to work
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

  if (!experience.title) return <h1>Loading</h1>

  console.log("experience", experience)
  

  return (
    <View>
      <Text>Experience ID: {id}</Text>
      <Text>Experience Title: {experience.title || "Loading..."}</Text>
      {/* Add more fields as needed */}
    </View>
  );
}
