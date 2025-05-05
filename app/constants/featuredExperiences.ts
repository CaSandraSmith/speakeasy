export interface ExperienceItem {
  id: number;
  title: string;
  description: string;
  location: string;
  price: number;
  image: any;
  rating?: number;
  reviews?: number;
  tags: string[];
}

export const categories = [
  'Exclusive Access',
  'Once in a Lifetime',
  'Adventure',
  'Ocean',
  'Space',
  'Celebrity'
] as const;

export type CategoryType = typeof categories[number];

// Featured experiences data - this will be replaced with API data later
export const featuredExperiencesByCategory: Record<CategoryType, ExperienceItem[]> = {
  'Exclusive Access': [
    {
      id: 2,
      title: 'Black Origin Space Experience',
      description: '11-minute suborbital flight to the edge of space, crossing the Kármán line with several minutes of weightlessness',
      location: 'West Texas, USA',
      price: 450000.00,
      image: require('../../assets/images/space-flight.jpg'),
      rating: 5.0,
      reviews: 8,
      tags: ['Space', 'Extreme', 'Adventure', 'Exclusive Access']
    },
    {
      id: 4,
      title: 'Submarine Expedition to Titanic',
      description: 'Dive to the Titanic wreck in a private submersible with oceanographers',
      location: 'North Atlantic Ocean',
      price: 250000.00,
      image: require('../../assets/images/titanic-sub.jpg'),
      rating: 4.9,
      reviews: 43,
      tags: ['Ocean', 'Once in a Lifetime', 'Historical', 'Exclusive Access']
    },
    {
      id: 31,
      title: 'Timeless Brushstrokes: Paint With the Masters',
      description: 'Step inside an exclusive studio to co-create art with your favorite artist—past or present—in a once-in-a-lifetime immersive experience',
      location: 'London, UK', 
      price: 200000.00,
      image: require('../../assets/images/art-studio.jpg'),
      rating: 5.0,
      reviews: 12,
      tags: ['Celebrity', 'Once in a Lifetime', 'Exclusive Access']
    }
  ],
  'Once in a Lifetime': [
    {
      id: 4,
      title: 'Submarine Expedition to Titanic',
      description: 'Dive to the Titanic wreck in a private submersible with oceanographers',
      location: 'North Atlantic Ocean',
      price: 250000.00,
      image: require('../../assets/images/titanic-sub.jpg'),
      rating: 4.9,
      reviews: 43,
      tags: ['Ocean', 'Once in a Lifetime', 'Historical', 'Exclusive Access']
    },
    {
      id: 16,
      title: 'Gorilla Family Adoption',
      description: 'Spend a week with researchers and adopt a gorilla family',
      location: 'Volcanoes National Park, Rwanda',
      price: 50000.00,
      image: require('../../assets/images/gorilla-family.jpg'),
      rating: 4.7,
      reviews: 67,
      tags: ['Wildlife', 'Once in a Lifetime', 'Educational']
    },
    {
      id: 25,
      title: 'Egyptian Tomb Opening',
      description: 'Witness the opening of newly discovered tomb with archaeologists',
      location: 'Valley of the Kings, Egypt',
      price: 100000.00,
      image: require('../../assets/images/egypt-tomb.jpg'),
      rating: 5.0,
      reviews: 21,
      tags: ['Historical', 'Once in a Lifetime', 'Educational']
    }
  ],
  'Adventure': [
    {
      id: 12,
      title: 'Supersonic Fighter Pilot',
      description: 'Fly and control an L-39 fighter jet breaking the sound barrier',
      location: 'Las Vegas, USA',
      price: 22000.00,
      image: require('../../assets/images/fighter-jet.jpg'),
      rating: 4.8,
      reviews: 234,
      tags: ['Ocean', 'Wildlife', 'Adventure']
    },
    {
      id: 11,
      title: 'Volcano Lava Lake Descent',
      description: 'Rappel into an active volcano with volcanologists',
      location: 'Marum Crater, Vanuatu',
      price: 15000.00,
      image: require('../../assets/images/volcano-descent.jpg'),
      rating: 4.6,
      reviews: 78,
      tags: ['Extreme', 'Once in a Lifetime', 'Scientific', 'Adventure']
    },
    {
      id: 23,
      title: 'Formula 1 Driver Experience',
      description: 'Drive an actual F1 car with professional training and pit crew',
      location: 'Silverstone, UK',
      price: 35000.00,
      image: require('../../assets/images/f1-car.jpg'),
      rating: 4.9,
      reviews: 156,
      tags: ['Extreme', 'Adventure', 'Luxury']
    }
  ],
  'Ocean': [
    {
      id: 4,
      title: 'Submarine Expedition to Titanic',
      description: 'Dive to the Titanic wreck in a private submersible with oceanographers',
      location: 'North Atlantic Ocean',
      price: 250000.00,
      image: require('../../assets/images/titanic-sub.jpg'),
      rating: 4.9,
      reviews: 43,
      tags: ['Ocean', 'Once in a Lifetime', 'Historical', 'Exclusive Access']
    },
    {
      id: 10,
      title: 'Everest Base Camp Helicopter',
      description: 'Private helicopter tour to Everest Base Camp with champagne breakfast',
      location: 'Nepal',
      price: 7500.00,
      image: require('../../assets/images/everest-helicopter.jpg'),
      rating: 4.8,
      reviews: 234,
      tags: ['Adventure', 'Luxury']
    },
    {
      id: 21,
      title: 'Underwater Wine Cellar',
      description: 'Dive to retrieve aged wine from underwater cellar, followed by tasting',
      location: 'Corsica, France',
      price: 8000.00,
      image: require('../../assets/images/underwater-wine.jpg'),
      rating: 4.7,
      reviews: 92,
      tags: ['Culinary', 'Ocean', 'Adventure']
    }
  ],
  'Space': [
    {
      id: 1,
      title: 'Zero Gravity Space Training',
      description: 'Experience astronaut training and zero gravity flight with Space Adventures',
      location: 'Star City, Russia',
      price: 24999.99,
      image: require('../../assets/images/zero-gravity.jpg'),
      rating: 4.9,
      reviews: 127,
      tags: ['Space', 'Educational', 'Adventure']
    },
    {
      id: 2,
      title: 'Black Origin Space Experience',
      description: '11-minute suborbital flight to the edge of space, crossing the Kármán line with several minutes of weightlessness',
      location: 'West Texas, USA',
      price: 450000.00,
      image: require('../../assets/images/space-flight.jpg'),
      rating: 5.0,
      reviews: 8,
      tags: ['Space', 'Extreme', 'Adventure', 'Exclusive Access']
    },
    {
      id: 3,
      title: 'Private SpaceX Launch Viewing',
      description: 'VIP access to witness a SpaceX rocket launch with meet & greet with engineers',
      location: 'Cape Canaveral, USA',
      price: 15000.00,
      image: require('../../assets/images/spacex-launch.jpg'),
      rating: 4.8,
      reviews: 65,
      tags: ['Space', 'Exclusive Access', 'Scientific']
    }
  ],
  'Celebrity': [
    {
      id: 22,
      title: 'Hollywood Movie Set Access',
      description: 'Spend a day on set of major Hollywood production as VIP guest',
      location: 'Los Angeles, USA',
      price: 25000.00,
      image: require('../../assets/images/movie-set.jpg'),
      rating: 4.7,
      reviews: 89,
      tags: ['Celebrity', 'Exclusive Access']
    },
    {
      id: 24,
      title: 'Private Concert Series',
      description: 'Commission private performances from Grammy-winning artists',
      location: 'Your Choice',
      price: 500000.00,
      image: require('../../assets/images/private-concert.jpg'),
      rating: 5.0,
      reviews: 15,
      tags: ['Celebrity', 'Luxury', 'Once in a Lifetime']
    },
    {
      id: 47,
      title: 'James Bond Experience',
      description: 'Drive Bond cars, use gadgets with stunt coordinators',
      location: 'London, UK',
      price: 25000.00,
      image: require('../../assets/images/james-bond.jpg'),
      rating: 4.8,
      reviews: 134,
      tags: ['Adventure', 'Celebrity', 'Luxury']
    }
  ]
};

// Helper function to get featured experiences for a category
export const getFeaturedExperiences = (category: CategoryType): ExperienceItem[] => {
  return featuredExperiencesByCategory[category] || [];
};

// Helper function to get all featured experiences
export const getAllFeaturedExperiences = (): ExperienceItem[] => {
  return Object.values(featuredExperiencesByCategory).flat();
};
