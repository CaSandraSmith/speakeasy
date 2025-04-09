import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Animated,
  Easing,
  TouchableOpacity,
} from "react-native";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";

type Inputs = {
  passcode: string;
};

export default function Passcode() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data)
    router.push("/signup")
  };

  const demoPress = () => {
    router.push("/signup");
  }

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, // Fade in
      duration: 1000, // 1 second
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Enter your referral code</Text>
      <Animated.View style={[styles.form, { opacity: fadeAnim }]}>
        <Controller
          control={control}
          rules={{
            required: "Passcode is required",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputWrapper}>
              <FontAwesome
                name="user"
                size={20}
                color="white"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Passcode"
                placeholderTextColor="#a9a9a9"
              />
            </View>
          )}
          name="passcode"
        />
        {errors.passcode && (
          <Text style={styles.error}>{errors.passcode.message}</Text>
        )}

        <View style={styles.buttonsWrapper}>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => demoPress()}
            style={styles.demoButton}
          >
            <Text style={styles.buttonText}>Use Demo Code</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      <TouchableOpacity style={styles.loginTextWrapper} onPress={() => router.push("/login")}>
        <Text style={styles.loginText}>Already a user? Log in</Text>
      </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a3636", // Dark luxury green background
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 50,
    marginBottom: 30, // Adds space between the header and the form
    color: "#a27b5b", // Gold color for the header
    fontWeight: "bold",
    textAlign: "center",
  },
  form: {
    width: "100%",
    backgroundColor: "#2c4747", // Darker form background for contrast
    padding: 20,
    borderRadius: 10,
    elevation: 5, // Adds shadow for a luxury effect
    alignItems: "flex-end",
  },
  input: {
    height: 50,
    paddingHorizontal: 15,
    backgroundColor: "#3e5959", // Dark input background
    color: "white", // White text inside the input
    borderRadius: 5,
    fontSize: 16,
    width: "100%",
    paddingLeft: 50, // Added padding to ensure the text doesn't overlap the icon
  },
  error: {
    color: "red",
    marginBottom: 18,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#3e5959",
    borderRadius: 5,
    width: "100%",
    borderWidth: 1,
    borderColor: "#a27b5b", // Gold border color for inputs
  },
  icon: {
    marginRight: 10,
    position: "absolute",
    paddingLeft: 15,
    fontFamily: "FontAwesome",
  },
  button: {
    width: 150,
    backgroundColor: "#a27b5b",
    borderRadius: 10,
    padding: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    textAlign: "center",
  },
  buttonsWrapper: {
    alignItems: "center",
    rowGap: 20,
    width: "100%"
  },
  demoButton: {
    backgroundColor: "#a27b5b",
    borderRadius: 10,
    padding: 10,
  },
  loginTextWrapper: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  loginText: {
    color: "white",
    fontSize: 25,
    textDecorationLine: "underline"
  }
});
