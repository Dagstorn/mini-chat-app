import { Platform } from "react-native";
import { io } from "socket.io-client";

const API_BASE =
  Platform.OS === "android"
    ? process.env.EXPO_PUBLIC_API_BASE_ANDROID
    : process.env.EXPO_PUBLIC_API_BASE;

const socket = io(API_BASE, {
  transports: ["websocket"],
  autoConnect: false,
});

export default socket;
