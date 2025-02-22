import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Alert,
  Image,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { cleanCart } from "../redux/CartReducer";
import { useNavigation } from "@react-navigation/native";
import RazorpayCheckout from "react-native-razorpay";
import { API_BASE_URL } from "../constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ConfirmationScreen = () => {
  const steps = [
    { title: "Địa Chỉ", content: "Address Form" },
    { title: "Giao Hàng", content: "Delivery Options" },
    { title: "Thanh Toán", content: "Payment Details" },
    { title: "Xác Nhận", content: "Order Confirmation" },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [userId, setUserId] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [option, setOption] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const cart = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();

  // Tính tổng giá trị giỏ hàng
  const total = cart?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Lấy thông tin người dùng từ AsyncStorage
  const fetchUser = async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      const userJson = JSON.parse(user);
      setUserId(userJson._id);
    } catch (error) {
      console.log("error", error);
      setError("Failed to fetch user data");
    }
  };

  // Lấy danh sách địa chỉ từ API
  const fetchAddresses = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/address/${userId}`);
      setAddresses(response.data.result);
    } catch (error) {
      console.log("error", error);
      setError("Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  };

  // Gọi fetchUser khi component được mount
  useEffect(() => {
    fetchUser();
  }, []);

  // Gọi fetchAddresses khi userId thay đổi
  useEffect(() => {
    if (userId) {
      fetchAddresses();
    }
  }, [userId]);

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        userId: userId,
        cartItems: cart,
        totalPrice: total,
        shippingAddress: selectedAddress,
        paymentMethod: selectedOption,
      };

      const url = `${API_BASE_URL}/orders`;

      const response = await axios.post(url, orderData);

      if (response.status === 200) {
        navigation.navigate("Order");
        dispatch(cleanCart());
        console.log("order created successfully", response.data);
      } else {
        console.log("error creating order", response.data);
      }
    } catch (error) {
      console.log("errror", error);
    }
  };
  const pay = async () => {
    try {
      const orderData = {
        userId: userId,
        cartItems: cart,
        totalPrice: total,
        shippingAddress: selectedAddress,
        paymentMethod: selectedOption,
      };
      navigation.navigate("Paypal", { orderData });
    } catch (error) {
      console.log("error", error);
    }
  };

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
        throw new Error("Unexeepected response status");
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
    <ScrollView style={{ marginTop: 55 }}>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 40 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
            justifyContent: "space-between",
          }}
        >
          {steps?.map((step, index) => (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              {index > 0 && (
                <View
                  style={[
                    { flex: 1, height: 2, backgroundColor: "green" },
                    index <= currentStep && { backgroundColor: "green" },
                  ]}
                />
              )}
              <View
                style={[
                  {
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: "#ccc",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                  index < currentStep && { backgroundColor: "green" },
                ]}
              >
                {index < currentStep ? (
                  <Text
                    style={{ fontSize: 16, fontWeight: "bold", color: "white" }}
                  >
                    &#10003;
                  </Text>
                ) : (
                  <Text
                    style={{ fontSize: 16, fontWeight: "bold", color: "white" }}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>
              <Text style={{ textAlign: "center", marginTop: 8 }}>
                {step.title}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {currentStep == 0 && (
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Chọn địa chỉ giao hàng
          </Text>

          <Pressable>
            {addresses?.map((item, index) => (
              <Pressable
                style={{
                  borderWidth: 1,
                  borderColor: "#D0D0D0",
                  padding: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  paddingBottom: 17,
                  marginVertical: 7,
                  borderRadius: 6,
                }}
              >
                {selectedAddress && selectedAddress._id === item?._id ? (
                  <FontAwesome5 name="dot-circle" size={20} color="#008397" />
                ) : (
                  <Entypo
                    onPress={() => setSelectedAddress(item)}
                    name="circle"
                    size={20}
                    color="gray"
                  />
                )}

                <View style={{ marginLeft: 6 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                      Tên địa chỉ: {item?.name}
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
                    Tên thành phố: {item?.city}
                  </Text>

                  <Text style={{ fontSize: 15, color: "#181818" }}>
                    Tên quốc gia : {item?.country}
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
                      onPress={() =>
                        navigation.navigate("UpdateAddress", { item })
                      }
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

                  <View>
                    {selectedAddress && selectedAddress._id === item?._id && (
                      <Pressable
                        onPress={() => setCurrentStep(1)}
                        style={{
                          backgroundColor: "#F27259",
                          padding: 10,
                          borderRadius: 20,
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 10,
                        }}
                      >
                        <Text style={{ textAlign: "center", color: "white" }}>
                          Tiếp tục
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              </Pressable>
            ))}
          </Pressable>
        </View>
      )}

      {currentStep == 1 && (
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Chọn phương thức giao hàng
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "white",
              padding: 8,
              gap: 7,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
            }}
          >
            {option ? (
              <FontAwesome5 name="dot-circle" size={20} color="#008397" />
            ) : (
              <Entypo
                onPress={() => setOption(!option)}
                name="circle"
                size={20}
                color="gray"
              />
            )}

            <Text style={{ flex: 1 }}>
              <Text style={{ color: "green", fontWeight: "500" }}>
                Giao hàng nhanh{" "}
              </Text>{" "}
              2 đến 3 ngày
            </Text>
          </View>

          <Pressable
            onPress={() => setCurrentStep(2)}
            style={{
              backgroundColor: "#F27259",
              padding: 10,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 15,
            }}
          >
            <Text>Tiếp tục</Text>
          </Pressable>
        </View>
      )}

      {currentStep == 2 && (
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Chọn phương thức thanh toán
          </Text>

          <View
            style={{
              backgroundColor: "white",
              padding: 8,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 7,
              marginTop: 12,
            }}
          >
            {selectedOption === "cash" ? (
              <FontAwesome5 name="dot-circle" size={20} color="#008397" />
            ) : (
              <Entypo
                onPress={() => setSelectedOption("cash")}
                name="circle"
                size={20}
                color="gray"
              />
            )}

            <Text>Trả khi nhận hàng</Text>
          </View>

          <View
            style={{
              backgroundColor: "white",
              padding: 8,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 7,
              marginTop: 12,
            }}
          >
            {selectedOption === "card" ? (
              <FontAwesome5 name="dot-circle" size={20} color="#008397" />
            ) : (
              <Entypo
                onPress={() => {
                  setSelectedOption("card");
                }}
                name="circle"
                size={20}
                color="gray"
              />
            )}

            <Text>Thanh toán qua paypal</Text>
          </View>
          <Pressable
            onPress={() => setCurrentStep(3)}
            style={{
              backgroundColor: "#F27259",
              padding: 10,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 15,
            }}
          >
            <Text>Tiếp tục</Text>
          </Pressable>
        </View>
      )}

      {currentStep === 3 && selectedOption === "cash" && (
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}> Đặt hàng </Text>
          <View style={{ marginHorizontal: 10 }}>
            {cart?.map((item, index) => (
              <View
                style={{
                  backgroundColor: "white",
                  marginVertical: 10,
                  borderBottomColor: "#F0F0F0",
                  borderWidth: 2,
                  borderLeftWidth: 0,
                  borderTopWidth: 0,
                  borderRightWidth: 0,
                }}
                key={index}
              >
                <Pressable
                  style={{
                    marginVertical: 10,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <Image
                      style={{ width: 140, height: 140, resizeMode: "contain" }}
                      source={{ uri: item?.image }}
                    />
                  </View>

                  <View>
                    <Text
                      numberOfLines={3}
                      style={{ width: 150, marginTop: 10 }}
                    >
                      {item?.title}
                    </Text>
                    <Text
                      style={{ fontSize: 20, fontWeight: "bold", marginTop: 6 }}
                    >
                      {item?.price}
                    </Text>
                    <Image
                      style={{ width: 30, height: 30, resizeMode: "contain" }}
                      source={{
                        uri: "https://assets.stickpng.com/thumbs/5f4924cc68ecc70004ae7065.png",
                      }}
                    />
                    <Text style={{ color: "green" }}>
                      Số lượng: {item?.quantity}
                    </Text>
                  </View>
                </Pressable>

                <Pressable
                  style={{
                    marginTop: 15,
                    marginBottom: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                ></Pressable>
              </View>
            ))}
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              backgroundColor: "white",
              padding: 8,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
            }}
          >
            <View>
              <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                Giảm giá 10% cho đơn hàng tiếp theo
              </Text>
              <Text style={{ fontSize: 15, color: "gray", marginTop: 5 }}>
                Đơn hàng của bạn sẽ được giao trong vòng 2-3 ngày
              </Text>
            </View>

            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="black"
            />
          </View>

          <View
            style={{
              backgroundColor: "white",
              padding: 8,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
            }}
          >
            <Text>Giao đến: {selectedAddress?.name}</Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "500", color: "gray" }}>
                Tổng tiền
              </Text>

              <Text style={{ color: "gray", fontSize: 16 }}>{total} $</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "500", color: "gray" }}>
                Phí giao hàng
              </Text>

              <Text style={{ color: "gray", fontSize: 16 }}>0 $</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                Tổng tiền thanh toán
              </Text>

              <Text
                style={{ color: "#C60C30", fontSize: 17, fontWeight: "bold" }}
              >
                {total} $
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: "white",
              padding: 8,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 16, color: "gray" }}>
              {" "}
              Phương thức thanh toán
            </Text>

            <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 7 }}>
              Trả khi nhận hàng
            </Text>
          </View>

          <Pressable
            onPress={handlePlaceOrder}
            style={{
              backgroundColor: "#F27259",
              padding: 10,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <Text> Đặt hàng </Text>
          </Pressable>
        </View>
      )}
      {currentStep === 3 && selectedOption === "card" && (
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Đặt hàng </Text>
          <View style={{ marginHorizontal: 10 }}>
            {cart?.map((item, index) => (
              <View
                style={{
                  backgroundColor: "white",
                  marginVertical: 10,
                  borderBottomColor: "#F0F0F0",
                  borderWidth: 2,
                  borderLeftWidth: 0,
                  borderTopWidth: 0,
                  borderRightWidth: 0,
                }}
                key={index}
              >
                <Pressable
                  style={{
                    marginVertical: 10,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <Image
                      style={{ width: 140, height: 140, resizeMode: "contain" }}
                      source={{ uri: item?.image }}
                    />
                  </View>

                  <View>
                    <Text
                      numberOfLines={3}
                      style={{ width: 150, marginTop: 10 }}
                    >
                      {item?.title}
                    </Text>
                    <Text
                      style={{ fontSize: 20, fontWeight: "bold", marginTop: 6 }}
                    >
                      {item?.price}
                    </Text>
                    <Image
                      style={{ width: 30, height: 30, resizeMode: "contain" }}
                      source={{
                        uri: "https://assets.stickpng.com/thumbs/5f4924cc68ecc70004ae7065.png",
                      }}
                    />
                    <Text style={{ color: "green" }}>
                      Số lượng: {item?.quantity}
                    </Text>
                  </View>
                </Pressable>

                <Pressable
                  style={{
                    marginTop: 15,
                    marginBottom: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                ></Pressable>
              </View>
            ))}
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              backgroundColor: "white",
              padding: 8,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
            }}
          >
            <View>
              <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                Giảm giá 10% cho đơn hàng tiếp theo
              </Text>
              <Text style={{ fontSize: 15, color: "gray", marginTop: 5 }}>
                Đơn hàng của bạn sẽ được giao trong vòng 2-3 ngày
              </Text>
            </View>

            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="black"
            />
          </View>

          <View
            style={{
              backgroundColor: "white",
              padding: 8,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
            }}
          >
            <Text>Giao đến: {selectedAddress?.name}</Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "500", color: "gray" }}>
                Tổng tiền
              </Text>

              <Text style={{ color: "gray", fontSize: 16 }}>{total} $</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "500", color: "gray" }}>
                Phí giao hàng
              </Text>

              <Text style={{ color: "gray", fontSize: 16 }}>0 $</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                Tổng tiền thanh toán
              </Text>

              <Text
                style={{ color: "#C60C30", fontSize: 17, fontWeight: "bold" }}
              >
                {total} $
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: "white",
              padding: 8,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 16, color: "gray" }}>
              {" "}
              Phương thức thanh toán
            </Text>

            <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 7 }}>
              Thanh toán qua paypal
            </Text>
          </View>

          <Pressable
            onPress={pay}
            style={{
              backgroundColor: "#F27259",
              padding: 10,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <Text> Thanh toán bằng Paypal </Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
};

export default ConfirmationScreen;

const styles = StyleSheet.create({});
