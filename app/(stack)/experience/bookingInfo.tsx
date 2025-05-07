import { COLORS } from '@/app/constants/colors';
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Dimensions, Image } from 'react-native';

export default function App() {
  const backgroundColor = COLORS.background;
  const dashColor = 'white';
  const dashCount = 13;
  const dashWidth = 20;
  const dashHeight = 4;
  const dashSpacing = 10;
  
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
              marginHorizontal: dashSpacing / 2
            }
          ]} 
        />
      );
    }
    return dashes;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      <View style={styles.container}>
        <View style={[styles.ticket, { backgroundColor }]}>
          {/* Left cutout */}
          <View style={[styles.cutout, styles.leftCutout]} />
          
          {/* Right cutout */}
          <View style={[styles.cutout, styles.rightCutout]} />
          
          {/* Dashed line in the middle */}
          <View style={styles.dashContainer}>
            {renderDashes()}
          </View>
          
          {/* Content container */}
          <View style={styles.content}>
            <Image 
              source={require('../../../assets/images/icon.png')}
              style={styles.logo}/>
            <Text>Name</Text>
            <View>
              <Text>Number of Guest</Text>
              <Text> 1</Text>
            </View>

            {/* QR Code */}
            <View style={styles.qrContainer}>
              <Image
                source={require('../../../assets/images/qr-code.png')}
                style={styles.qrCode}/>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  ticket: {
    width: width * 0.9,
    height: height * 0.7,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  cutout: {
    position: 'absolute',
    width: 50,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 30,
    zIndex: 3,
  },
  leftCutout: {
    left: -30,
    top: '70%',
    marginTop: -30,
  },
  rightCutout: {
    right: -30,
    top: '70%',
    marginTop: -30,
  },
  dashContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    right: 0,
    top: '69%',
    marginTop: -4,
    zIndex: 2,
  },
  dash: {
    borderRadius: 4,
  },
  content: {
    flex: 1,
    padding: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
  },
  logo: {
    width: 100,
    height: 100,
  },
  qrContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    top: '50%',
  },
  qrCode: {
    width: 100,
    height: 100,
    color: 'white'
  }
});
