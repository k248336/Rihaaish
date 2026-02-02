import React, { FC } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { getAppStyles, icons, navigate, screens } from '../utilities';
import { markReadNotification } from '../redux/slices';
import { heightPixel } from '../utilities/helpers';
import { INotificationCard } from '../interface';
import { useAppDispatch, useTheme } from '../hooks';
import CustomText from './CustomText';
import moment from 'moment';

const NotificationCard: FC<INotificationCard> = ({ item, lastItem }) => {
  const dispatch = useAppDispatch();

  const onPressNotification = () => {
    if (!item.is_read) {
      dispatch(markReadNotification(item.id));
    }

    switch (item?.type) {
      case 'FAMILY_GROUP_INVITATION':
        navigate(screens.inviteRequests);
        break;
      case 'GROUP_MEMBER_INVITATION_ACCEPTED':
        navigate(screens.viewTournament, {
          isFamilyGroup: true,
          groupID: item?.payload?.ref_id,
        });
        break;
      case 'GROUP_MEMBER_INVITATION_REJECTED':
        navigate(screens.viewTournament, {
          isFamilyGroup: true,
          groupID: item?.payload?.ref_id,
        });
        break;
      case 'LEADERBOARD_PUBLISHED':
        navigate(screens.viewTournament, {
          status: 'ended',
          tournament: { id: item?.payload?.ref_id },
        });
        break;
      default:
        break;
    }
  };
  const { colors, isDarkMode } = useTheme();
  const appStyles = getAppStyles(isDarkMode);

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.9}
        style={[dynamicStyles(colors).container]}
        onPress={onPressNotification}
      >
        <View style={[dynamicStyles(colors).iconView]}>
          <Image
            resizeMode="contain"
            source={icons.crownIcon}
            style={dynamicStyles(colors).iconStyle}
          />
        </View>

        <View style={dynamicStyles(colors).content}>
          <CustomText
            fontSize={14}
            weight="bold"
            // numberOfLines={1}
            color={colors.white}
          >
            {item.title}
          </CustomText>

          <CustomText
            fontSize={11}
            weight="regular"
            color={colors.white}
            style={{ marginTop: heightPixel(2) }}
          >
            {item.message}
          </CustomText>
        </View>

        <CustomText fontSize={10} color={colors.white} weight="regular">
          {moment(item?.created_at).format('hh:mm a')}
        </CustomText>

        {!item.is_read && <View style={dynamicStyles(colors).badgeIndicator} />}
      </TouchableOpacity>

      {!lastItem && <View style={appStyles.lineSeparator} />}
    </>
  );
};
const dynamicStyles = (colors: any) =>
  StyleSheet.create({
  container: {
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginHorizontal: 15,
    justifyContent: 'center',
  },
  textStyle: {
    lineHeight: 16,
    marginVertical: 8,
    color: colors.gray,
  },
  timeStyle: {
    alignSelf: 'flex-end',
    color: colors.gray,
  },
  badgeIndicator: {
    top: 5,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 8,
    position: 'absolute',
    backgroundColor: colors.primary,
  },
  iconView: {
    width: heightPixel(60),
    height: heightPixel(60),
    borderRadius: heightPixel(60),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.darkCharcoal,
  },
  iconStyle: {
    width: heightPixel(28),
    height: heightPixel(28),
  },
  imgStyle: {
    width: 46,
    height: 46,
    borderRadius: 8,
  },
});

export default NotificationCard;
