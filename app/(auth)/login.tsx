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
import { useUser } from "../../context/userContext";
import { router } from "expo-router";
import Constants from 'expo-constants';

const FLASK_URL = Constants.expoConfig?.extra?.FLASK_URL;

console.log("FLASK_URL", FLASK_URL);

type Inputs = {
  email: string;
  password: string;
};

export default function Login() {
  const { setUser } = useUser();
  const [fadeAnim] = useState(new Animated.Value(0));
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const response = await fetch(`${FLASK_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const responseData = await response.json()

    if (response.ok) {
      setUser(responseData["user"]);
      router.push("/");
    } else {
      console.log(responseData.error)
    }
  };

  const demoPress = async () => {
    const response = await fetch(`${FLASK_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email: "red@example.com", password: "password1"})
    })

    const responseData = await response.json()

    if (response.ok) {
      setUser(responseData["user"]);
      router.push("/");
    } else {
      console.log(responseData.error)
    }
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
      <Text style={styles.header}>Log In</Text>
      <Animated.View style={[styles.form, { opacity: fadeAnim }]}>
        <Controller
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputWrapper}>
              <FontAwesome
                name="envelope"
                size={20}
                color="white"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Email"
                keyboardType="email-address"
                placeholderTextColor="#a9a9a9"
              />
            </View>
          )}
          name="email"
        />
        {errors.email && (
          <Text style={styles.error}>{errors.email.message}</Text>
        )}

        <Controller
          control={control}
          rules={{ required: "Password is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputWrapper}>
              <FontAwesome
                name="lock"
                size={20}
                color="white"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Password"
                placeholderTextColor="#a9a9a9"
                secureTextEntry
              />
            </View>
          )}
          name="password"
        />
        {errors.password && (
          <Text style={styles.error}>{errors.password.message}</Text>
        )}
        <View style={styles.buttonsWrapper}>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Log in</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => demoPress()}
            style={styles.demoButton}
          >
            <Text style={styles.buttonText}>Log in as Demo user</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      <TouchableOpacity
        style={styles.signupTextWrapper}
        onPress={() => router.push("/passcode")}
      >
        <Text style={styles.signupText}>Don't have an account? Sign up</Text>
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
    textAlign: "left",
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
  },
  button: {
    width: 150,
    backgroundColor: "#a27b5b",
    borderRadius: 10,
    padding: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
  },
  signupTextWrapper: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  signupText: {
    color: "white",
    fontSize: 25,
    textDecorationLine: "underline"
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
});
