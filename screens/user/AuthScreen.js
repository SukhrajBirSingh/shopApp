import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  Button,
  ActivityIndicator,
  Keyboard,
  Touchable,
  ImageBackground,
  Alert,
} from "react-native";
import Colors from "../../constants/Colors";

import Card from "../../components/UI/Card";

import Input from "../../components/UI/Input";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import * as authActions from "../../store/actions/auth";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};

const AuthScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    //second argument is intial state, which later be chnged inside the form reducer
    inputValues: {
      email: "",
      password: "",
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred", error, [{ text: "Okay" }]);
    }
  }, [error]);

  //   const signInHandler = async () => {
  //     action = authActions.login(
  //       formState.inputValues.email,
  //       formState.inputValues.password
  //     );

  //     setError(null);
  //     setIsLoading(true);
  //     try {
  //       await dispatch(action);
  //     } catch (err) {
  //       setError(err.message);
  //     }
  //     setIsLoading(false);
  //   };

  const authHandler = async () => {
    let action;

    if (isSignup) {
      action = authActions.signup(
        formState.inputValues.email,
        formState.inputValues.password
      );
    } else {
      action = authActions.login(
        formState.inputValues.email,
        formState.inputValues.password
      );
    }
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(action);
      props.navigation.navigate("Shop");
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue, //forwarding
        isValid: inputValidity, //forwarding to action
        input: inputIdentifier,
        //input: "title", // this key should be inside your state(input values/ validities)
      });
    },
    [dispatchFormState]
  );

  return (
    //   <DismissKeyboard>
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <ImageBackground
        style={styles.backgroundImage}
        source={{
          uri: "https://www.westend61.de/images/0001401837pw/shopping-cart-with-bags-and-gifts-on-pink-background-EYF07581.jpg",
        }}
        resizeMode="cover"
      >
        <Text style={styles.text}>S</Text>

        <Card style={styles.authContainer}>
          <ScrollView>
            <Input
              id="email"
              label="E-Mail"
              keyboardType="email-addess"
              required
              email
              autoCapitalize="none"
              errorText="Please enter a valid email address"
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <Input
              id="password"
              label="Passsword"
              keyboardType="default"
              required
              secureTextEntry
              //  autoCapitalize="none"
              errorText="Please enter a valid email password"
              initialValue=""
              onInputChange={inputChangeHandler}
            />
            <View style={styles.buttonContainer}>
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Button
                  title={isSignup ? "Sign Up" : "Login"}
                  color={Colors.primary}
                  onPress={authHandler}
                />
              )}
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title={`Switch to ${isSignup ? "Login" : "Signup"}`}
                color={Colors.accent}
                onPress={() => {
                  setIsSignup((prevState) => !prevState);
                }}
              />
            </View>
          </ScrollView>
        </Card>
      </ImageBackground>
    </KeyboardAvoidingView>
    //   </DismissKeyboard>
  );
};

AuthScreen.navigationOptions = {
  headerTitle: "The Shop App",
  //color : {Colors.primary}
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 200,
    fontWeight: "bold",
    color: Colors.primary,
    position: "absolute",
    top: 5,
  },

  authContainer: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
  },

  buttonContainer: {
    marginTop: 10,
  },
});

export default AuthScreen;
