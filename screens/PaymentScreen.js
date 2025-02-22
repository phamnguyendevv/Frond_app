import React, { useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  View,
  Dimensions,
  Image,
  Linking,
  StyleSheet,
} from "react-native";
import { WebView } from "react-native-webview";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_BASE_URL } from "../constants/config";
import { useDispatch } from "react-redux";
import { cleanCart } from "../redux/CartReducer"; 

const { width, height } = Dimensions.get("screen");

export default function PaymentScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { orderData } = route.params;

  const handleDeepLink = useCallback(
    (event) => {
      const url = event.url;
      if (url.includes("success")) {
        navigation.navigate("Order");
      } else if (url.includes("cancel")) {
        navigation.navigate("Error", { message: "Lỗi thanh toán" });
      }
    },
    [navigation]
  );

  useEffect(() => {
    const subscription = Linking.addEventListener("url", handleDeepLink);
    return () => subscription.remove();
  }, [handleDeepLink]);

  const handleStateChange = useCallback(
    async (navState) => {
      const { url } = navState;
      const orderID = new URL(url).searchParams.get("token");

      if (url.includes("success") && orderID) {
        try {
          await axios.post(`${API_BASE_URL}/orders`, orderData);
          navigation.navigate("Order");

          dispatch(cleanCart());
        } catch (error) {
          navigation.navigate("Error", {
            message: "Payment failed. Please try again!",
          });
        }
      } else if (
        url.includes("cancel") ||
        url.includes("paypal.com/checkoutnow/error")
      ) {
        navigation.navigate("Error", {
          message: url.includes("cancel")
            ? "Payment cancelled"
            : "Payment failed",
        });
      }
    },
    [orderData, navigation, dispatch]
  );

  return (
    <View style={styles.container}>
      <WebView
        startInLoadingState
        onNavigationStateChange={handleStateChange}
        renderLoading={() => <Loading />}
        source={{ uri: `${API_BASE_URL}/pay/${orderData.totalPrice}` }}
      />
    </View>
  );
}

const Loading = () => (
  <View style={styles.loadingContainer}>
    <Image
      source={require("../assets/image/logo-paypa.png")}
      style={styles.logo}
    />
    <ActivityIndicator size="large" color="#0000ff" style={styles.indicator} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    flex: 1,
  },
  loadingContainer: {
    height,
    width,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 250,
    height: 100,
    resizeMode: "contain",
  },
  indicator: {
    marginTop: 20,
  },
});
