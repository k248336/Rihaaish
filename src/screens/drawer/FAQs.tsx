// AccordionScreen.js

import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  Image,
} from 'react-native';
import { colors, DATA, icons, utility } from '../../utilities';
import { CustomFlatlist, CustomScrollView, CustomText } from '../../components';
import { heightPixel } from '../../utilities/helpers';
import { SafeAreaView } from 'react-native-safe-area-context';
import Shadows from '../../utilities/Shadows';
// import { useAppSelector } from '../../hooks';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Faqs = () => {
  const [expandedId, setExpandedId] = useState(null);
  // const { faqs } = useAppSelector(state => state?.auth);

  const toggleExpand = id => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const renderItem = ({ item }) => {
    const isExpanded = expandedId === item.id;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => toggleExpand(item.id)}
        style={styles.card}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={styles.row}>
            <CustomText
              weight="semibold"
              style={{ maxWidth: 280 }}
              fontSize={heightPixel(12)}
            >
              {item.question}
            </CustomText>
          </View>
          <Image
            resizeMode="contain"
            style={{
              height: isExpanded ? 12 : 20,
              width: isExpanded ? 12 : 20,
            }}
            source={isExpanded ? icons.arrowDown : icons.next}
          />
        </View>

        {isExpanded && item.answer && (
          <CustomText fontSize={heightPixel(10)} color={'#565656'}>
            {item.answer}
          </CustomText>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <CustomScrollView>
      <CustomFlatlist
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </CustomScrollView>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: colors.textfieldcolor,
    flexGrow: 1,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 40,
    ...Shadows.shadow3,
    padding: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    // backgroundColor:'red',
    alignItems: 'center',
  },
  question: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 10,
  },
  answer: {
    marginTop: 12,
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
  HeadingcontainerStyle: {
    marginBottom: 20,
    marginTop: heightPixel(utility.isPlatformIOS ? 10 : 20),
    gap: 10,
  },
});

export default Faqs;
