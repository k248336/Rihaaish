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
import { CustomText, GradientView } from '../../components';
import {
  appStyles,
  colors,
  fontFamily,
  goBack,
  icons,
  images,
  navigate,
} from '../../utilities';
import { heightPixel, widthPixel } from '../../utilities/helpers';
import { Shadows } from '../../utilities';

const Header = ({
  insets,
  name,
  image,
}: {
  insets: any;
  name?: string;
  image?: any;
}) => {
  return (
    <View
      style={{
        paddingHorizontal: widthPixel(20),
        paddingTop: heightPixel(50),
        backgroundColor: colors.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // gap: 10,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          goBack();
        }}
        activeOpacity={0.8}
      >
        <Image
          style={{ height: 18, width: 18, resizeMode: 'contain' }}
          source={icons.backArrow}
        />
      </TouchableOpacity>
      <View style={[appStyles.flexRow, { alignItems: 'center', gap: 10 }]}>
        <Image
          style={{ height: heightPixel(35), width: widthPixel(35) }}
          source={icons.supportlogo}
        />

        <CustomText weight="bold">{name || 'Support Chat'}</CustomText>
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

const LiveChat = ({ route }: { route: any }) => {
  const { name, image } = route.params;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <Header name={name} image={image} insets={insets} />,
    });
  }, [insets, navigation, name, image]);

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
            style={styles.timestamp}
            color="#9B9B9B"
          >
            Today at {item.time}
          </CustomText>
        )}

        {isSent ? (
          <View style={[styles.messageContainer, styles.sent]}>
            <View style={styles.sentBubble}>
              {item.image ? (
                <Image
                  source={{ uri: item.image }}
                  style={styles.messageImage}
                  resizeMode="cover"
                />
              ) : (
                <CustomText color={colors.white} fontSize={heightPixel(13)}>
                  {item.text}
                </CustomText>
              )}
            </View>
          </View>
        ) : (
          <View style={[styles.messageContainer, styles.received]}>
            <View style={styles.receivedBubble}>
              {item.image ? (
                <Image
                  source={{ uri: item.image }}
                  style={styles.messageImage}
                  resizeMode="cover"
                />
              ) : (
                <CustomText fontSize={heightPixel(14)} color={colors.black}>
                  {item.text}
                </CustomText>
              )}
            </View>
          </View>
        )}
        <CustomText fontSize={heightPixel(10)}>{item.sender}</CustomText>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      {/* <View style={styles.disclaimerContainer}>
        <CustomText
          fontSize={heightPixel(12)}
          style={styles.disclaimerText}
          color={colors.white}
        >
          Responses may be delayed. Our team will get back to you soon.
        </CustomText>
      </View> */}
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatArea}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Type a message..."
          placeholderTextColor="#ccc"
          value={input}
          onChangeText={setInput}
          style={styles.input}
        />

        <View style={styles.clipbutton}>
          <TouchableOpacity activeOpacity={0.8} onPress={openGallery}>
            <Image
              tintColor={'#9E9E9E'}
              style={styles.clip}
              resizeMode="contain"
              source={icons.clip}
            />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} onPress={openCamera}>
            <Image
              tintColor={'#9E9E9E'}
              style={styles.clip}
              resizeMode="contain"
              source={icons.camera}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleSend} activeOpacity={0.8}>
          <View style={styles.sendButton}>
            <Image
              tintColor={colors.black}
              style={styles.icon}
              resizeMode="contain"
              source={icons.send}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LiveChat;

const styles = StyleSheet.create({
  disclaimerContainer: {
    backgroundColor: colors.blackShade,
    paddingHorizontal: 16,
    marginTop: heightPixel(10),
    paddingVertical: 8,
  },
  disclaimerText: {
    textAlign: 'center',
  },
  chatArea: {
    padding: 16,
    paddingBottom: 50,
    flexGrow: 1,
    backgroundColor: colors.backgroundColor,
  },
  timestamp: {
    color: '#999',
    fontSize: 12,
    alignSelf: 'center',
    marginVertical: 10,
  },
  messageContainer: {
    maxWidth: '80%',
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
    ...Shadows.shadow3,
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
    paddingBottom: heightPixel(25),
    paddingTop: heightPixel(10),
    paddingHorizontal: widthPixel(15),
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: heightPixel(50),
    backgroundColor: colors.black,
    ...Shadows.shadow5,
    paddingVertical: 8,
    color: colors.white,
    paddingHorizontal: 12,
    borderRadius: 30,
  },
  sendButton: {
    backgroundColor: colors.activetab,
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
    // backgroundColor: '#EFEFF4',
    width: 50,
    height: heightPixel(30),
    bottom: 36,
    gap: 10,
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
