import React from 'react';
import { Text, View, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Index() {
  const recommendedDestinations = [
    {
      id: '1',
      name: 'Maldive Islands',
      location: 'Indian Ocean',
      rating: 4.95,
      image: require("../../assets/images/maldives.jpg"),
    },
    {
      id: '2',
      name: 'Mount Everest',
      location: 'Himalayas',
      rating: 4.92,
      image: require('../../assets/images/everest.jpg'),
    },
    {
      id: '3',
      name: 'Blue Lago',
      location: 'Europe',
      rating: 4.8,
      image: require('../../assets/images/blue-lago.jpg'),
    },
  ];

  const lastMinuteDeal = {
    name: 'Dine with a Star',
    image: require('../../assets/images/dinner.jpg'),
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>WELCOME</Text>
            <Text style={styles.exploreText}>Explore</Text>
          </View>
          <View style={styles.profileButton}>
            {/* <Image 
              source={require('../assets/profile.jpg')} 
              style={styles.profileImage} 
            /> */}
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a place... (try island)"
            placeholderTextColor="#888"
          />
        </View>

        {/* Recommended Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendedScroll}>
            {recommendedDestinations.map((dest) => (
              <TouchableOpacity key={dest.id} style={styles.destinationCard}>
                <Image source={dest.image} style={styles.destinationImage} />
                {/* <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={12} color="#FFD700" />
                  <Text style={styles.ratingText}>{dest.rating}</Text>
                </View> */}
                <View style={styles.destinationInfo}>
                  <Text style={styles.destinationName}>{dest.name}</Text>
                  <View style={styles.locationContainer}>
                    <Ionicons name="location" size={12} color="#888" />
                    <Text style={styles.locationText}>{dest.location}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Last Minute Deal Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Last Minute Deal</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dealCard}>
            <Image source={lastMinuteDeal.image} style={styles.dealImage} />
            <View style={styles.dealInfo}>
              <Text style={styles.dealName}>{lastMinuteDeal.name}</Text>
              <TouchableOpacity style={styles.offerButton}>
                <Text style={styles.offerButtonText}>GET OFFER</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  welcomeText: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  exploreText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 20,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: '#333',
  },
  sectionContainer: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  viewAllText: {
    fontSize: 14,
    color: '#0066CC',
  },
  recommendedScroll: {
    marginLeft: -5,
  },
  destinationCard: {
    width: 160,
    height: 220,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginRight: 15,
  },
  destinationImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  ratingContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  ratingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  destinationInfo: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  destinationName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  dealCard: {
    width: '100%',
    height: 180,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  dealImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  dealInfo: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dealName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  offerButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  offerButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 12,
    marginTop: 3,
    color: '#000',
  },
  inactiveTabText: {
    color: '#888',
  },
});
