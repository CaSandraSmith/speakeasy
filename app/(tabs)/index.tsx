import React, { useState } from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  TextInput, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  ImageBackground 
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


const COLORS = {
  background: "#1A3636", 
  primary: "#1A3636",    
  primaryText: "#DCD7C9", 
  secondaryText: "#D6BD98", 
  searchBg: "rgba(220, 215, 201, 0.2)", 
  cardBg: "#1A3636", 
  accent: "#D6BD98" 
};

export default function Index() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Popular');
  const router = useRouter();
  
  const categories = [
    'Popular',
    'Adventure',
    'Culture',
    'Festival',
    'Other'
  ];
  
  const destinations = [
    {
      id: '1',
      name: 'Maldives',
      image: require("../../assets/images/maldives.jpg"),
      rating: 4.5,
      reviews: 1010
    },
    {
      id: '2',
      name: 'Santorini',
      image: require('../../assets/images/blue-lago.jpg'),
      rating: 4.7,
      reviews: 890
    }
  ];

  const handleSearch = () => {
    if (searchText.trim()) {
      router.push({
        pathname: '/experience',
        params: { search: searchText }
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background Image with Overlay */}
      <ImageBackground 
        source={require('../../assets/images/everest.jpg')}
        style={styles.backgroundImage}
      >
        {/* Header with User Profile */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image 
                source={require('../../assets/images/dinner.jpg')} 
                style={styles.avatar} 
              />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.greeting}>Hi,</Text>
              <Text style={styles.userName}>Name</Text>
            </View>
          </View>
        </View>
        
        <Text className="font-bold text-lg my-10">Welcome</Text>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
        <TextInput
            style={styles.searchInput}
            placeholder="Where you want to go?"
            placeholderTextColor="#666"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Ionicons name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </ImageBackground>
      
      {/* Main Content Card */}
      <View style={styles.contentCard}>
        {/* Categories */}
        <Text style={styles.categoryHeader}>Category</Text>
        <View style={styles.categoryWrapper}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoryContainer}
            contentContainerStyle={styles.categoryContentContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity 
                key={category} 
                style={styles.categoryItem}
                onPress={() => setSelectedCategory(category)}
              >
                <Text 
                  style={[
                    styles.categoryText, 
                    selectedCategory === category && styles.selectedCategoryText
                  ]}
                >
                  {category}
                </Text>
                {selectedCategory === category && <View style={styles.categoryDot} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* Destinations */}
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          style={styles.destinationsContainer}
          contentContainerStyle={styles.destinationsContentContainer}
        >
          {destinations.map((destination) => (
            <TouchableOpacity key={destination.id} style={styles.destinationCard}>
              <Image 
                source={destination.image} 
                style={styles.destinationImage}
              />
              <View style={styles.destinationDetails}>
                <View style={styles.locationContainer}>
                  <Ionicons name="location" size={16} color="#fff" />
                  <Text style={styles.locationText}>{destination.name}</Text>
                </View>
                {/* <View style={styles.ratingContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons 
                      key={star}
                      name={star <= Math.floor(destination.rating) ? "star" : star <= destination.rating ? "star-half" : "star-outline"} 
                      size={14} 
                      color="#fff" 
                    />
                  ))}
                  <Text style={styles.ratingText}>
                    {destination.rating} ({destination.reviews})
                  </Text>
                </View> */}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundImage: {
    width: '100%',
    height: 260,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    overflow: 'hidden',
    marginRight: 10,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  userInfo: {
    flexDirection: 'column',
  },
  greeting: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '400',
  },
  userName: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 25,
    backgroundColor: COLORS.searchBg,
    paddingHorizontal: 15,
    height: 50,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  searchButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.secondaryText,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentCard: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  categoryHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primaryText,
    marginBottom: 10,
  },
  categoryWrapper: {
    height: 50, // Fixed height for category section
  },
  categoryContainer: {
    flexDirection: 'row',
  },
  categoryContentContainer: {
    alignItems: 'center',
    paddingBottom: 5,
  },
  categoryItem: {
    marginRight: 25,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30, // Fixed height for each category item
  },
  categoryText: {
    fontSize: 16,
    color: 'rgba(220, 215, 201, 0.6)',
    marginBottom: 5,
  },
  selectedCategoryText: {
    color: COLORS.secondaryText,
    fontWeight: '500',
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.secondaryText,
  },
  destinationsContainer: {
    flex: 1,
    marginTop: 10,
  },
  destinationsContentContainer: {
    paddingBottom: 20,
  },
  destinationCard: {
    width: '100%',
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  destinationImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  destinationDetails: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  locationText: {
    color: COLORS.primaryText,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: COLORS.primaryText,
    fontSize: 12,
    marginLeft: 5,
  },
});
