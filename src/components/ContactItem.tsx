import { Pressable, Text } from "react-native";

type Props = {
  name: string;
  onPress: () => void;
};

export const ContactItem = ({ name, onPress }: Props) => (
  <Pressable onPress={onPress} className="p-4 border-b border-gray-200">
    <Text className="text-lg">{name}</Text>
  </Pressable>
);
