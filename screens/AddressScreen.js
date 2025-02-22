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
import { Feather, AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { API_BASE_URL } from "../constants/config";

const AddressScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [addresses, setAddresses] = useState([]);
  const [user, setUser] = useState(null);
  const fetchAddresses = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        if (parsedUser?._id) {
          updateAddress(parsedUser._id);
        }
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const updateAddress = async (userId) => {
    if (!userId) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/address/${userId}`);
      setAddresses(response.data.result);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (user?._id) {
      updateAddress(user._id);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      if (user?._id) {
        updateAddress(user._id);
      }
    }, [user?._id])
  );
  const handleRemovePress = async (item) => {
    const confirmDelete = () =>
      new Promise((resolve) => {
        Alert.alert(
          "Xác nhận xóa",
          "Bạn có chắc chắn muốn xóa địa chỉ này?",
          [
            { text: "Hủy", style: "cancel", onPress: () => resolve(false) },
            { text: "Xóa", onPress: () => resolve(true) },
          ],
          { cancelable: false }
        );
      });

    const shouldDelete = await confirmDelete();
    if (!shouldDelete) return;

    try {
      const userId = user._id;
      console.log("Removing address for user:", userId);
      const addressId = item._id;

      const response = await axios.delete(`${API_BASE_URL}/address`, {
        data: { userId, addressId },
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        Alert.alert("Xóa thành công", "Địa chỉ đã được xóa thành công");

        fetchAddresses();
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      console.error(
        "Error removing address:",
        error.response?.data || error.message
      );
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi xóa địa chỉ. Vui lòng thử lại.");
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 50 }}>
      <View
        style={{
          backgroundColor: "#F6412E",
          padding: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 7,
            gap: 10,
            backgroundColor: "white",
            borderRadius: 3,
            height: 38,
            flex: 1,
          }}
        >
          <AntDesign
            style={{ paddingLeft: 10 }}
            name="search1"
            size={22}
            color="black"
          />
          <TextInput placeholder="Tìm Kiếm" />
        </Pressable>

        <Feather name="mic" size={24} color="black" />
      </View>

      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Địa chỉ của bạn
        </Text>

        <Pressable
          onPress={() => navigation.navigate("Add")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 10,
            borderColor: "#D0D0D0",
            borderWidth: 1,
            borderLeftWidth: 0,
            borderRightWidth: 0,
            paddingVertical: 7,
            paddingHorizontal: 5,
          }}
        >
          <Text>Thêm địa chỉ mới</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
        </Pressable>

        <Pressable>
          {/* all the added adresses */}
          {addresses?.map((item, index) => (
            <Pressable
              style={{
                borderWidth: 1,
                borderColor: "#D0D0D0",
                padding: 10,
                flexDirection: "column",
                gap: 5,
                marginVertical: 10,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
              >
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  Tên người nhận: {item?.name}
                </Text>
                <Entypo name="location-pin" size={24} color="red" />
              </View>

              <Text style={{ fontSize: 15, color: "#181818" }}>
                Số điện thoại: {item?.number}
              </Text>

              <Text style={{ fontSize: 15, color: "#181818" }}>
                Tên đường: {item?.street}
              </Text>

              <Text style={{ fontSize: 15, color: "#181818" }}>
                Thành Phố: {item?.city}
              </Text>
              <Text style={{ fontSize: 15, color: "#181818" }}>
                Quốc Gia: {item?.country}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 7,
                }}
              >
                <Pressable
                  onPress={() => navigation.navigate("UpdateAddress", { item })}
                  style={{
                    backgroundColor: "#F5F5F5",
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 5,
                    borderWidth: 0.9,
                    borderColor: "#D0D0D0",
                  }}
                >
                  <Text>Sửa</Text>
                </Pressable>

                <Pressable
                  onPress={() => handleRemovePress(item)}
                  style={{
                    backgroundColor: "#F5F5F5",
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 5,
                    borderWidth: 0.9,
                    borderColor: "#D0D0D0",
                  }}
                >
                  <Text>Xóa</Text>
                </Pressable>

                <Pressable
                  style={{
                    backgroundColor: "#F5F5F5",
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 5,
                    borderWidth: 0.9,
                    borderColor: "#D0D0D0",
                  }}
                >
                  <Text>Để mặc định</Text>
                </Pressable>
              </View>
            </Pressable>
          ))}
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default AddressScreen;

const styles = StyleSheet.create({});
