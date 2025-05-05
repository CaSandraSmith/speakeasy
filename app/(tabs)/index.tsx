// app/(tabs)/index.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  SafeAreaView, 
  StatusBar,
  Dimensions,
  StyleSheet,
  Platform,
  Text
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";

// Components
import Header from '../components/indexPage/Header';
import SearchBar from '../components/indexPage/SearchBar';
import CategoryTabs from '../components/indexPage/CategoryTabs';
import DestinationCard from '../components/indexPage/DestinationCard';
import BackdropPhoto from '../components/indexPage/BackdropPhoto';

// Constants
import { 
  categories, 
  featuredExperiencesByCategory, 
  CategoryType 
} from '../constants/featuredExperiences';

const {width, height} = Dimensions.get("screen");
const _imageWidth = Platform.select({
  web: Math.min(width * 0.4, 400), // Limit max width on web
  default: width * 0.7
});
const _spacing = 12;

export default function Index() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('Exclusive Access');
  const [experiences, setExperiences] = useState(featuredExperiencesByCategory['Exclusive Access']);
  const router = useRouter();

  const scrollX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x / (_imageWidth + _spacing);
  });

  // Update experiences when category changes
  useEffect(() => {
    setExperiences(featuredExperiencesByCategory[selectedCategory]);
  }, [selectedCategory]);

  const handleSearch = () => {
    if (searchText.trim()) {
      router.push({
        pathname: '/(stack)/experience',
        params: { search: searchText }
      });
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category as CategoryType);
  };

  return (
    <View className="flex-1">
      {/* Status Bar - set to transparent so it takes the color of the backdrop */}
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      
      {/* Background Photos - Full screen including status bar and bottom area */}
      <View style={StyleSheet.absoluteFillObject}>
        {experiences.map((experience, index) => (
          <BackdropPhoto 
            key={experience.id} 
            destination={{
              id: experience.id.toString(),
              name: experience.title,
              image: experience.image,
              rating: experience.rating,
              reviews: experience.reviews
            }} 
            index={index} 
            scrollX={scrollX} 
          />
        ))}
      </View>
      
      {/* Main Content */}
      <SafeAreaView className="flex-1" style={{ backgroundColor: 'transparent' }}>
        <View className="flex-1 px-5">
          {/* Fixed Header Section */}
          <View>
            <Header />
            <SearchBar 
              value={searchText}
              onChangeText={setSearchText}
              onSubmit={handleSearch}
            />
            <CategoryTabs 
              categories={categories as unknown as string[]}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategoryChange}
            />
          </View>
          
          {/* Carousel Container - adjusted spacing */}
          <View className="flex-1" style={{ paddingTop: 20, justifyContent: 'flex-start' }}>
            <Animated.FlatList
              data={experiences}
              keyExtractor={item => item.id.toString()}
              horizontal
              style={{ flexGrow: 0 }}
              snapToInterval={_imageWidth + _spacing}
              decelerationRate="fast"
              contentContainerStyle={{
                gap: _spacing,
                paddingHorizontal: (width - _imageWidth) / 2,
                alignItems: 'center'
              }}
              renderItem={({item, index}) => {
                return (
                  <DestinationCard 
                    destination={{
                      id: item.id.toString(),
                      name: item.title,
                      image: item.image,
                      rating: item.rating,
                      reviews: item.reviews
                    }} 
                    index={index} 
                    scrollX={scrollX} 
                    onPress={() => {
                      router.push({
                        pathname: '/(stack)/experience-detail',
                        params: { id: item.id }
                      });
                    }}
                  />
                );
              }}
              onScroll={onScroll}
              scrollEventThrottle={16.6}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
