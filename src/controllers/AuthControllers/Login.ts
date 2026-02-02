import { Keyboard } from 'react-native';
import useAppDispatch from '../../hooks/useAppDispatch';
import { authInitialValues, AuthSchema } from '../../models';
import { useTranslation } from '../../utilities/translations';
import {
  hideLoader,
  login,
  selectSavedCredentials,
  setCredentials,
  showLoader,
  sociaLogin,
} from '../../redux/slices';
import {
  reset,
  screens,
  strings,
  utility,
  navigate,
  deviceType,
} from '../../utilities';
import useToggle from '../../hooks/useToggle';
import useAppSelector from '../../hooks/useAppSelector';

const useLoginController = () => {
  const dispatch = useAppDispatch();
  // const [check, setCheck, toggle] = useToggle(false);
  const savedCredentials = useAppSelector(selectSavedCredentials);
  const { t } = useTranslation();
  const [check, setCheck, toggle] = useToggle();

  console.log('savedCredentials: ', savedCredentials);

  const [isRemember, setRemember, toggleRemember] = useToggle(
    savedCredentials.checked,
  );

  const handleSignIn = async (values: { email: string; password: string }) => {
    // dispatch(showLoader());
    Keyboard.dismiss();

    const payload = {
      email: values.email,
      password: values.password,
      device_type: deviceType,
      device_token: '1234567890',
    };
    reset(screens.bottomTabs);

    // dispatch(login(payload))
    //   .unwrap()
    //   .then(res => {
    //     console.log('login res: ', res);
    //     utility.showAlertMessage('success', strings.userLogin, 4000);
    //     console.log('isRemember: ', isRemember);
    //     if (isRemember) {
    //       dispatch(
    //         setCredentials({
    //           email: values.email,
    //           password: values.password,
    //           checked: true,
    //         }),
    //       );
    //     } else {
    //       dispatch(
    //         setCredentials({
    //           email: '',
    //           password: '',
    //           checked: false,
    //         }),
    //       );
    //     }
    //     dispatch(hideLoader());
    //     resetNavigation();
    //   })
    //   .catch(err => {
    //     console.log(err.code, 'err?.data?.code');
    //     dispatch(hideLoader());

    //     if (err.code == 428) {
    //       utility.showAlertMessage(
    //         'warning',
    //         strings.emailOrPhoneNotVerified,
    //         4000,
    //       );
    //       navigate(screens.otpVerification, { email: err?.data?.email });
    //     }
    //   });
  };

  const handleSocialLogin = async (res: any, type: any) => {
    // dispatch(showLoader());

    var data = {
      email: res?.email,
      platform_type: type,
      platform_id: res?.uid,
      device_type: deviceType,
      device_token: '123123123',
      name: res?.givenName || res?.displayName,
      // deviceToken: await getFcmToken(),
    };

    dispatch(sociaLogin(data))
      .unwrap()
      .then(res => {
        console.log('sociaLogin res: ', res);
        utility.showAlertMessage('success', strings.userLogin, 4000);

        // dispatch(hideLoader());
        resetNavigation();
      })
      .catch(err => {
        console.log('sociaLogin err: ', err);

        // dispatch(hideLoader());
      });
  };

  const resetNavigation = () => {
    reset(screens.mainStack);
    // reset(screens.bottomTabs);
  };

  const navigateToScreen = (name: string) => {
    navigate(name);
  };

  return {
    values: {
      // schema: AuthSchema(t).LoginSchema,
      // initialValues: authInitialvalues.Login,
      initialValues: {
        ...authInitialValues.Login,
        ...(savedCredentials.checked
          ? {
              email: savedCredentials.email,
              password: savedCredentials.password,
            }
          : {}),
      },
      isRemember,
      check,

    },
    functions: {
      handleSignIn,
      navigateToScreen,
      handleSocialLogin,
      setRemember,
      toggleRemember,
      toggle,
    },
  };
};

export default useLoginController;
