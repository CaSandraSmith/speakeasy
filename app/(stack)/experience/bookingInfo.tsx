import React from 'react';
import { View, Text, SafeAreaView, StatusBar, Image, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { COLORS } from '@/app/constants/colors';
import { Booking } from '../../types';
import { useLocalSearchParams } from 'expo-router';

export default function BookingInfo() {
  const params = useLocalSearchParams();
  const bookingId = params.bookingId as string;
  
  // Constants from requirements
  const backgroundColor = 'white';
  const dashColor = COLORS.background;
  const dashCount = 13;
  const dashWidth = 20;
  const dashHeight = 4;
  const dashSpacing = 10;

  // Get window dimensions
  const { width, height } = Dimensions.get('window');

  // Mock booking data - replace with actual API call
  const booking: Booking = {
    id: parseInt(bookingId) || 1,
    user_id: 1,
    experience: {
      id: 101,
      title: "Romantic Paris Getaway",
      location: "Paris, France",
      average_rating: 4.8,
      schedule: {
        id: 1,
        start_date: "2025-06-15",
        end_date: "2025-06-20"
      }
    },
    number_of_guests: 2,
    confirmation_code: "TRV2025061500123"
  };

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Render dashed line
  const renderDashes = () => {
    const dashes = [];
    for (let i = 0; i < dashCount; i++) {
      dashes.push(
        <View
          key={i}
          style={[
            styles.dash,
            {
              backgroundColor: dashColor,
              width: dashWidth,
              height: dashHeight,
              marginHorizontal: dashSpacing / 2,
            }
          ]}
        />
      );
    }
    return dashes;
  };

  return (
    
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Your Booking</Text>
            <Text style={styles.headerSubtitle}>
              Confirmation #{booking.confirmation_code}
            </Text>
          </View>

          {/* Ticket Container */}
          <View style={styles.ticketContainer}>
            <View style={[styles.ticket, { backgroundColor, width: width * 0.9 }]}>
              {/* Left Cutout */}
              <View style={[styles.cutout, styles.leftCutout]} />
              
              {/* Right Cutout */}
              <View style={[styles.cutout, styles.rightCutout]} />

              {/* Top Section */}
              <View style={styles.ticketTop}>
                {/* Logo and Booking ID */}
                <View style={styles.logoBookingRow}>
                  <Image
                    source={require('../../../assets/images/icon.png')}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                  <View style={styles.bookingIdContainer}>
                    <Text style={styles.bookingIdLabel}>Booking ID</Text>
                    <Text style={styles.bookingIdValue}>#{booking.id}</Text>
                  </View>
                </View>

                {/* Main Information */}
                <View style={styles.infoSection}>
                  {/* Experience Title */}
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Experience</Text>
                    <Text style={styles.infoValue}>
                      {booking.experience?.title || booking.bundle?.name || "N/A"}
                    </Text>
                  </View>

                  {/* Location */}
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Location</Text>
                    <Text style={styles.infoValueSecondary}>
                      {booking.experience?.location || "N/A"}
                    </Text>
                  </View>

                  {/* Date and Guests */}
                  <View style={styles.infoRow}>
                    <View style={styles.infoColumn}>
                      <Text style={styles.infoLabel}>Check-in Date</Text>
                      <Text style={styles.infoValueSecondary}>
                        {formatDate(booking.experience?.schedule?.start_date)}
                      </Text>
                    </View>
                    <View style={[styles.infoColumn, styles.alignRight]}>
                      <Text style={styles.infoLabel}>Number of Guests</Text>
                      <Text style={styles.infoValueSecondary}>
                        {booking.number_of_guests} {booking.number_of_guests === 1 ? 'Guest' : 'Guests'}
                      </Text>
                    </View>
                  </View>

                  {/* Check-out Date */}
                  {booking.experience?.schedule?.end_date && (
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Check-out Date</Text>
                      <Text style={styles.infoValueSecondary}>
                        {formatDate(booking.experience.schedule.end_date)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Dashed Separator */}
              <View style={styles.dashContainer}>
                {renderDashes()}
              </View>

              {/* QR Code Section */}
              <View style={styles.qrSection}>
                <Text style={styles.qrLabel}>Scan for digital check-in</Text>
                <View style={styles.qrContainer}>
                  <Image
                    source={require('../../../assets/images/qr-code.png')}
                    style={styles.qrCode}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.qrHint}>Present this QR code at check-in</Text>
              </View>
            </View>
          </View>

          {/* Additional Information Cards */}
          <View style={styles.cardsContainer}>
            {/* Instructions Card */}
            <View style={styles.infoCard}>
              <Text style={styles.cardTitle}>Check-in Instructions</Text>
              <Text style={styles.cardText}>
                • Present this ticket at the venue{'\n'}
                • Arrive 15 minutes before scheduled time{'\n'}
                • Valid photo ID required{'\n'}
                • Confirmation code: {booking.confirmation_code}
              </Text>
            </View>

          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    color: COLORS.primaryText,
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 24,
  },
  headerSubtitle: {
    color: COLORS.secondaryText,
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    marginTop: 4,
  },
  ticketContainer: {
    paddingHorizontal: 12,
    paddingBottom: 16,
    alignItems: 'center',
  },
  ticket: {
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  cutout: {
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: COLORS.background,
    borderRadius: 25,
    zIndex: 3,
  },
  leftCutout: {
    left: -25,
    top: '60%',
  },
  rightCutout: {
    right: -25,
    top: '60%',
  },
  ticketTop: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  logoBookingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  logo: {
    width: 36,
    height: 36,
  },
  bookingIdContainer: {
    alignItems: 'flex-end',
  },
  bookingIdLabel: {
    color: '#6B7280',
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
  },
  bookingIdValue: {
    color: COLORS.background,
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
  },
  infoSection: {
    gap: 16,
  },
  infoItem: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoColumn: {
    flex: 1,
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  infoLabel: {
    color: '#6B7280',
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    marginBottom: 4,
  },
  infoValue: {
    color: COLORS.background,
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
  },
  infoValueSecondary: {
    color: COLORS.background,
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
  },
  dashContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    right: 0,
    top: '65%',
    marginTop: -2,
    zIndex: 2,
  },
  dash: {
    borderRadius: 2,
  },
  qrSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 48,
    alignItems: 'center',
  },
  qrLabel: {
    color: '#6B7280',
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    marginBottom: 12,
  },
  qrContainer: {
    padding: 8,
  },
  qrCode: {
    width: 100,
    height: 100,
  },
  qrHint: {
    color: '#9CA3AF',
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    marginTop: 8,
  },
  cardsContainer: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  infoCard: {
    backgroundColor: COLORS.primaryText,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    color: COLORS.background,
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    marginBottom: 8,
  },
  cardText: {
    color: COLORS.background,
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  cardTextDescription: {
    marginTop: 4,
  },
});
