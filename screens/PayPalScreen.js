import React, { useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  SafeAreaView,
} from "react-native";

import { useRoute } from "@react-navigation/native";


export default function PaypalScreen({ navigation }) {
  const route = useRoute();
  const total = route.params.orderData.totalPrice;
  const [amount, setAmount] = React.useState("");
  const [isFocused, setIsFocused] = React.useState(false);

  
  const handlePayment = () => {
    const orderData = route.params.orderData;
    if (amount !== "") {
      navigation.navigate("Payment", { orderData});
    }
  };

  useEffect(() => {
    if (total) {
      setAmount(total.toString());
    }
  }, [total]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("../assets/image/logo-paypa.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Thanh toán bằng PayPal</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.currencySymbol}>₫</Text>
          <TextInput
            placeholder="Nhập số tiền "
            placeholderTextColor="#999"
            style={[styles.input, isFocused && styles.inputFocused]}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            amount ? styles.buttonActive : styles.buttonInactive,
          ]}
          onPress={handlePayment}
          disabled={!amount}
        >
          <Text style={styles.buttonText}>Xác Nhận</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 500,
    height: 200,
    resizeMode: "contain",
    marginBottom: 30,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 30,
    color: "#003087",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currencySymbol: {
    paddingLeft: 15,
    fontSize: 18,
    color: "#666",
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 18,
    color: "#333",
    backgroundColor: "transparent",
  },
  inputFocused: {
    borderColor: "#0070ba",
  },
  button: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonActive: {
    backgroundColor: "#0070ba",
  },
  buttonInactive: {
    backgroundColor: "#96c2e6",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
