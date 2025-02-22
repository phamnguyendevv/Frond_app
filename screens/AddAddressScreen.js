import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import React, { useEffect, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_BASE_URL } from "../constants/config";

const AddAddressScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [country, seCountry] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const users = await AsyncStorage.getItem("user");
        setUser(users);
        const user = JSON.parse(users);
        setUser(user);
      } catch (error) {
        console.log("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  const handleAddAddress = async () => {
    const address = {
      name,
      number,
      street,
      city,
      country,
    };
    const userId = user._id;
    try {
      console.log("Adding address for user:", userId, address);
      // Giả sử fetchUserAddAddress là URL endpoint
      const response = await axios.post(`${API_BASE_URL}/address`, {
        userId,
        address,
      });

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Thành công", "Đã thêm địa chỉ mới");
        setTimeout(() => {
          navigation.goBack();
        }, 500);
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Đã có lỗi xảy ra khi thêm địa chỉ");
      console.error(
        "API Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <ScrollView style={{ marginTop: 50 }}>
      <View style={{ height: 50, backgroundColor: "#FFEEE8" }} />

      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 17, fontWeight: "bold" }}>
          Thêm địa chỉ mới
        </Text>

        <TextInput
          placeholderTextColor={"black"}
          placeholder="Nhập tên địa chỉ"
          style={{
            padding: 10,
            borderColor: "#D0D0D0",
            borderWidth: 1,
            marginTop: 10,
            borderRadius: 5,
          }}
        />

        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Nhập tên của bạn
          </Text>

          <TextInput
            value={name}
            onChangeText={(text) => setName(text)}
            placeholderTextColor={"black"}
            style={{
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
            }}
            placeholder="Nhập tên"
          />
        </View>

        <View>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Nhập số điện thoại
          </Text>

          <TextInput
            value={number}
            onChangeText={(text) => setNumber(text)}
            placeholderTextColor={"black"}
            style={{
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
            }}
            placeholder="Nhâp số điện thoại "
          />
        </View>

        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Nhập số nhà, tên đường
          </Text>

          <TextInput
            value={street}
            onChangeText={(text) => setStreet(text)}
            placeholderTextColor={"black"}
            style={{
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
            }}
            placeholder="Nhâp số nhà, tên đường "
          />
        </View>

        <View>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Nhập tên thành phố
          </Text>
          <TextInput
            value={city}
            onChangeText={(text) => setCity(text)}
            placeholderTextColor={"black"}
            style={{
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
            }}
            placeholder="Nhập tên thành phố "
          />
        </View>

        <View>
          <Text style={{ fontSize: 15, fontWeight: "bold", marginTop: 10 }}>
            Country
          </Text>

          <TextInput
            value={country}
            onChangeText={(text) => seCountry(text)}
            placeholderTextColor={"black"}
            style={{
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
            }}
            placeholder="Nhập tên quốc gia "
          />
        </View>

        <Pressable
          onPress={handleAddAddress}
          style={{
            backgroundColor: "#EE4D2D",
            padding: 19,
            borderRadius: 6,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 17 }}>Thêm địa chỉ</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default AddAddressScreen;

const styles = StyleSheet.create({});
