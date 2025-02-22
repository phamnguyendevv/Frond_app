import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  ImageBackground,
  Dimensions,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/CartReducer";

const ProductInfoScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [addedToCart, setAddedToCart] = useState(false);
  const { width } = Dimensions.get("window");
  const height = (width * 100) / 100;
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);

  const addItemToCart = (item) => {
    setAddedToCart(true);
    dispatch(addToCart(item));
    setTimeout(() => {
      setAddedToCart(false);
    }, 60000);
  };

  const handleBuy = (item) => {
    console.log("Buy now");
    if (!item) {
      Alert.alert("Lỗi", "Không có thông tin sản phẩm.");
      return;
    }
    addItemToCart(item);

    // Thực hiện logic mua hàng ở đây
    // Ví dụ: Gọi API, thêm vào giỏ hàng, hiển thị thông báo, v.v.
    Alert.alert(
      "Thành công",
      `Bạn đã thêm sản phẩm: ${item.title} vào giỏ hàng.`,
      [
        {
          text: "OK",
          onPress: () => {
            // Chuyển hướng sang trang giỏ hàng
            navigation.navigate("Main", { screen: "Cart" });
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={{ marginTop: 50, backgroundColor: "#fff" }}
      showsVerticalScrollIndicator={false}
    >
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
          <TextInput placeholder="Tìm kiếm" />
        </Pressable>

        <Feather name="mic" size={24} color="black" />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {route.params.carouselImages.map((item, index) => (
          <ImageBackground
            style={{ width, height, marginTop: 25, resizeMode: "contain" }}
            source={{ uri: item }}
            key={index}
          >
            <View
              style={{
                padding: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#C60C30",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontWeight: "600",
                    fontSize: 12,
                  }}
                >
                  20% off
                </Text>
              </View>

              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#E0E0E0",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <MaterialCommunityIcons
                  name="share-variant"
                  size={24}
                  color="black"
                />
              </View>
            </View>

            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#E0E0E0",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                marginTop: "auto",
                marginLeft: 20,
                marginBottom: 20,
              }}
            >
              <AntDesign name="hearto" size={24} color="black" />
            </View>
          </ImageBackground>
        ))}
      </ScrollView>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 15, fontWeight: "500" }}>
          {route?.params?.title}
        </Text>

        <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 6 }}>
          $99
        </Text>
      </View>

      <Text style={{ height: 1, borderColor: "#D0D0D0", borderWidth: 1 }} />

      <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
        <Text>Color: </Text>
        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
          {route?.params?.color}
        </Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
        <Text>Size: </Text>
        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
          {route?.params?.size}
        </Text>
      </View>

      <Text style={{ height: 1, borderColor: "#D0D0D0", borderWidth: 1 }} />

      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 15, fontWeight: "bold", marginVertical: 5 }}>
          Total : ${route.params.price}
        </Text>
        <Text style={{ color: "#00CED1" }}>
          Miễn Phí vận chuyển cho đơn hàng trên 500k
        </Text>
        <View
          style={{
            flexDirection: "row",
            marginVertical: 5,
            alignItems: "center",
            gap: 5,
          }}
        >
          <Ionicons name="location" size={24} color="black" />

          <Text style={{ fontSize: 15, fontWeight: "500" }}>
            Giao đến Trường Đại học Xây Dựng
          </Text>
        </View>
      </View>

      <Text style={{ color: "green", marginHorizontal: 10, fontWeight: "500" }}>
        Còn Hàng
      </Text>

      <Pressable
        onPress={() => addItemToCart(route?.params?.item)}
        style={{
          backgroundColor: "#FFEEE8",
          padding: 10,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 10,
          marginVertical: 10,
        }}
      >
        {addedToCart ? (
          <View>
            <Text style={{ color: "#F27259" }}>Đã thêm vào giỏ</Text>
          </View>
        ) : (
          <Text style={{ color: "#F27259" }}>Thêm vào giỏ</Text>
        )}
      </Pressable>

      <Pressable
        onPress={() => handleBuy(route?.params?.item)}
        style={{
          backgroundColor: "#EE4D2D",
          padding: 10,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 10,
          marginVertical: 10,
        }}
      >
        <Text style={{ color: "#FFFFFF" }}>Mua ngay</Text>
      </Pressable>
    </ScrollView>
  );
};

export default ProductInfoScreen;

const styles = StyleSheet.create({});
