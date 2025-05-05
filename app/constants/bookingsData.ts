import { getAllFeaturedExperiences } from '../constants/featuredExperiences';
import { Booking } from '../components/bookingsPage/BookingsCard';

// Generate mock bookings data using featured experiences
export const getMockBookings = (): Booking[] => {
  const allExperiences = getAllFeaturedExperiences();
  
  return [
    {
      id: 1,
      experienceId: allExperiences[0].id,
      title: allExperiences[0].title,
      location: allExperiences[0].location.split(',')[0].trim(),
      country: allExperiences[0].location.split(',')[1]?.trim() || 'USA',
      image: allExperiences[0].image,
      startDate: 'April 20',
      endDate: 'April 25',
      status: 'upcoming'
    },
    {
      id: 2,
      experienceId: allExperiences[1].id,
      title: allExperiences[1].title,
      location: allExperiences[1].location.split(',')[0].trim(),
      country: allExperiences[1].location.split(',')[1]?.trim() || 'Ocean',
      image: allExperiences[1].image,
      startDate: 'March 15',
      endDate: 'March 20',
      status: 'completed'
    },
    {
      id: 3,
      experienceId: allExperiences[2].id,
      title: allExperiences[2].title,
      location: allExperiences[2].location.split(',')[0].trim(),
      country: allExperiences[2].location.split(',')[1]?.trim() || 'UK',
      image: allExperiences[2].image,
      startDate: 'October 5',
      endDate: 'October 10',
      status: 'completed'
    },
    {
      id: 4,
      experienceId: allExperiences[3].id,
      title: allExperiences[3].title,
      location: allExperiences[3].location.split(',')[0].trim(),
      country: allExperiences[3].location.split(',')[1]?.trim() || 'Japan',
      image: allExperiences[3].image,
      startDate: 'June 15',
      endDate: 'June 20',
      status: 'upcoming'
    },
  ];
};
