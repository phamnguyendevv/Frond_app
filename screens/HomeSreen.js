import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Alert,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";

import { Entypo } from "@expo/vector-icons";
import { BottomModal, SlideAnimation, ModalContent } from "react-native-modals";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { Feather, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "../constants/config";
import DropDownPicker from "react-native-dropdown-picker";
import ProductItem from "../components/ProductItem";
import Swiper from "react-native-swiper";

const HomeScreen = () => {
  const images = [
    require("../assets/image/main1.jpg"),
    require("../assets/image/main2.jpg"),
    require("../assets/image/main3.png"),
  ];

  const deals = [
    {
      id: "20",
      title: "Apple iPad Air (Gen 5) WIFI Chính hãng (ZA/A)",
      oldPrice: 25000,
      price: 19000,
      image:
        "https://down-vn.img.susercontent.com/file/c27aabca2993e4c8c1d7c0072adef63e",
      carouselImages: [
        "https://down-vn.img.susercontent.com/file/c27aabca2993e4c8c1d7c0072adef63e",
      ],
      color: "Trắng",
      size: "8 GB RAM 1T GB Storage",
    },
    {
      id: "30",
      title:
        "Apple Watch Ultra viền Titanium dây Trail Loop size S/M 49mm Chính hãng",
      oldPrice: 74000,
      price: 26000,
      image:
        "https://down-vn.img.susercontent.com/file/sg-11134201-23020-7gat67ac6gnv79",
      carouselImages: [
        "https://down-vn.img.susercontent.com/file/sg-11134201-23020-7gat67ac6gnv79",
        "https://down-vn.img.susercontent.com/file/sg-11134201-23020-q9gsp8ac6gnva5",
        "https://down-vn.img.susercontent.com/file/sg-11134201-23020-iq4tl7ac6gnvf8",
        "https://down-vn.img.susercontent.com/file/sg-11134201-23020-6swu26ac6gnvb7",
      ],
      color: "TiTain - Tự Nhiên",
      size: "8 GB RAM 128GB Storage",
    },
    {
      id: "40",
      title: "Tai nghe Bluetooth Apple AirPods Pro (Gen 2) Chính hãng VN/A",
      oldPrice: 16000,
      price: 14000,
      image:
        "https://down-vn.img.susercontent.com/file/sg-11134201-22110-c4pqgt989djvd7",
      carouselImages: [
        "https://down-vn.img.susercontent.com/file/sg-11134201-22110-f3rmnfmqjfjv6f",
        "https://down-vn.img.susercontent.com/file/sg-11134201-22110-9m6jhgmqjfjv09",
        "https://down-vn.img.susercontent.com/file/sg-11134201-22110-mclmtemqjfjv7b",
        "https://down-vn.img.susercontent.com/file/sg-11134201-22110-5kak1t989djvef",
      ],
      color: "Icy Silver",
      size: "6 GB RAM 64GB Storage",
    },
    {
      id: "40",
      title: "Xe Máy Honda Vision 2023 - Phiên Bản Thể Thao",
      oldPrice: 12999,
      price: 10999,
      image:
        "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ltkmrv1ny0ay96",
      carouselImages: [
        "https://down-vn.img.susercontent.com/file/sg-11134201-22120-5c9w3f5qjtkv0e",
        "https://down-vn.img.susercontent.com/file/sg-11134201-22120-7otxmg5qjtkvec",
        "https://down-vn.img.susercontent.com/file/sg-11134201-22120-9a9xcg5qjtkve0",
        "https://down-vn.img.susercontent.com/file/sg-11134201-22120-ubnelikrjtkvac",
      ],
    },
  ];

  const list = [
    {
      id: "0",
      image: "https://m.media-amazon.com/images/I/41EcYoIZhIL._AC_SY400_.jpg",
      name: "Home",
    },
    {
      id: "1",
      image:
        "https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/blockbuster.jpg",
      name: "Deals",
    },
    {
      id: "3",
      image:
        "https://images-eu.ssl-images-amazon.com/images/I/31dXEvtxidL._AC_SX368_.jpg",
      name: "Electronics",
    },
    {
      id: "4",
      image:
        "https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/All_Icons_Template_1_icons_01.jpg",
      name: "Mobiles",
    },
    {
      id: "5",
      image:
        "https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/music.jpg",
      name: "Music",
    },
    {
      id: "6",
      image: "https://m.media-amazon.com/images/I/51dZ19miAbL._AC_SY350_.jpg",
      name: "Fashion",
    },
  ];

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();
  const [keyword, setKeyword] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [selectedAddress, setSelectedAdress] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchUser();
    fetchProducts(true);
  }, []);
  // Gọi lại fetchProducts khi category thay đổi
  useEffect(() => {
    fetchProducts(true);
  }, [category]);

  const fetchUser = async () => {
    try {
      const userId = await AsyncStorage.getItem("user");
      setUser(user);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getcategoris`);
      setCategories(response.data.result);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchProducts = async (refresh = false) => {
    if (!refresh && products.length >= totalProducts) return;

    setLoading(true);
    if (refresh) {
      setPage(1);
      setProducts([]);
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/getprobycate`, {
        categoryId: category || null, // Nếu không chọn danh mục nào, lấy tất cả sản phẩm
        page,
      });
      if (refresh) {
        setProducts(response.data.result);
      } else {
        setProducts((prev) => [...prev, ...response.data.result]);
      }
      setTotalProducts(10); // Lưu tổng số sản phẩm
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  //  Làm mới danh sách khi kéo xuống
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProducts(true);
  }, []);

  //  Tải thêm sản phẩm khi cuộn xuống cuối danh sách
  const handleLoadMore = useCallback(() => {
    if (!loading && products.length < totalProducts) {
      fetchProducts(false);
    }
  }, [loading, products.length, totalProducts]);

  const dropdownItems = useMemo(
    () => [
      { label: "Tất cả sản phẩm", value: null },
      ...categories.map((item) => ({
        label: item.name,
        value: item._id,
      })),
    ],
    [categories]
  );

  useEffect(() => {
    let isMounted = true;

    const fetchAddresses = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        const userId = JSON.parse(user)?._id;
        if (userId && isMounted) {
          const response = await axios.get(`${API_BASE_URL}/me/${userId}`);
          if (isMounted) {
            setAddresses(response.data.result.addresses);
          }
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();

    return () => {
      isMounted = false;
    };
  }, [modalVisible, dispatch]);
  const handleSearch = () => {
    console.log("keyword", keyword);
    navigation.navigate("ListProduct", { keyword: keyword });
  };

  const renderFooter = () => {
    return (
      <View style={{ alignItems: "center", marginTop: 10 }}>
        <ActivityIndicator size="large" color="#888888" />
      </View>
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  return (
    <>
      <SafeAreaView
        style={{ marginTop: 50, backgroundColor: "#fff" }}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView>
          <View
            style={{
              backgroundColor: "#F6412E",
              paddingVertical: 12,
              paddingHorizontal: 16,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "white",
                borderRadius: 8,
                height: 40,
                flex: 1,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.18,
                shadowRadius: 1.0,
                elevation: 1,
              }}
            >
              <Pressable onPress={handleSearch}>
                <AntDesign
                  style={{ paddingHorizontal: 12 }}
                  name="search1"
                  size={20}
                  color="#666"
                />
              </Pressable>
              <TextInput
                placeholder="Tìm kiếm sản phẩm..."
                placeholderTextColor="#999"
                value={keyword}
                onChangeText={setKeyword}
                style={{
                  flex: 1,
                  height: "100%",
                  fontSize: 15,
                  color: "#333",
                }}
              />
            </Pressable>

            <Pressable
              style={{
                backgroundColor: "white",
                padding: 8,
                borderRadius: 8,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.18,
                shadowRadius: 1.0,
                elevation: 1,
              }}
            >
              <Feather name="mic" size={24} color="#666" />
            </Pressable>
          </View>

          <Pressable
            onPress={() => setModalVisible(!modalVisible)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              padding: 10,
              backgroundColor: "#FF6433",
            }}
          >
            <Ionicons name="location-outline" size={24} color="black" />
            <Pressable>
              {selectedAddress ? (
                <Text>
                  Giao tới {selectedAddress?.name} - {selectedAddress?.street}
                </Text>
              ) : (
                <Text style={{ fontSize: 13, fontWeight: "500" }}>
                  Thêm địa chỉ giao hàng
                </Text>
              )}
            </Pressable>
            <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
          </Pressable>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {list.map((item, index) => (
              <Pressable
                key={index}
                style={{
                  margin: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  style={{ width: 50, height: 50, resizeMode: "contain" }}
                  source={{ uri: item.image }}
                />

                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 12,
                    fontWeight: "500",
                    marginTop: 5,
                  }}
                >
                  {item?.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          <View style={{ padding: 0 }}>
            <Swiper
              style={{ overflow: "hidden", height: 250 }}
              loop={true} // Auto loop images
              autoplay={true} // Enable autoplay
              autoplayTimeout={3} // Change autoplay duration
              pagination={{
                clickable: true, // Allow pagination clicks
                hideOnClick: true, // Hide pagination when clicked
              }}
              dotStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.6)", // Light dots
                width: 10, // Size of the dots
                height: 10,
                borderRadius: 5, // Rounded dots
                margin: 3, // Space between dots
              }}
              activeDotStyle={{
                backgroundColor: "#fff", // White active dot
                width: 12, // Active dot size
                height: 12,
                borderRadius: 6,
              }}
              paginationStyle={{
                bottom: 0, // Position pagination at the bottom
                paddingHorizontal: 20, // Space on the left/right of pagination
              }}
            >
              {images.map((image, index) => (
                <View key={index} style={styles.slide}>
                  <Image
                    source={image}
                    style={[styles.image]}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </Swiper>
          </View>

          <View style={{ padding: 0 }}>
            <Text style={{ padding: 10, fontSize: 18, fontWeight: "bold" }}>
              Đơn hàng bán chạy trong ngày
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              {deals.map((deal, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    // Đảm bảo carouselImages là một mảng
                    const imagesArray = Array.isArray(deal.carouselImages)
                      ? deals.carouselImages
                      : [deals.carouselImages].filter(Boolean); // Chuyển đổi thành mảng và loại bỏ giá trị null/undefined
                    navigation.navigate("Info", {
                      id: deal.id,
                      title: deal.title,
                      price: deal?.price,
                      carouselImages: deal.carouselImages, // Sử dụng mảng đã được đảm bảo
                      color: deal?.color,
                      size: deal?.size,
                      oldPrice: deal?.oldPrice,
                      item: deal,
                    });
                  }}
                  style={{
                    width: "48%",
                    backgroundColor: "white",
                    borderRadius: 8,
                    marginBottom: 12,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    shadowOpacity: 0.18,
                    shadowRadius: 1.0,
                    elevation: 1,
                  }}
                >
                  <Image
                    source={{ uri: deal.image }}
                    style={{
                      width: "100%",
                      height: 200,
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                    }}
                  />
                  <View style={{ padding: 8 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                      {deal.title}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 8,
                      }}
                    >
                      <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                        {deal.price} VNĐ
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          textDecorationLine: "line-through",
                          color: "#666",
                        }}
                      >
                        {deal.oldPrice} VNĐ
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <Text
              style={{
                height: 1,
                borderColor: "#D0D0D0",
                borderWidth: 2,
                marginTop: 15,
              }}
            />
            <Text style={{ padding: 15, fontSize: 18, fontWeight: "bold" }}>
              Ưu đãi hấp dẫn
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ paddingVertical: 10 }}
            >
              {products.map((item, index) => (
                <Pressable
                  key={index}
                  onPress={() =>
                    navigation.navigate("Info", {
                      id: item.id,
                      title: item.title,
                      price: item?.price,
                      carouselImages: item.carouselImages,
                      color: item?.color,
                      size: item?.size,
                      oldPrice: item?.oldPrice,
                      item: item,
                    })
                  }
                  style={{
                    backgroundColor: "white",
                    borderRadius: 10,
                    padding: 10,
                    marginRight: 12,
                    alignItems: "center",
                    justifyContent: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.15,
                    shadowRadius: 4,
                    elevation: 3, // Đổ bóng trên Android
                  }}
                >
                  <Image
                    style={{
                      width: 150,
                      height: 150,
                      borderRadius: 10,
                      resizeMode: "contain",
                    }}
                    source={{ uri: item?.image }}
                  />

                  {/* Nhãn giảm giá */}
                  <View
                    style={{
                      backgroundColor: "#E31837",
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      borderRadius: 20,
                      position: "absolute",
                      top: 10,
                      right: 10,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.2,
                      shadowRadius: 2,
                      elevation: 2,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Giảm tới 70%
                    </Text>
                  </View>

                  {/* Tên sản phẩm */}
                  <Text
                    style={{
                      marginTop: 8,
                      fontSize: 14,
                      fontWeight: "bold",
                      color: "#333",
                      textAlign: "center",
                      width: 140,
                    }}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>

                  {/* Giá tiền */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 4,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "bold",
                        color: "#E31837",
                      }}
                    >
                      {item?.price}₫
                    </Text>
                    {item?.oldPrice && (
                      <Text
                        style={{
                          fontSize: 12,
                          textDecorationLine: "line-through",
                          color: "#888",
                          marginLeft: 6,
                        }}
                      >
                        {item?.oldPrice}₫
                      </Text>
                    )}
                  </View>
                </Pressable>
              ))}
            </ScrollView>
            <Text
              style={{
                height: 1,
                borderColor: "#D0D0D0",
                borderWidth: 2,
                marginTop: 15,
              }}
            />
            <Text style={{ padding: 15, fontSize: 18, fontWeight: "bold" }}>
              Danh mục sản phẩm
            </Text>

            <View
              style={{
                marginHorizontal: 10,
                marginTop: 10,
                width: "45%",
                marginBottom: open ? 10 : 15,
              }}
            ></View>
            <View
              style={{
                marginHorizontal: 10,
                marginTop: 20,
                width: "45%",
                marginBottom: open ? 50 : 15,
              }}
            >
              <DropDownPicker
                style={{
                  borderColor: "#B7B7B7",
                  height: 30,
                }}
                containerStyle={{
                  marginBottom: open ? 120 : 15,
                }}
                open={open}
                value={category}
                items={dropdownItems}
                setOpen={setOpen}
                setValue={setCategory}
                placeholder="Chọn danh mục"
                zIndex={3000}
                zIndexInverse={1000}
              />
            </View>
          </View>
          <FlatList
            data={products}
            renderItem={({ item, index }) => (
              <Pressable
                key={index}
                onPress={() =>
                  navigation.navigate("Info", {
                    id: item.id,
                    title: item.title,
                    price: item?.price,
                    carouselImages: item.carouselImages,
                    color: item?.color,
                    size: item?.size,
                    oldPrice: item?.oldPrice,
                    item: item,
                  })
                }
                style={{
                  margin: 10,
                  width: "45%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ProductItem item={item} />
              </Pressable>
            )}
            keyExtractor={(item, index) => index.toString()}
            onRefresh={handleRefresh}
            refreshing={refreshing}
            onEndReached={handleLoadMore}
            numColumns={2} // Hiển thị 2 cột
            onEndReachedThreshold={0.1} // Khoảng cách từ cuối danh sách để gọi hàm
            ListFooterComponent={renderFooter && renderFooter()} // Render phần tử footer
            ListEmptyComponent={
              !loading && (
                <View style={styles.centered}>
                  <Text>No products found</Text>
                </View>
              )
            }
          />
        </ScrollView>
      </SafeAreaView>
      <BottomModal
        onBackdropPress={() => setModalVisible(!modalVisible)}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
        modalAnimation={
          new SlideAnimation({
            slideFrom: "bottom",
          })
        }
        onHardwareBackPress={() => setModalVisible(!modalVisible)}
        visible={modalVisible}
        onTouchOutside={() => setModalVisible(!modalVisible)}
      >
        <ModalContent style={{ width: "100%", height: 400 }}>
          <View style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: "500" }}>
              Chọn địa chỉ giao hàng
            </Text>

            <Text style={{ marginTop: 5, fontSize: 16, color: "gray" }}>
              Chọn địa chỉ giao hàng hoặc thêm địa chỉ mới
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* already added addresses */}
            {addresses?.map((item, index) => (
              <Pressable
                onPress={() => setSelectedAdress(item)}
                style={{
                  width: 140,
                  height: 140,
                  borderColor: "#D0D0D0",
                  borderWidth: 1,
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 3,
                  marginRight: 15,
                  marginTop: 10,
                  backgroundColor:
                    selectedAddress === item ? "#FBCEB1" : "white",
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
                >
                  <Text style={{ fontSize: 13, fontWeight: "bold" }}>
                    {item?.name}
                  </Text>
                  <Entypo name="location-pin" size={24} color="red" />
                </View>

                <Text
                  numberOfLines={1}
                  style={{ width: 130, fontSize: 13, textAlign: "center" }}
                >
                  {item?.houseNo},{item?.landmark}
                </Text>

                <Text
                  numberOfLines={1}
                  style={{ width: 130, fontSize: 13, textAlign: "center" }}
                >
                  {item?.street}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{ width: 130, fontSize: 13, textAlign: "center" }}
                >
                  {item?.city} - {item?.country}
                </Text>
              </Pressable>
            ))}

            <Pressable
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("Address");
              }}
              style={{
                width: 140,
                height: 140,
                borderColor: "#D0D0D0",
                marginTop: 10,
                borderWidth: 1,
                padding: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#0066b2",
                  fontWeight: "500",
                }}
              >
                Thêm địa chỉ mới
              </Text>
            </Pressable>
          </ScrollView>
          <View style={{ flexDirection: "column", gap: 7, marginBottom: 30 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Entypo name="location-pin" size={22} color="#0066b2" />
              <Text style={{ color: "#0066b2", fontWeight: "400" }}>
                Sử dụng địa chỉ mặc định
              </Text>
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Ionicons name="locate-sharp" size={22} color="#0066b2" />
              <Text style={{ color: "#0066b2", fontWeight: "400" }}>
                Sử dụng vị trí hiện tại
              </Text>
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <AntDesign name="earth" size={22} color="#0066b2" />

              <Text style={{ color: "#0066b2", fontWeight: "400" }}>
                Giao hàng đến quốc gia khác
              </Text>
            </View>
          </View>
        </ModalContent>
      </BottomModal>
    </>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loadMoreButton: {
    marginHorizontal: 20,
    backgroundColor: "white",
    paddingVertical: 15, // Điều chỉnh độ cao của nút
    paddingHorizontal: 30, // Điều chỉnh độ rộng của nút
    borderRadius: 8, // Điều chỉnh độ cong của góc
    borderWidth: 2, // Thêm viền
    borderColor: "#ccc", // Màu viền
  },
  loadMoreButtonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 18, // Điều chỉnh kích thước chữ
  },
  slide: {
    width: "100%",
    height: 250,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
    margin: 0, // Không có margin thừa
    overflow: "hidden",
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  pagination: {
    bottom: 0,
  },
  dot: {
    backgroundColor: "#90A4AE",
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 5,
  },
  activeDot: {
    backgroundColor: "#13274F",
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 5,
  },
});

export default HomeScreen;
