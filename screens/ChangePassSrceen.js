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
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch } from "react-redux";

const ChangePassScreen = () => {
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const { email } = route.params;

  const handleNewPasswordChange = (text) => {
    setNewPassword(text);
    const errors = validatePassword(text);
    setPasswordError(errors.length > 0 ? errors[0] : null);
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Mật khẩu phải có ít nhất 8 ký tự");
    }
    if (!/\d/.test(password)) {
      errors.push("Mật khẩu phải chứa ít nhất một số");
    }
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
      errors.push(
        `Mật khẩu phải chứa ít nhất một chữ cái viết hoa 
và một chữ cái viết thường`
      );
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push("Mật khẩu phải chứa ít nhất một ký tự đặc biệt");
    }
    return errors;
  };

  const handleChangePassword = async () => {
    if (passwordError) {
      Alert.alert("Lỗi", "Vui lòng nhập mật khẩu hợp lệ trước khi đăng nhập.");
      return;
    }
    const user = {
      code: code,
      email: email,
      newPassword: newPassword,
    };
    const response = await axios.post(`${API_BASE_URL}/change-password`, user);
    console.log(response.data.result);
    if (response.status === 200) {
      Alert.alert("Thành công", "Đổi mật khẩu thành công.");
      navigation.navigate("Login");
    } else {
      Alert.alert("Lỗi", "Mã xác nhận không đúng.");
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
          <Text style={styles.loginText}>Đổi mật khẩu</Text>
        </View>

        <View style={{ marginTop: 50 }}>
          <View style={styles.inputContainer}>
            <TextInput
              value={code}
              onChangeText={setCode}
              style={styles.input}
              placeholder="Nhập code"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              value={newPassword}
              onChangeText={handleNewPasswordChange}
              style={styles.input}
              placeholder="Nhập mật khẩu mới"
              secureTextEntry={true}
            />
          </View>
          {passwordError && (
            <Text style={{ color: "red", marginTop: 5 }}>{passwordError}</Text>
          )}
        </View>

        <Pressable
          onPress={() => navigation.navigate("Login")}
          style={{ marginTop: 15 }}
        >
          <Text>Q</Text>
        </Pressable>
        <View style={{ marginTop: 80 }} />

        <Pressable onPress={handleChangePassword} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Gửi mã</Text>
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

export default ChangePassScreen;
