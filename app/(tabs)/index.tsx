// app/(tabs)/index.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  StatusBar,
  Dimensions,
  StyleSheet,
  Platform,
  Text,
} from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import Constants from "expo-constants";
import { useAuthFetch } from "@/context/userContext";
const FLASK_URL = Constants.expoConfig?.extra?.FLASK_URL;

// Components
import Header from "../components/indexPage/Header";
import SearchBar from "../components/indexPage/SearchBar";
import CategoryTabs from "../components/indexPage/CategoryTabs";
import DestinationCard from "../components/indexPage/DestinationCard";
import BackdropPhoto from "../components/indexPage/BackdropPhoto";

import { Experience, Tag } from "../types";

const { width, height } = Dimensions.get("screen");
const _imageWidth = Platform.select({
  web: Math.min(width * 0.4, 400), // Limit max width on web
  default: width * 0.7,
});
const _spacing = 12;

export default function Index() {
  const [searchText, setSearchText] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Tag | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const router = useRouter();
  const authFetch = useAuthFetch();

  const scrollX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x / (_imageWidth + _spacing);
  });

  // fetch all tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await authFetch(`${FLASK_URL}/tags/`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setTags(data.tags);
        } else {
          console.error("Failed to fetch:", response.status);
        }
      } catch (e) {
        console.error("There was an error:", e);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    if (!tags.length) return;
    setSelectedCategory(tags[0]);
  }, [tags]);

  // Update experiences when category changes
  useEffect(() => {
    if (!selectedCategory) return
    
    const fetchExpereinces = async () => {
      try {
        const response = await authFetch(`${FLASK_URL}/experiences/tag/${selectedCategory.id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setExperiences(data.experiences);
        } else {
          console.error("Failed to fetch:", response.status);
        }
      } catch (e) {
        console.error("There was an error:", e);
      }
    };

    fetchExpereinces();
  }, [selectedCategory]);

  const handleSearch = () => {
    if (searchText.trim()) {
      router.push({
        pathname: "/(stack)/experience",
        params: { search: searchText },
      });
    }
  };

  const handleCategoryChange = (category: Tag) => {
    setSelectedCategory(category);
  };

  return (
    <View className="flex-1">
      {/* Status Bar - set to transparent so it takes the color of the backdrop */}
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />

      {/* Background Photos - Full screen including status bar and bottom area */}
      <View style={StyleSheet.absoluteFillObject}>
        {experiences.map((experience, index) => (
          <BackdropPhoto
            key={`${selectedCategory?.id}-${experience.id}`} // ensures old ones fully unmount
            destination={{
              id: experience.id.toString(),
              name: experience.title,
              image: experience.images?.[0].image_url,
            }}
            index={index}
            scrollX={scrollX}
          />
        ))}
      </View>

      {/* Main Content */}
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: "transparent" }}
      >
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
              categories={tags}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategoryChange}
            />
          </View>

          {/* Carousel Container - adjusted spacing */}
          <View
            className="flex-1"
            style={{ paddingTop: 20, justifyContent: "flex-start" }}
          >
            <Animated.FlatList
              data={experiences}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              style={{ flexGrow: 0 }}
              snapToInterval={_imageWidth + _spacing}
              decelerationRate="fast"
              contentContainerStyle={{
                gap: _spacing,
                paddingHorizontal: (width - _imageWidth) / 2,
                alignItems: "center",
              }}
              renderItem={({ item, index }) => {
                return (
                  <DestinationCard
                    destination={item}
                    index={index}
                    scrollX={scrollX}
                    onPress={() => {
                      router.push({
                        pathname: `/(stack)/experience/${item.id}`,
                        params: { id: item.id },
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
