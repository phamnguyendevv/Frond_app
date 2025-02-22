import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/CartReducer";

import { AntDesign } from "@expo/vector-icons";

const ProductItem = ({ item }) => {
  const [addedToCart, setAddedToCart] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const addItemToCart = (item) => {
    setAddedToCart(true);

    dispatch(addToCart(item));
    setTimeout(() => {
      setAddedToCart(false);
    }, 60000);
  };

  const calculateDiscount = () => {
    if (item?.oldPrice) {
      const discount = ((item.oldPrice - item.price) / item.oldPrice) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  return (
    <Pressable
      style={styles.container}
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
    >
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: item?.image }} />
        {item?.oldPrice && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{calculateDiscount()}%</Text>
          </View>
        )}
      </View>

      <View style={styles.detailsContainer}>
        <Text numberOfLines={2} style={styles.title}>
          {item?.title}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>${item?.price}</Text>
          {item?.oldPrice && (
            <Text style={styles.oldPrice}>${item?.oldPrice}</Text>
          )}
        </View>

        <Pressable
          onPress={() => addItemToCart(item)}
          style={[
            styles.addToCartButton,
            addedToCart && styles.addedToCartButton,
          ]}
        >
          <AntDesign
            name={addedToCart ? "checkcircle" : "shoppingcart"}
            size={16}
            color="white"
          />
          <Text style={styles.buttonText}>
            {addedToCart ? "Đã thêm vào giỏ" : "Thêm vào giỏ"}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 12,
    marginHorizontal: "1.5%",
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    position: "relative",
    padding: 10,
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "contain",
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FF3B30",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  detailsContainer: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    marginBottom: 8,
    color: "#333",
    height: 40,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  oldPrice: {
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
    marginLeft: 8,
  },
  addToCartButton: {
    backgroundColor: "#F27259",
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  addedToCartButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "white",
    marginLeft: 8,
    fontSize: 12,
    fontWeight: "500",
  },
});

export default ProductItem;
