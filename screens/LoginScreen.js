import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Alert,
  TouchableOpacity,
} from "react-native";

import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { login } from "../api/ApiUser";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [touched, setTouched] = useState(false);
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailChange = (text) => {
    setEmail(text);
    // Người dùng đã bắt đầu nhập
    setTouched(true);
    const errors = validateEmail(text);
    setEmailError(errors.length > 0 ? errors[0] : null);
  };

  const validateEmail = (email) => {
    const errors = [];
    // Kiểm tra định dạng email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("Email không hợp lệ");
    }
    return errors;
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    setTouched(true); // Người dùng đã bắt đầu nhập
    const errors = validatePassword(text);
    setPasswordError(errors.length > 0 ? errors[0] : null);
  };

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const validatePassword = (password) => {
    const errors = [];
    // Kiểm tra độ dài của mật khẩu
    if (password.length < 8) {
      errors.push("Mật khẩu phải có ít nhất 8 ký tự");
    }
    // Kiểm tra có ít nhất một số
    if (!/\d/.test(password)) {
      errors.push("Mật khẩu phải chứa ít nhất một số");
    }
    // Kiểm tra có ít nhất một chữ cái viết hoa và một chữ cái viết thường
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
      errors.push(
        `Mật khẩu phải chứa ít nhất một chữ cái viết hoa 
và một chữ cái viết thường`
      );
    }
    // Kiểm tra có ít nhất một ký tự đặc biệt
    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push("Mật khẩu phải chứa ít nhất một ký tự đặc biệt");
    }
    return errors;
  };

  const handleLogin = async () => {
    if (emailError) {
      Alert.alert("Lỗi", "Vui lòng nhập Email hợp lệ trước khi đăng nhập.");
      return;
    }
    if (passwordError) {
      Alert.alert("Lỗi", "Vui lòng nhập mật khẩu hợp lệ trước khi đăng nhập.");
      return;
    }

    const user = {
      email: email,
      password: password,
    };

    try {
      const response = await login(user); // Đợi phản hồi từ API
      console.log("response", response.data.result.user);

      if (response.data.result.user) {
        // Lưu thông tin user vào AsyncStorage
        await AsyncStorage.setItem(
          "user",
          JSON.stringify(response.data.result.user)
        );

        // Chuyển hướng sang màn hình Home
        navigation.navigate("Main");
      } else {
        Alert.alert(
          "Lỗi",
          "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
        );
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi trong quá trình đăng nhập.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Image
          style={styles.image}
          source={require("../assets/image/login1.jpg")}
        />
      </View>

      <KeyboardAvoidingView>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.loginText}>Đăng nhập tài khoản</Text>
        </View>

        <View style={{ marginTop: 70 }}>
          <View>
            <View style={styles.inputContainer}>
              <MaterialIcons
                name="email"
                size={24}
                color="gray"
                style={{ marginLeft: 8 }}
              />
              <TextInput
                value={email}
                onChangeText={handleEmailChange}
                style={styles.input}
                placeholder="Nhập Email"
              />
            </View>
            {emailError && (
              <Text style={{ color: "red", marginTop: 5 }}>{emailError}</Text>
            )}
          </View>
        </View>

        <View style={{ marginTop: 0 }}>
          <View>
            <View style={styles.inputContainer}>
              <Entypo
                name="key"
                size={24}
                color="gray"
                style={{ marginLeft: 8 }}
              />
              <TextInput
                onChangeText={handlePasswordChange}
                secureTextEntry={!showPassword}
                style={styles.input}
                placeholder="Nhập Password"
              />
              <TouchableOpacity
                onPress={toggleShowPassword}
                style={{ right: 0, marginRight: 10 }}
              ></TouchableOpacity>
            </View>
            {passwordError && (
              <Text style={{ color: "red", marginTop: 5 }}>
                {passwordError}
              </Text>
            )}
          </View>
        </View>

        <View
          style={{
            marginTop: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text>Chúc bạn một ngày tốt lành</Text>

          <Text
            style={styles.forgotPassword}
            onPress={() => navigation.navigate("Forget")}
          >
            Quên mật khẩu
          </Text>
        </View>

        <View style={{ marginTop: 80 }} />

        <Pressable onPress={handleLogin} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Đăng nhập</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("Register")}
          style={{ marginTop: 15 }}
        >
          <Text style={styles.signUpText}>Bạn chưa có tài khoản? Đăng kí</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    marginTop: 50,
  },
  image: {
    width: 150,
    height: 175,
  },
  loginText: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 0,
    color: "#041E42",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#D0D0D0",
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 30,
  },
  icon: {
    marginLeft: 8,
  },
  input: {
    color: "gray",
    marginVertical: 10,
    width: 300,
    fontSize: 16,
    marginLeft: 5,
  },
  forgotPassword: {
    color: "#007FFF",
    fontWeight: "500",
  },
  loginButton: {
    width: 200,
    backgroundColor: "#FEBE10",
    borderRadius: 6,
    marginLeft: "auto",
    marginRight: "auto",
    padding: 15,
  },
  loginButtonText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  signUpText: {
    textAlign: "center",
    color: "gray",
    fontSize: 16,
  },
});

export default LoginScreen;
