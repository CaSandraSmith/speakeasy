import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StatusBar, Image, ScrollView, Dimensions, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { COLORS } from '@/app/constants/colors';
import { Booking, Reservation } from '../../types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuthFetch } from "../../../context/userContext";
import Constants from "expo-constants";
import { Ionicons } from '@expo/vector-icons';

const FLASK_URL = Constants.expoConfig?.extra?.FLASK_URL;

export default function BookingInfo() {
  const { bookingId } = useLocalSearchParams();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const authFetch = useAuthFetch();
  
  // Constants from requirements
  const backgroundColor = 'white';
  const dashColor = COLORS.background;
  const dashCount = 13;
  const dashWidth = 20;
  const dashHeight = 4;
  const dashSpacing = 10;

  // Get window dimensions
  const { width, height } = Dimensions.get('window');

  const formatDateWithSuffix = (dateStr: string): string => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const year = date.getFullYear();
    const month = date.toLocaleString("en-US", { month: "long" });
  
    const getDaySuffix = (d: number): string => {
      if (d >= 11 && d <= 13) return "th";
      switch (d % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };
  
    return `${month} ${day}${getDaySuffix(day)}, ${year}`;
  }

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await authFetch(`${FLASK_URL}/bookings/${bookingId}`, {
          method: "GET",
        });

        if (response.ok) {
          const data = await response.json()
          setBooking(data);
          console.log('Booking data:', data);
        } else {
          console.error("Failed to fetch booking:", response.status);
        }
      } catch (e) {
        console.error("There was an error:", e);
      }
    };

    fetchBooking();
  }, [bookingId]);

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

  const convertTimeToAmPm = (timeStr: string): string => {
    const [hoursStr, minutesStr, secondsStr] = timeStr.split(":");
    let hours = parseInt(hoursStr, 10);
    const period = hours >= 12 ? "PM" : "AM";
    
    // Convert to 12-hour format
    hours = hours % 12 || 12; // 0 becomes 12
  
    return `${hours}${period}`;
  }

  const timeMarkup = (reservation: Reservation) => {
    let returned = ''

    if (reservation.start_time) {
      returned += ` · ${convertTimeToAmPm(reservation.start_time)}`

      if (reservation.end_time) {
        returned += ` - ${convertTimeToAmPm(reservation.end_time)}`
      }
    }

    return returned
  }

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

    if (!booking) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primaryText} />
          <Text style={styles.loadingText}>Loading booking information...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.headerWrapper}>
            <TouchableOpacity
              onPress={() => 
                {
                  router.dismissAll()
                  router.replace('/(tabs)/bookings')
                }}
              style={styles.backButton}
            >
              <Ionicons
                name="chevron-back"
                size={28}
                color={COLORS.primaryText}
              />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Your Booking</Text>
              <Text style={styles.headerSubtitle}>
                Confirmation #{booking.confirmation_code}
              </Text>
            </View>
            {/* Empty view for spacing symmetry */}
            <View style={{ width: 36 }} />
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

              {/* QR Code */}
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

              {/* Dashed Separator */}
              <View style={styles.dashContainer}>
                {renderDashes()}
              </View>

                {/* Main Information */}
                <View style={styles.infoSection}>
                  {/* Experience Title */}
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Experience</Text>
                    <Text style={styles.infoValueSecondary}>{booking.experience?.title}</Text>
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
                      <Text style={styles.infoLabel}>Travel Date</Text>
                      <Text style={styles.infoValueSecondary}>
                        {formatDateWithSuffix(booking.reservations[0].date)}</Text>
                      <Text style={styles.infoValueSecondary}>  
                        {timeMarkup(booking.reservations[0])}
                      </Text>
                    </View>
                    <View style={[styles.infoColumn, styles.alignRight]}>
                      <Text style={styles.infoLabel}>Number of Guests</Text>
                      <Text style={styles.infoValueSecondary}>
                        {booking.number_of_guests} {booking.number_of_guests === 1 ? 'Guest' : 'Guests'}
                      </Text>
                    </View>
                  </View>
                  
                  <View>
                    <Text style={styles.infoLabel}>Check-in Instructions</Text>
                    <Text style={styles.infoValueSecondary}>
                      • Present this ticket at the venue{'\n'}
                      • Arrive 15 minutes before scheduled time{'\n'}
                      • Valid photo ID required{'\n'}
                    </Text>
                  </View>  
                  </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    color: COLORS.primaryText,
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    marginTop: 16,
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
    paddingBottom: 25,
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
    minHeight: 680,
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
    top: '52%',
  },
  rightCutout: {
    right: -25,
    top: '52%',
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
    marginBottom: 16,
  },
  logo: {
    width: 50,
    height: 50,
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
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
  infoItem: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
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
    marginBottom: 1,
  },
  infoValue: {
    color: COLORS.background,
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
  },
  infoValueSecondary: {
    color: COLORS.background,
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
  },
  dashContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    right: 0,
    top: '55%',
    zIndex: 2,
  },
  dash: {
    borderRadius: 2,
  },
  qrSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
  qrLabel: {
    color: '#6B7280',
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    marginBottom: 12,
  },
  qrContainer: {
    padding: 2,
  },
  qrCode: {
    width: 200,
    height: 200,
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
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
  backButton: {
    width: 36,
    alignItems: "flex-start",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
});
