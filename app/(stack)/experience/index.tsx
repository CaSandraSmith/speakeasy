import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  ImageSourcePropType
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

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
        style={[
          styles.card,
          {
            width: cardWidth,
            height: cardHeight
          }
        ]}
        onPress={handleExperienceClick}
      >
        <Image
          source={{ uri: item.image_url }}
          style={styles.media}
        />
        <View style={styles.overlay}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.location}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {destination.charAt(0).toUpperCase() + destination.slice(1)}
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* Main Content - Grid Layout */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {experiences.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No experiences found</Text>
          </View>
        ) : (
          <>
            {/* First row - Large card */}
            <View style={styles.row}>
              {experiences.slice(0, 1).map(item => (
                <ExperienceCard key={item.id} item={{...item, size: 'large'}} />
              ))}
            </View>

            {/* Second row - Medium cards */}
            <View style={styles.row}>
              {experiences.slice(1, 3).map(item => (
                <ExperienceCard key={item.id} item={{...item, size: 'medium'}} />
              ))}
            </View>

            {/* Third row - Small cards */}
            <View style={styles.row}>
              {experiences.slice(3, 5).map(item => (
                <ExperienceCard key={item.id} item={{...item, size: 'small'}} />
              ))}
            </View>

            {/* Fourth row - Large card */}
            <View style={styles.row}>
              {experiences.slice(5, 6).map(item => (
                <ExperienceCard key={item.id} item={{...item, size: 'large'}} />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
  },
  backButton: {
    position: 'absolute',
    left: 20,
  },
  content: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  card: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: COLORS.cardBg,
  },
  media: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  }
});
