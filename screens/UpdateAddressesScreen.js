import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import React, { useEffect, useContext, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_BASE_URL } from "../constants/config";

const UpdateAddressesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [country, seCountry] = useState("");
  const [user, setUser] = useState();
  const { item } = route.params;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        const userss = JSON.parse(user);
        setUser(userss);
      } catch (error) {
        console.log("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);
  const addressId = item._id;
  const handleUpdateAddAddress = async (item) => {
    const address = {
      user_id: user._id,
      address_id: addressId,
      addressData: {
        name: name,
        number: number,
        street: street,
        city: city,
        country: country,
      },
    };

    console.log(address);
    try {
      const response = await axios.put(`${API_BASE_URL}/address`, address);

      if (response.status === 200) {
        Alert.alert(
          "Cập nhật thành công",
          "Địa chỉ đã được cập nhật thành công"
        );
        setTimeout(() => {
          navigation.goBack();
        }, 1000);
      } else {
        Alert.alert("Lỗi", "Đã xảy ra lỗi khi cập nhật địa chỉ");
      }
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Error removing data:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi cập nhật địa chỉ");
    }
  };

  return (
    <ScrollView style={{ marginTop: 50 }}>
      <View style={{ height: 50, backgroundColor: "#FFEEE8" }} />

      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 17, fontWeight: "bold" }}>
          Thay đổi địa chỉ
        </Text>

        <TextInput
          placeholderTextColor={"black"}
          placeholder="Nhập tên địa chỉ của bạn"
          style={{
            padding: 10,
            borderColor: "#D0D0D0",
            borderWidth: 1,
            marginTop: 10,
            borderRadius: 5,
          }}
        />

        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>Nhập tên</Text>

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
            placeholder={item.name || "Nhập tên"}
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
            placeholder={item.number || "Nhập số điện thoại"}
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
            placeholder={item.street || "Nhập số nhà, tên đường"}
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
            placeholder={item.city || "Nhập tên thành phố"}
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
            placeholder={item.country || "Nhập tên quốc gia"}
          />
        </View>

        <Pressable
          onPress={handleUpdateAddAddress}
          style={{
            backgroundColor: "#EE4D2D",
            padding: 19,
            borderRadius: 6,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 17 }}>Thay đổi</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default UpdateAddressesScreen;

const styles = StyleSheet.create({});
