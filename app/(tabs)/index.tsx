import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { Link } from 'expo-router';
import * as SMS from "expo-sms";
import * as TaskManager from "expo-task-manager";
import { TaskManagerTaskBody } from "expo-task-manager";
import { Text, TouchableOpacity, Vibration } from "react-native";

const LOCATION_TASK = "background-location-task";

TaskManager.defineTask(
  LOCATION_TASK,
  ({ data, error }:TaskManagerTaskBody) => {
    if (error) return;

    if (data) {
      const { locations } = data as any;
      const loc = locations[0];

      console.log(
        "Background location:",
        loc.coords.latitude,
        loc.coords.longitude
      );
    }
  }
);
export default function HomeScreen() {
  const handleSOS = async () => {
  Vibration.vibrate(1000);

  // Get saved contacts
  const saved = await AsyncStorage.getItem("emergencyContacts");

  if (!saved) {
    alert("No emergency contact saved");
    return;
  }

  const numbers = JSON.parse(saved);

  // Ask location permission
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    alert("Location permission denied");
    return;
  }

  // Get location
  const loc = await Location.getCurrentPositionAsync({});

  const message =
    `🚨 SOS EMERGENCY 🚨\n` +
    `I need help!\n` +
    `Location:\n` +
    `https://maps.google.com/?q=${loc.coords.latitude},${loc.coords.longitude}`;

  // Check if SMS available
  const isAvailable = await SMS.isAvailableAsync();
  if (!isAvailable) {
    alert("SMS not supported on this device");
    return;
  }

  // Send SMS
  await SMS.sendSMSAsync(numbers, message);
};
 const startTracking = async () => {
  const { status } = await Location.requestBackgroundPermissionsAsync();

  if (status !== "granted") {
    alert("Permission denied");
    return;
  }

  const alreadyStarted =
    await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK);

  if (alreadyStarted) {
    alert("Tracking already running");
    return;
  }

  await Location.startLocationUpdatesAsync(LOCATION_TASK, {
    accuracy: Location.Accuracy.High,
    timeInterval: 5000,
    distanceInterval: 5,
    showsBackgroundLocationIndicator: true,
  });

  alert("Background tracking started");
};
return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
  <ThemedText type="title">My Safety App 🚀</ThemedText>
  <HelloWave />

  {/* SOS BUTTON */}
  <TouchableOpacity
    style={styles.sosButton}
    onPress={handleSOS}
  >
    <Text style={styles.sosText}>SOS</Text>
  </TouchableOpacity>

  {/* START TRACKING BUTTON */}
  <TouchableOpacity
    style={[styles.sosButton, { backgroundColor: "blue" }]}
    onPress={startTracking}
  >
    <Text style={styles.sosText}>Start Tracking</Text>
  </TouchableOpacity>

</ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <ThemedText type="subtitle">Step 2: Explore</ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert('Share pressed')}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => alert('Delete pressed')}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>

        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },

  stepContainer: {
    gap: 8,
    marginBottom: 8,
    paddingHorizontal: 20,
  },

  reactLogo: {
    height: 150,
    width: "100%",
    resizeMode: "contain",
  },

  sosButton: {
    marginTop: 20,
    backgroundColor: "red",
    paddingVertical: 20,
    width: "80%",
    borderRadius: 100,
    alignItems: "center",
  },

  sosText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
});
