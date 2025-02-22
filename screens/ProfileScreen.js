import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useLayoutEffect, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../constants/config";

const ProfileScreen = () => {
  const users = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [user, setUser] = useState();

  // Cấu hình header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerStyle: {
        backgroundColor: "#F6412E",
      },
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            marginRight: 12,
          }}
        >
          <Ionicons name="notifications-outline" size={24} color="black" />
          <AntDesign name="search1" size={24} color="black" />
        </View>
      ),
    });
  }, []);

  // Lấy thông tin người dùng từ AsyncStorage
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const ExitsUser = await AsyncStorage.getItem("user");
        const user = JSON.parse(ExitsUser);
        console.log("user", user);
        setUser(user);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchUserProfile();
  }, []);

  // Đăng xuất
  const handleLogout = () => {
    navigation.replace("Login");
  };

  // Lấy danh sách đơn hàng
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?._id) return; // Đảm bảo user._id tồn tại
      try {
        const response = await axios.get(`${API_BASE_URL}/orders/${user._id}`);
        console.log("Orders", response.data.result);
        setOrders(response.data.result);
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Render mỗi đơn hàng
  const renderOrderItem = ({ item: order }) => (
    <Pressable
      style={styles.orderContainer}
      key={order._id}
      onPress={() => {
        // Xử lý khi nhấn vào đơn hàng (nếu cần)
        console.log("Order pressed:", order._id);
      }}
    >
      {/* Hiển thị hình ảnh sản phẩm đầu tiên trong đơn hàng */}
      {order.products.slice(0, 1)?.map((product) => (
        <View style={styles.productImageContainer} key={product._id}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
          <Text style={styles.orderId}>Tên sản phẩm: {product.name}</Text>
          <Text style={styles.orderTotal}>Giá : ${product.price}</Text>
        </View>
      ))}
    </Pressable>
  );

  // Render footer khi loading
  const renderFooter = () => {
    if (loading) {
      return <ActivityIndicator size="small" color="#0000ff" />;
    }
    return null;
  };

  // Render khi không có đơn hàng
  const renderEmptyComponent = () => (
    <View style={styles.centered}>
      <Text> Không thấy đơn hàng cũ nào </Text>
    </View>
  );

  return (
    <ScrollView style={{ padding: 10, flex: 1, backgroundColor: "white" }}>
      <Text style={{ fontSize: 16, fontWeight: "bold" }}>
        Xin chào {user?.name}
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          marginTop: 12,
        }}
      >
        <Pressable
          style={{
            padding: 10,
            backgroundColor: "#E0E0E0",
            borderRadius: 25,
            flex: 1,
          }}
        >
          <Text style={{ textAlign: "center" }}>Giỏ hàng</Text>
        </Pressable>

        <Pressable
          style={{
            padding: 10,
            backgroundColor: "#E0E0E0",
            borderRadius: 25,
            flex: 1,
          }}
        >
          <Text style={{ textAlign: "center" }}>Tài khoản</Text>
        </Pressable>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          marginTop: 12,
        }}
      >
        <Pressable
          style={{
            padding: 10,
            backgroundColor: "#E0E0E0",
            borderRadius: 25,
            flex: 1,
          }}
        >
          <Text style={{ textAlign: "center" }}>Mua lại</Text>
        </Pressable>

        <Pressable
          onPress={handleLogout}
          style={{
            padding: 10,
            backgroundColor: "#E0E0E0",
            borderRadius: 25,
            flex: 1,
          }}
        >
          <Text style={{ textAlign: "center" }}>Đăng xuất</Text>
        </Pressable>
      </View>

      {/* Hiển thị danh sách đơn hàng với 2 cột */}
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item._id}
        numColumns={2} // Hiển thị 2 cột
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={!loading && renderEmptyComponent}
        scrollEnabled={false} // Tắt cuộn của FlatList vì đã có ScrollView bên ngoài
      />
    </ScrollView>
  );
};

export default ProfileScreen;

// Styles
const styles = StyleSheet.create({
  orderContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d0d0d0",
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "45%", // Chiều rộng của mỗi đơn hàng (45% để có khoảng cách giữa 2 cột)
  },
  productImageContainer: {
    marginVertical: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  orderId: {
    marginTop: 10,
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
  },
  orderTotal: {
    marginTop: 5,
    fontSize: 12,
    color: "#666",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
