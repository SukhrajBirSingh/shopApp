import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

import productsReducer from "./store/reducers/products";
import ShopNavigator from "./navigation/ShopNavigator";
import cartReducer from "./store/reducers/cart";
import ordersReducer from "./store/reducers/orders";
import authReducer from "./store/reducers/auth";
import ReduxThunk from "redux-thunk";
import NavigationContainer from "./navigation/NavigationContainer";

const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  orders: ordersReducer,
  auth: authReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const fetchFonts = () => {
  return Font.loadAsync({
    "open-sans": require("./fonts/open-sans.ttf"),
    "open-sans-bold": require("./fonts/open-sans-bold.ttf"),
    "homework-normal": require("./fonts/Homework.ttf"),
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => {
          setFontLoaded(true);
        }}
        onError={console.log("error")}
      />
    );
  }
  return (
    <Provider store={store}>
      <StatusBar style="auto" />
      <NavigationContainer />
    </Provider>
  );
}
