import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Constants from 'expo-constants';
import { Experience } from "../types";

const FLASK_URL = Constants.expoConfig?.extra?.FLASK_URL;

export default function ShowExperience() {
  const { id } = useLocalSearchParams();
  const [experience, setExperience] = useState<Experience>({
    id: 0,
    title: "",
    description: "",
    price: 0,
    location: "",
    schedule: {
      id: 0,
    },
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

  if (!experience.title) return <Text>Loading</Text>

  console.log("experience", experience)
  

  return (
    <View>
      <Text>Experience ID: {id}</Text>
      <Text>Experience Title: {experience.title}</Text>
      <Text>Experience Description: {experience.description}</Text>
      <Text>Experience Price: {experience.price}</Text>
      <Text>Experience Location: {experience.location}</Text>
      <Text>Experience Schedule: {experience.schedule?.days_of_week} at {experience.schedule?.start_time} - {experience.schedule?.end_time}</Text>
      <View>
        {experience.tags?.map(tag => (
          <Text key={tag.id}>{tag.name}</Text>
        ))}
      </View>
    </View>
  );
}
