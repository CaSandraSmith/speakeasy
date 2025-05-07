import { useLocalSearchParams } from "expo-router";
import { Booking } from "../../types";
import { useEffect, useState } from "react";
import { Text, ScrollView, StyleSheet } from "react-native";
import BookingsList from "../../components/BookingsList/BookingsList";

export default function ShowBookingsOfType() {
  const { status } = useLocalSearchParams();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    setBookings([
      {
        id: 1,
        user_id: 101,
        number_of_guests: 2,
        confirmation_code: "ABC123XYZ",
        experience: {
          id: 10,
          title: "Sunset Kayaking Tour",
          description: "Enjoy a peaceful kayak ride during golden hour.",
          location: "Monterey Bay, CA",
          price: 75.0,
          images: [
            {
              id: 1,
              image_url:
                "https://media.istockphoto.com/id/1526986072/photo/airplane-flying-over-tropical-sea-at-sunset.jpg?s=612x612&w=0&k=20&c=Ccvg3BqlqsWTT0Mt0CvHlbwCuRjPAIWaCLMKSl3PCks=",
            },
          ],
          tags: [
            { id: 1, name: "Outdoor" },
            { id: 2, name: "Adventure" },
          ],
          reviews: [],
        },
      },
      {
        id: 2,
        user_id: 102,
        number_of_guests: 1,
        confirmation_code: "DEF456UVW",
        experience: {
          id: 12,
          title: "Vineyard Wine Tasting",
          description: "Sample award-winning wines in Napa Valley.",
          location: "Napa Valley, CA",
          price: 120.0,
          images: [
            {
              id: 2,
              image_url:
                "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dHJhdmVsfGVufDB8fDB8fHww",
            },
          ],
          tags: [
            { id: 3, name: "Relaxation" },
            { id: 4, name: "Food & Drink" },
          ],
          reviews: [],
        },
      },
      {
        id: 3,
        user_id: 103,
        number_of_guests: 3,
        confirmation_code: "GHI789RST",
        experience: {
          id: 14,
          title: "Historical Walking Tour",
          description: "Learn the rich history of the city on foot.",
          location: "Boston, MA",
          price: 40.0,
          images: [
            {
              id: 3,
              image_url:
                "https://media.self.com/photos/5f0885ffef7a10ffa6640daa/1:1/w_3929,h_3929,c_limit/travel_plane_corona.jpeg",
            },
          ],
          tags: [
            { id: 5, name: "Educational" },
            { id: 6, name: "Walking Tour" },
          ],
          reviews: [],
        },
      },
    ]);
  }, []);

  if (!bookings.length) return <Text>Loading</Text>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <BookingsList bookings={bookings} type={String(status)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A3636", // your background color
    paddingTop: 50

  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
});
