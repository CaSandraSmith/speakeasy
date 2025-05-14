import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Get screen dimensions for responsive layout
const { width } = Dimensions.get('window');

// Define types
type ExperienceSize = 'large' | 'medium' | 'small';

interface ExperienceItem {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number | null;
  match_score: number;
  match_type: string;
  size?: ExperienceSize;
  image_url: string;
}

export default function ExperienceIndex() {
  const router = useRouter();
  const { search } = useLocalSearchParams();
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [destination, setDestination] = useState<string>('');

  useEffect(() => {
    const fetchExperiences = async () => {
      if (typeof search === 'string') {
        try {
          const response = await fetch(`http://localhost:5001/search?q=${encodeURIComponent(search.trim())}`);
          const data = await response.json();
          setDestination(search);
          setExperiences(data.experiences);
        } catch (error) {
          console.error('Error fetching experiences:', error);
          setExperiences([]);
        }
      } else {
        setDestination('Discover');
        setExperiences([]);
      }
    };

    fetchExperiences();
  }, [search]);

  // Card component for images
  const ExperienceCard = ({ item }: { item: ExperienceItem }) => {
    // Determine card width based on size
    let cardWidth: number = 0;
    let cardHeight: number = 0;

    switch(item.size) {
      case 'large':
        cardWidth = width - 40;
        cardHeight = 300;
        break;
      case 'medium':
        cardWidth = (width - 50) / 2;
        cardHeight = 200;
        break;
      case 'small':
        cardWidth = (width - 50) / 2;
        cardHeight = 150;
        break;
      default:
        cardWidth = width - 40;
        cardHeight = 200;
        break;
    }

    const handleExperienceClick = () => {
      router.push(`/experience/${item.id}`);
    }

    return (
      <TouchableOpacity
        className="overflow-hidden"
        style={[
          {
            width: cardWidth,
            height: cardHeight,
            borderRadius: 15,
          }
        ]}
        onPress={handleExperienceClick}
      >
        <Image
          source={{ uri: item.image_url }}
          className="w-full h-full absolute"
          resizeMode="cover"
        />
        <View className="absolute bottom-0 left-0 right-0 p-4">
          <Text 
            className="text-white font-montserrat-bold text-xl"
            style={{
              textShadowColor: 'rgba(0, 0, 0, 0.8)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2,
            }}
          >
            {item.title}
          </Text>
          <Text 
            className="text-textPrimary font-montserrat text-base"
            style={{
              textShadowColor: 'rgba(0, 0, 0, 0.8)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 3,
            }}
          >
            {item.location}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="flex-row items-center pt-6 pb-4 px-5">
        <TouchableOpacity
          className="absolute left-5 z-10"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#DCD7C9" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-textPrimary font-montserrat-bold text-3xl">
          {destination.charAt(0).toUpperCase() + destination.slice(1)}
        </Text>
      </View>

      {/* Main Content - Grid Layout */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {experiences.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-textSecondary font-montserrat text-base text-center">
              No experiences found
            </Text>
          </View>
        ) : (
          <>
            {/* First row - Large card */}
            <View className="mb-2">
              {experiences.slice(0, 1).map(item => (
                <ExperienceCard key={item.id} item={{...item, size: 'large'}} />
              ))}
            </View>

            {/* Second row - Medium cards */}
            <View className="flex-row justify-between mb-2">
              {experiences.slice(1, 3).map(item => (
                <ExperienceCard key={item.id} item={{...item, size: 'medium'}} />
              ))}
            </View>

            {/* Third row - Small cards */}
            <View className="flex-row justify-between mb-2">
              {experiences.slice(3, 5).map(item => (
                <ExperienceCard key={item.id} item={{...item, size: 'small'}} />
              ))}
            </View>

            {/* Fourth row - Large card */}
            {experiences.length > 5 && (
              <View className="mb-2">
                {experiences.slice(5, 6).map(item => (
                  <ExperienceCard key={item.id} item={{...item, size: 'large'}} />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
