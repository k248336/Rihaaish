import {
  Alert,
  Linking,
  Platform,
  I18nManager,
  AlertButton,
  PermissionsAndroid,
} from 'react-native';
import moment from 'moment';
// import Clipboard from '@react-native-clipboard/clipboard';
import { showMessage, MessageType } from 'react-native-flash-message';
// import { colors } from './constants';
// import Share from 'react-native-share';

class Utility {
  isRTL: boolean = I18nManager.isRTL;
  isPlatformIOS: boolean = Platform.OS === 'ios';
  isPlatformAndroid: boolean = Platform.OS === 'android';

  validateEmail = (str: string): boolean => {
    const regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regExp.test(str);
  };

  validatePassword = (str: string): boolean => {
    const regExp =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regExp.test(str);
  };

  checkValidation = (arr: any[]): boolean => {
    return arr.some(i => i === '' || i === null || i === undefined);
  };

  isEmpty = (value: any): boolean => {
    if (value === null || value === undefined) return true;

    if (typeof value === 'string' && value.trim() === '') return true;

    if (Array.isArray(value) && value.length === 0) return true;

    if (typeof value === 'object' && !Array.isArray(value)) {
      return Object.keys(value).length === 0;
    }

    return false;
  };

  copyToClipboard = (text: string, msg: string) => {
    Clipboard.setString(text);
    this.showAlertMessage('success', msg);
  };

  showMsg = (type: MessageType, msg: string) => ({
    type,
    message: msg,
    duration: 3000,
    backgroundColor: 'red',
    icon: { icon: 'auto', position: 'left' },
  });

  showAlertMessage = (
    type: MessageType,
    msg: string,
    duration?: number,
    style?: object,
  ): void => {
    showMessage({
      type,
      style,
      message: msg || '',
      duration: duration || 3000,
      icon: { icon: 'auto', position: 'left' } as any,
      backgroundColor: type === 'success' ? 'green' : 'red',
    });
  };

  showAlert(
    title: string,
    message: string,
    doneText: string,
    onDonePress?: () => void,
    cancelText?: string,
    onCancelPress?: () => void,
  ): void {
    const buttons: AlertButton[] = [
      {
        text: cancelText || 'Cancel',
        onPress: () => onCancelPress?.(),
        style: 'cancel',
      },
      { text: doneText, onPress: () => onDonePress?.() },
    ];

    Alert.alert(title, message, buttons, { cancelable: true });
  }

  requestPermissions = async (): Promise<void> => {
    if (this.isPlatformAndroid) {
      try {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        ]);
      } catch (err) {
        console.log('permissions error: ', err);
      }
    }
  };

  requestNotificationPermission = async (): Promise<boolean> => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.log('permissions error: ', err);
      return false;
    }
  };

  onShare = async (url: string, title: string, msg: string) => {
    const shareOptions = {
      url: url,
      title: title,
      message: msg,
    };

    try {
      await Share.open(shareOptions);
    } catch (error: any) {
      console.log('share error: ', error.message);
    }
  };

  checkError = (api: string, error: any) => {
    console.log(`${api} error: `, JSON.stringify(error.response || error));

    const responseData = error.response?.data ?? error.data;
    let showError: string =
      responseData?.message ?? error.message ?? 'Something went wrong';

    // Extract field-level errors from nested `data` object
    // e.g. { message: "Invalid data", data: { username: ["A user with that username already exists."] } }
    const fieldErrors = responseData?.data;
    if (
      fieldErrors &&
      typeof fieldErrors === 'object' &&
      !Array.isArray(fieldErrors)
    ) {
      const messages: string[] = [];
      Object.values(fieldErrors).forEach((val: any) => {
        if (Array.isArray(val)) {
          val.forEach((v: any) => messages.push(String(v)));
        } else if (typeof val === 'string') {
          messages.push(val);
        }
      });
      if (messages.length > 0) {
        showError = messages.join('\n');
      }
    }

    console.log('showError ===>', showError);
    this.showAlertMessage('danger', showError);
    return error.response;
  };

  // refreshControl = (refreshing: boolean, onRefresh: () => void) => {
  //   return (
  //     <RefreshControl
  //       refreshing={refreshing}
  //       onRefresh={onRefresh}
  //       title="Pull to Refresh"
  //       titleColor={colors.primary}
  //       tintColor={colors.primary}
  //       colors={[colors.white]}
  //       progressBackgroundColor={colors.primary}
  //     />
  //   );
  // };

  formatDate = (date: string | Date): string => {
    return moment(date).format('DD MMM, YYYY');
  };

  getDayLabel = (_date: string | Date): string => {
    const now = moment();
    const yesterday = moment().subtract(1, 'day');

    if (moment(_date).isSame(now, 'day')) {
      return 'Today';
    } else if (moment(_date).isSame(yesterday, 'day')) {
      return 'Yesterday';
    } else if (now.isoWeek() === moment(_date).isoWeek()) {
      return moment(_date).format('dddd');
    } else {
      return moment(_date).format('DD MMM YYYY');
    }
  };

  getTimeDiff = (_date: string | Date): string => {
    const now = moment();
    const daysInMonth = moment(_date).daysInMonth();

    const minutesDiff = now.diff(_date, 'minutes');
    const hoursDiff = now.diff(_date, 'hours');
    const daysDiff = now.diff(_date, 'days');
    const monthsDiff = now.diff(_date, 'months');
    const yearsDiff = now.diff(_date, 'years');

    if (minutesDiff < 60) {
      return `${minutesDiff || 1} m`;
    } else if (hoursDiff < 24) {
      return `${hoursDiff || 1} h`;
    } else if (daysDiff < daysInMonth) {
      return `${daysDiff || 1} d`;
    } else if (monthsDiff < 12) {
      return `${monthsDiff || 1} mos`;
    } else {
      return `${yearsDiff || 1} y`;
    }
  };

  openDialer = (phoneNumber: string): void => {
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url).catch(err =>
      console.log('Error opening dialer: ', err),
    );
  };

  openMail = (mail: string): void => {
    const url = `mailto:${mail}`;
    Linking.openURL(url).catch(err => console.log('Error opening mail: ', err));
  };

  openSettings = (): void => {
    Linking.openSettings();
  };
}

export default new Utility();
