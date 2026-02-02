import { StyleSheet } from "react-native";
import { getColors } from "./constants";

const getShadows = (isDarkMode: boolean) => {
  const colors = getColors(isDarkMode);
  return {
    shadow0: {
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    shadow3: {
      shadowColor: colors.greish,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    },
    shadow5: {
      shadowColor: colors.greish,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 3,
    },
  };
};

export { getShadows };
export default getShadows;