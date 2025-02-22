import React, { useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { register } from "../api/ApiUser";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [emailVerify, setEmailVerify] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [touched, setTouched] = useState(false);
  const [name, setName] = useState("");
  const [nameVerify, setNameVerify] = useState(false);
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

  const handleName = (value) => {
    setName(value);
    setNameVerify(false);
    if (value.length >= 6) {
      setName(value);
      setNameVerify(true);
    }
  };

  const handleRegister = () => {
    if (emailError) {
      // Nếu còn lỗi mật khẩu, không thực hiện đăng ký
      Alert.alert("Lỗi", "Vui lòng nhập Email hợp lệ trước khi đăng ký.");
      return;
    }
    if (passwordError) {
      // Nếu còn lỗi mật khẩu, không thực hiện đăng ký
      Alert.alert("Lỗi", "Vui lòng nhập mật khẩu hợp lệ trước khi đăng ký.");
      return;
    }
    const user = {
      name: name,
      email: email,
      password: password,
    };
    const response = register(user);
    console.log(response);
    if (response) {
      Alert.alert("Thành công", "Đăng ký thành công");
      navigation.navigate("Login");
    } else {
      Alert.alert("Thất bại", "Đăng ký thất bại");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Image
          style={{ width: 150, height: 175 }}
          source={require("../assets/image/login1.jpg")}
        />
      </View>

      <KeyboardAvoidingView>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 25,
              fontWeight: "bold",
              marginTop: 0,
              marginBottom: 0,
              color: "#041E42",
            }}
          >
            Đăng kí tài khoản
          </Text>
        </View>

        <View style={{ marginTop: 30 }}>
          <View style={styles.inputContainer}>
            <FontAwesome
              name="user"
              size={24}
              color="gray"
              style={{ marginLeft: 8 }}
            />
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              style={styles.input}
              placeholder="Nhập tên"
            />
          </View>

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
            >
              <Entypo
                name={showPassword ? "eye" : "eye-with-line"}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>
          {passwordError && (
            <Text style={{ color: "red", marginTop: 5 }}>{passwordError}</Text>
          )}
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
            style={styles.forgotPasswordText}
            onPress={() => navigation.navigate("Forget")}
          >
            Quên mật khẩu
          </Text>
        </View>

        <View style={{ marginTop: 80 }} />

        <Pressable onPress={handleRegister} style={styles.registerButton}>
          <Text style={styles.registerButtonText}>Đăng kí</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.goBack()}
          style={{ marginTop: 15 }}
        >
          <Text style={styles.signInText}>Bạn đã có tài khoản? Đăng nhập</Text>
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#D0D0D0",
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 30,
  },
  input: {
    color: "gray",
    marginVertical: 10,
    width: 300,
    fontSize: 16,
  },
  forgotPasswordText: {
    color: "#007FFF",
    fontWeight: "500",
  },
  registerButton: {
    width: 200,
    backgroundColor: "#FEBE10",
    borderRadius: 6,
    marginLeft: "auto",
    marginRight: "auto",
    padding: 15,
  },
  registerButtonText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  signInText: {
    textAlign: "center",
    color: "gray",
    fontSize: 16,
  },
});

export default RegisterScreen;
