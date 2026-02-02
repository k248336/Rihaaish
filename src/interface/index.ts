import {
  StyleProp,
  TextStyle,
  ViewStyle,
  ImageStyle,
  ImageURISource,
  TextInputProps,
  ImageSourcePropType,
  TouchableOpacityProps,
  ScrollViewProps,
} from 'react-native';
import authReducer from '../redux/slices/auth';
import loaderReducer from '../redux/slices/loader';
import notificationReducer from '../redux/slices/notification';

export interface AnimatedCheckboxProps {
  label?: string | React.ReactElement;
  checked?: boolean;
  touchableLabel?: boolean;
  size?: number;
  checkPosition?: 'left' | 'right';
  checkedBackgroundColor?: string;
  unCheckedBackgroundColor?: string;
  unCheckedBorderColor?: string;
  checkedBorderColor?: string;
  borderWidth?: number;
  rippleEffect?: boolean;
  rippleColor?: string;
  rounded?: boolean;
  checkBoxRadius?: number;
  checkMarkSize?: number;
  checkMarkColor?: string;
  animationType?: 'scale' | 'left' | 'reveal';
  onValueChange: (checked: boolean) => void;
  labelStyle?: TextStyle;
  checkStyle?: TextStyle;
  containerStyle?: ViewStyle;
  checkboxContainerStyle?: ViewStyle;
  labelContainerStyle?: ViewStyle;
  boxStyle?: ViewStyle;
  customMarker?: React.ReactElement;
}
export interface CustomSwitchI {
  switchVal: boolean;
  setSwitchVal: (value: boolean) => void;
}

export interface CustomButtonProps {
  title: string;
  onPress: () => void;
  btnStyle?: ViewStyle | Array<ViewStyle>;
  titleColor?: string;
  titleStyle?: object;
  disabled?: boolean;
  icon?: number;
  gradient?: boolean;
  gradientColors?: string[];
  rightIcon?: ImageSourcePropType;
  rightIconStyles?: ImageStyle;
  txtColor?: string;
  txtSize?: number;
  backgroundColor?: string;
  subTitle?: string;
  subTitleTxtSize?: number;
  subTitleTxtColor?: string;
  iconStyle?: ImageStyle;
  titleTxtWeight?: 'regular' | 'medium' | 'semibold' | 'bold';
  titleFontFamily?: 'SFPRODISPLAY';
}

export interface ICustomScrolllView {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  horizontal?: boolean;
  isMarginTop?: boolean;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  showBackground?: boolean;
  backgroundImage?: ImageSourcePropType;
  backgroundStyle?: StyleProp<ViewStyle>;
}

export interface CustomTextInputProps extends TextInputProps {
  icon?: ImageSourcePropType;
  label?: string;
  headingLabel?: string;
  multiline?: boolean;
  passwordField?: boolean;
  containerStyle?: ViewStyle;
  inputFieldStyle?: ViewStyle;
  rightIconColor?: string;
  iconcolor?: string;
  placeholderTextColor?: string;
  rightIconSize?: number;
  rightIcon?: ImageSourcePropType;
  onPressIn?: () => void;
  errors?: any;
  focus?: any;
}

export interface IHeadingComp {
  title: string;
  subTitle?: string;
  titleStyle?: TextStyle | undefined;
  maxwidth?: string;
  imagestyle?: StyleProp<ImageStyle>;
  layout?: 'first' | 'second';
  containerStyle?: StyleProp<ViewStyle>;
  subTitleStyle?: TextStyle | undefined;
  subTitleTxtSize?: number;
  titleTxtSize?: number;
  titleTxtColor?: string;
  subTitleTxtColor?: string;
  titletxtWeight?: 'regular' | 'medium' | 'semibold' | 'bold';
  subTitleTxtWeight?: 'regular' | 'medium' | 'semibold' | 'bold';
  highlitedText?: string;
  fontfamily?: 'SFPRODISPLAY';
}

export interface IGradientTxt {
  txt: string;
  fontSize?: number;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  fontfamily?: 'SFPRODISPLAY';
}

export interface IiconButton {
  icon: ImageSourcePropType;
  size?: number;
  onPress?: () => void;
  tintColor?: string;
  iconStyle: StyleProp<ImageStyle>;
}
export interface IPhoneTextInput extends CustomTextInputProps {
  icon?: ImageSourcePropType;
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
}

export interface INotificationCard {
  item: any;
  lastItem: boolean;
}
export interface ISearchBar extends TextInputProps {
  onPress?: () => void;
  filter: boolean;
  onPressFilter?: () => void;
  placeholder?: string;
  containerStyle?: ViewStyle;
}

export interface UploadedImageProps {
  isVideo?: boolean;
  image?: ImageSourcePropType;
  showCrossIcon?: boolean;
}

export interface RootState {
  loader: ReturnType<typeof loaderReducer>;
  auth: ReturnType<typeof authReducer>;
  notification: ReturnType<typeof notificationReducer>;
  theme: ReturnType<typeof import('../redux/slices/theme').default>;
}

export interface WelcomeHeaderProps {
  name: string;
  profile?: any;
  containerStyle?: StyleProp<ViewStyle>;
  hideProfile?: boolean;
}

export interface BackButtonProps {
  onPress?: () => void;
  style?: ViewStyle;
  icon?: ImageSourcePropType;
  iconSize?: number;
  imgStyle?: ImageStyle;
}

export interface HorizontalTabsProps {
  tabs: Array<{ label: string; image?: ImageSourcePropType }>;
  onPressTab?: (tab: string | Array<string>) => void;
  multiSelect?: boolean;
}

export interface IStatusRenderItem {
  item: {
    name: string;
    status: ImageSourcePropType;
    user: ImageSourcePropType;
  };
}

export interface CustomTabsProps {
  selectedTab: number;
  titleSize?: number;
  onChangeTab: (index: number) => void;
  tabStyle?: object;
  containerStyle?: object;
  navigationState?: {
    routes: Array<{ title: string }>;
  };
}

export interface MessageCardProps {
  item: {
    title: string;
    message: string;
    image: ImageSourcePropType;
    messageCount?: number | undefined;
    reel?: boolean;
  };
}

export interface ProjectItem {
  id: string;
  image: ImageSourcePropType;
  type: string;
  name: string;
  location: string;
  beds: number;
  baths: number;
  size: number;
  price: string;
  latitude: number;
  longitude: number;
}
