import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ImagePicker from 'react-native-image-crop-picker';
import { BackButton, CustomText, GradientView } from '../../../components';
import {
  getAppStyles,
  getColors,
  fontFamily,
  goBack,
  icons,
  images,
  navigate,
  getShadows,
} from '../../../utilities';
import { heightPixel, widthPixel } from '../../../utilities/helpers';
import { useTheme } from '../../../hooks';

const Header = ({
  insets,
  name,
  image,
  colors,
  appStyles,
}: {
  insets: any;
  name?: string;
  image?: any;
  colors: any;
  appStyles: any;
}) => {
  const shadows = getShadows(false); // Shadows don't change with theme

  return (
    <View
      style={{
        paddingHorizontal: widthPixel(20),
        paddingTop: heightPixel(10),
        backgroundColor: colors.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // gap: 10,
      }}
    >
      <View style={[appStyles.flexRow, { gap: 20 }]}>
        <BackButton />
        <View style={[appStyles.flexRow, { alignItems: 'center', gap: 10 }]}>
          <Image
            style={{
              height: heightPixel(35),
              width: widthPixel(35),
              resizeMode: 'contain',
            }}
            source={icons.chatappicon}
          />
          <View>
            <CustomText weight="bold" color={colors.primary}>{name || 'Support Chat'}</CustomText>
            <CustomText fontSize={12} weight="regular" color={colors.greaytext}>
              {'Online'}
            </CustomText>
          </View>
        </View>
      </View>

      <View
        style={{
          height: heightPixel(40),
          width: widthPixel(40),
        }}
      >
        <Image
          resizeMode="contain"
          tintColor={image ? '' : colors.black}
          style={{
            height: '100%',
            width: '100%',
            borderRadius: heightPixel(100),
          }}
          source={''}
        />
      </View>
      {/* )} */}
    </View>
  );
};

const SupportChat = ({ route }: { route: any }) => {
  const { name, image } = route.params;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);
  const shadows = getShadows(isDarkMode);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <Header name={name} image={image} insets={insets} colors={colors} appStyles={appStyles} />,
    });
  }, [insets, navigation, name, image, colors, appStyles]);

  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'You',
      text: 'Hello, need a help?',
      time: '5:03 PM',
      type: 'sent',
    },
    {
      id: '2',
      sender: 'Support',
      text: 'How Can We Help You?',
      time: '5:05 PM',
      type: 'received',
    },
  ]);
  const [input, setInput] = useState('');
  const [visible, setVisible] = useState(false);

  const handleSend = () => {
    if (input.trim() === '') return;

    const newMessage = {
      id: Date.now().toString(),
      sender: 'You',
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      type: 'sent',
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
  };

  const openGallery = () => {
    ImagePicker.openPicker({
      multiple: true,
      cropping: true,
      mediaType: 'photo',
      compressImageQuality: 0.7,
    })
      .then(images => {
        setVisible(false);
        handleImageSelect(images);
      })
      .catch(err => {
        console.log('ImagePicker Error:', err);
        setVisible(false);
      });
  };

  const openCamera = async () => {
    ImagePicker.openCamera({
      cropping: false,
      mediaType: 'photo',
      compressImageQuality: 0.7,
    })
      .then(image => {
        setVisible(false);
        handleImageSelect(image);
      })
      .catch(err => {
        console.log('ImagePicker Error:', err);
        setVisible(false);
      });
  };

  const handleImageSelect = (image: any) => {
    if (image) {
      const imagePath = Array.isArray(image) ? image[0]?.path : image?.path;
      if (imagePath) {
        const newMessage = {
          id: Date.now().toString(),
          sender: 'You',
          text: '',
          image: imagePath,
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          type: 'sent',
        };

        setMessages(prev => [...prev, newMessage]);
      }
    }
  };

  const renderMessage = ({ item, index }: { item: any; index: number }) => {
    const isSent = item.type === 'sent';
    const showTime = index === 0 || messages[index - 1].time !== item.time;

    return (
      <View
        style={{
          marginVertical: 4,
          alignItems: isSent ? 'flex-end' : 'flex-start',
        }}
      >
        {showTime && (
          <CustomText
            fontSize={heightPixel(13)}
            style={dynamicStyles(colors).timestamp}
            color={colors.greaytext}
          >
            Today at {item.time}
          </CustomText>
        )}

        {isSent ? (
          <View style={[dynamicStyles(colors).messageContainer, dynamicStyles(colors).sent]}>
            <GradientView style={dynamicStyles(colors).sentBubble}>
              {item.image ? (
                <Image
                  source={{ uri: item.image }}
                  style={dynamicStyles(colors).messageImage}
                  resizeMode="cover"
                />
              ) : (
                <>
                  <CustomText color={'white'} fontSize={12}>
                    {item.text}
                  </CustomText>
                </>
              )}
            </GradientView>
          </View>
        ) : (
          <View style={[dynamicStyles(colors).messageContainer, dynamicStyles(colors).received]}>
            <Image source={icons.chatappicon} style={dynamicStyles(colors).appicon} />

            <View style={dynamicStyles(colors).receivedBubble}>
              {item.image ? (
                <Image
                  source={{ uri: item.image }}
                  style={dynamicStyles(colors).messageImage}
                  resizeMode="cover"
                />
              ) : (
                <CustomText fontSize={12} color={colors.black}>
                  {item.text}
                </CustomText>
              )}
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={dynamicStyles(colors).chatArea}
        showsVerticalScrollIndicator={false}
      />

      <View style={dynamicStyles(colors).inputContainer}>
        <TextInput
          placeholder="Type a message..."
          placeholderTextColor={colors.greaytext}
          value={input}
          onChangeText={setInput}
          style={dynamicStyles(colors).input}
        />

        <View style={dynamicStyles(colors).clipbutton}>
          <TouchableOpacity activeOpacity={0.8} onPress={openGallery}>
            <Image
              tintColor={colors.greaytext}
              style={dynamicStyles(colors).clip}
              resizeMode="contain"
              source={icons.clip}
            />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} onPress={openCamera}>
            <Image
              tintColor={colors.greaytext}
              style={dynamicStyles(colors).clip}
              resizeMode="contain"
              source={icons.camera}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleSend} activeOpacity={0.8}>
          <GradientView style={dynamicStyles(colors).sendButton}>
            <Image
              // tintColor={colors.white}
              style={dynamicStyles(colors).icon}
              resizeMode="contain"
              source={icons.send}
            />
          </GradientView>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SupportChat;

const dynamicStyles = (colors: any) => StyleSheet.create({
  disclaimerContainer: {
    backgroundColor: colors.blackShade,
    paddingHorizontal: 16,
    marginTop: heightPixel(10),
    paddingVertical: 8,
  },
  appicon: {
    height: heightPixel(32),
    width: widthPixel(32),
    borderRadius: heightPixel(23),
  },
  disclaimerText: {
    textAlign: 'center',
  },
  chatArea: {
    padding: 16,
    paddingBottom: 50,
    flexGrow: 1,
    backgroundColor: colors.greishBg,
  },
  timestamp: {
    color: colors.greaytext,
    fontSize: 12,
    alignSelf: 'center',
    marginVertical: 10,
  },
  messageContainer: {
    maxWidth: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 20,
  },
  sent: {
    alignSelf: 'flex-end',
  },
  received: {
    alignSelf: 'flex-start',
  },
  receivedBubble: {
    backgroundColor: colors.white,
    ...getShadows(false).shadow3,
    padding: 12,
    borderRadius: 20,

    borderTopLeftRadius: 0,
  },
  sentBubble: {
    padding: 12,
    backgroundColor: colors.black,
    borderTopRightRadius: 0,
    borderRadius: 20,
  },
  messageImage: {
    width: widthPixel(200),
    height: heightPixel(150),
    borderRadius: 10,
  },
  inputContainer: {
    paddingBottom: heightPixel(10),
    paddingTop: heightPixel(10),
    paddingHorizontal: widthPixel(15),
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: heightPixel(50),
    backgroundColor: colors.textfieldcolor,
    ...getShadows(false).shadow5,
    paddingVertical: 8,
    color: colors.primary,
    paddingHorizontal: 12,
    borderRadius: 30,
  },
  sendButton: {
    height: heightPixel(50),
    width: widthPixel(50),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    marginLeft: 10,
  },
  clipbutton: {
    position: 'absolute',
    flexDirection: 'row',
    width: 50,
    height: heightPixel(30),
    bottom: 20,
    gap: 20,
    alignItems: 'center',
    right: 90,
  },
  clip: {
    height: heightPixel(16),
    width: widthPixel(14),
  },
  icon: {
    height: heightPixel(20),
    width: widthPixel(20),
  },
});