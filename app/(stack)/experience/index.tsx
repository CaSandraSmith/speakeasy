import React from 'react';
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
  subtitle: string;
  source: ImageSourcePropType;
  size: ExperienceSize;
}

// Updated sample data for Japan experiences (all images)
const japanExperiences: ExperienceItem[] = [
  {
    id: '1',
    title: 'Mount Fuji',
    subtitle: 'Iconic volcano',
    source: require('../../../assets/images/mount-fuji.jpg'),
    size: 'large'  // Takes up full width in the first row
  },
  {
    id: '2',
    title: 'Tokyo Streets',
    subtitle: 'Urban adventure',
    source: require('../../../assets/images/tokyo-thumbnail.jpg'),
    size: 'medium'  // Takes up half width in the second row
  },
  {
    id: '3',
    title: 'Kyoto Temples',
    subtitle: 'Cultural heritage',
    source: require('../../../assets/images/kyoto.jpg'),
    size: 'medium'  // Takes up half width in the second row
  },
  {
    id: '4',
    title: 'Osaka Food',
    subtitle: 'Culinary delights',
    source: require('../../../assets/images/osaka.jpg'),
    size: 'small'  // Takes up half width in the third row
  },
  {
    id: '5',
    title: 'Cherry Blossoms',
    subtitle: 'Seasonal beauty',
    source: require('../../../assets/images/sakura-thumbnail.jpg'),
    size: 'small'  // Takes up half width in the third row
  },
  {
    id: '6',
    title: 'Bullet Train',
    subtitle: 'Modern transport',
    source: require('../../../assets/images/shinkansen-thumbnail.jpg'),
    size: 'large'  // Takes up full width in the fourth row
  },
];

export default function ExperienceIndex() {
  const router = useRouter();
  const { destination } = useLocalSearchParams();

  // Card component for images
  const ExperienceCard = ({ item }: { item: ExperienceItem }) => {
    // Determine card width based on size
    let cardWidth: number = 0;
    let cardHeight: number = 0;
    
    switch(item.size) {
      case 'large':
        cardWidth = width - 40; // Full width minus padding
        cardHeight = 300;
        break;
      case 'medium':
        cardWidth = (width - 50) / 2; // Half width with spacing
        cardHeight = 200;
        break;
      case 'small':
        cardWidth = (width - 50) / 2; // Half width with spacing
        cardHeight = 150;
        break;
      default:
        cardWidth = width - 40;
        cardHeight = 200;
        break;
    }

    const handleExprienceClick = () => {
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
        onPress={handleExprienceClick}
      >
        <Image source={item.source} style={styles.media} />
        <View style={styles.overlay}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
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
          {typeof destination === 'string' ? destination : 'Japan'}
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
        {/* First row - Large card */}
        <View style={styles.row}>
          {japanExperiences
            .filter(item => item.size === 'large' && item.id === '1')
            .map(item => (
              <ExperienceCard key={item.id} item={item} />
            ))
          }
        </View>
        
        {/* Second row - Medium cards */}
        <View style={styles.row}>
          {japanExperiences
            .filter(item => item.size === 'medium')
            .map(item => (
              <ExperienceCard key={item.id} item={item} />
            ))
          }
        </View>
        
        {/* Third row - Small cards */}
        <View style={styles.row}>
          {japanExperiences
            .filter(item => item.size === 'small')
            .map(item => (
              <ExperienceCard key={item.id} item={item} />
            ))
          }
        </View>
        
        {/* Fourth row - Large card */}
        <View style={styles.row}>
          {japanExperiences
            .filter(item => item.size === 'large' && item.id === '6')
            .map(item => (
              <ExperienceCard key={item.id} item={item} />
            ))
          }
        </View>
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
  }
});
