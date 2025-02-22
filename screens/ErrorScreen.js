import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";

const ErrorScreen = ({ route }) => {
  const navigation = useNavigation();
  const { message } = route.params; // Lấy thông báo lỗi từ route.params

  // Hàm xử lý khi nhấn nút "Thử lại"
  const handleRetry = () => {
    navigation.replace("Cart"); // Điều hướng đến màn hình thanh toán lại
  };

  // Hàm xử lý khi nhấn nút "Quay lại"
  const handleGoBack = () => {
    navigation.replace("Main"); // Quay lại màn hình trước đó
  };

  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <LottieView
        source={require("../assets/error-animation.json")} // Thay bằng file Lottie của bạn
        style={{
          height: 260,
          width: 300,
          alignSelf: "center",
          marginTop: 40,
          justifyContent: "center",
        }}
        autoPlay
        loop={false}
        speed={0.7}
      />
      <Text
        style={{
          marginTop: 20,
          fontSize: 19,
          fontWeight: "600",
          textAlign: "center",
          color: "red", // Màu đỏ để nhấn mạnh lỗi
        }}
      >
        {message || "Đã xảy ra lỗi, vui lòng thử lại sau!"}
      </Text>

      {/* Nút "Thử lại" */}
      <TouchableOpacity style={styles.button} onPress={handleRetry}>
        <Text style={styles.buttonText}>Thử lại</Text>
      </TouchableOpacity>

      {/* Nút "Quay lại" */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#ccc" }]}
        onPress={handleGoBack}
      >
        <Text style={styles.buttonText}>Quay lại</Text>
      </TouchableOpacity>

      <LottieView
        source={require("../assets/sparkle.json")} // Hiệu ứng phụ (nếu có)
        style={{
          height: 300,
          position: "absolute",
          top: 100,
          width: 300,
          alignSelf: "center",
        }}
        autoPlay
        loop={false}
        speed={0.7}
      />
    </SafeAreaView>
  );
};

export default ErrorScreen;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
