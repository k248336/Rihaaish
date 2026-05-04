import { useEffect, useRef, useState } from 'react';
import { Keyboard } from 'react-native';
import useAppDispatch from '../../hooks/useAppDispatch';
import { authInitialValues, AuthSchema } from '../../models';
import { useTranslation } from '../../utilities/translations';
import {
  getProfile,
  hideLoader,
  login,
  selectSavedCredentials,
  setCredentials,
  showLoader,
  sociaLogin,
} from '../../redux/slices';
import { reset, screens, strings, navigate, deviceType } from '../../utilities';
import useToggle from '../../hooks/useToggle';
import useAppSelector from '../../hooks/useAppSelector';

const getLoginErrorMessage = (err: any, fallback: string): string => {
  const fieldErrors = err?.data?.data ?? err?.data;
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
      return messages.join('\n');
    }
  }
  if (typeof err?.message === 'string' && err.message.trim()) {
    return err.message;
  }
  return fallback;
};

/** Map common API “invalid … credential” text to a friendly, translated string. */
const mapToFriendlyLoginError = (raw: string, friendly: string): string => {
  const s = String(raw).trim();
  if (!s) {
    return friendly;
  }
  if (
    /invalid\s*credentials?|invalid\s*email|incorrect\s*password|wrong\s*password|email\s*(or|\/)\s*password|unauthori[sz]ed|unauthenticated|login\s*failed|authentication\s*failed|not\s*match|does\s*not\s*match|invalid\s*login|wrong\s*login|credential(s)?\s*invalid/i.test(
      s,
    )
  ) {
    return friendly;
  }
  return s;
};

const useLoginController = () => {
  const dispatch = useAppDispatch();
  // const [check, setCheck, toggle] = useToggle(false);
  const savedCredentials = useAppSelector(selectSavedCredentials);
  const { t } = useTranslation();
  const [check, setCheck, toggle] = useToggle();

  const [loginErrorModal, setLoginErrorModal] = useState<{
    visible: boolean;
    message: string;
    mode: 'success' | 'error' | 'verify';
    verifyEmail?: string;
  }>({ visible: false, message: '', mode: 'error' });
  const loginErrorModalRef = useRef(loginErrorModal);
  loginErrorModalRef.current = loginErrorModal;
  const successNavTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  console.log('savedCredentials: ', savedCredentials);

  const [isRemember, setRemember, toggleRemember] = useToggle(
    savedCredentials.checked,
  );

  useEffect(() => {
    return () => {
      if (successNavTimerRef.current) {
        clearTimeout(successNavTimerRef.current);
      }
    };
  }, []);

  const handleSignIn = async (values: { email: string; password: string }) => {
    dispatch(showLoader());
    Keyboard.dismiss();

    const payload = {
      email: values.email,
      password: values.password,
    };

    dispatch(login(payload))
      .unwrap()
      .then(async res => {
        try {
          console.log(
            '[Rihaish][login] unwrap success:',
            JSON.stringify(res, null, 2),
          );
        } catch {
          console.log('[Rihaish][login] unwrap success:', res);
        }
        try {
          await dispatch(getProfile()).unwrap();
        } catch {
        }
        if (isRemember) {
          dispatch(
            setCredentials({
              email: values.email,
              password: values.password,
              checked: true,
            }),
          );
        } else {
          dispatch(
            setCredentials({
              email: '',
              password: '',
              checked: false,
            }),
          );
        }
        dispatch(hideLoader());
        setLoginErrorModal({
          visible: true,
          message: t('loginSuccessMessage'),
          mode: 'success',
        });
        if (successNavTimerRef.current) {
          clearTimeout(successNavTimerRef.current);
        }
        successNavTimerRef.current = setTimeout(() => {
          setLoginErrorModal(m => ({ ...m, visible: false }));
          setTimeout(() => {
            reset(screens.bottomTabs);
            successNavTimerRef.current = null;
          }, 350);
        }, 1700);
      })
      .catch((err: any) => {
        try {
          console.log(
            '[Rihaish][login] unwrap rejected:',
            JSON.stringify(err, null, 2),
          );
        } catch {
          console.log('[Rihaish][login] unwrap rejected:', err);
        }
        dispatch(hideLoader());
        if (err?.code === 428) {
          setLoginErrorModal({
            visible: true,
            message: strings.emailOrPhoneNotVerified,
            mode: 'verify',
            verifyEmail: err?.data?.email,
          });
          return;
        }
        const rawMsg = getLoginErrorMessage(err, strings.somethingWentWrong);
        setLoginErrorModal({
          visible: true,
          message: mapToFriendlyLoginError(rawMsg, t('loginWrongCredentials')),
          mode: 'error',
        });
      });
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

  const hideLoginErrorModal = () => {
    setLoginErrorModal(m => ({ ...m, visible: false }));
  };

  const onLoginErrorButtonPress = () => {
    const m = loginErrorModalRef.current;
    if (m.mode === 'verify' && m.verifyEmail) {
      navigate(screens.otpVerification, { email: m.verifyEmail });
    }
    setLoginErrorModal(s => ({ ...s, visible: false }));
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
      hideLoginErrorModal,
      onLoginErrorButtonPress,
    },
    loginErrorModal,
    loginErrorT: {
      alertTitle: t('alertTitle'),
      successTitle: t('successTitle'),
      ok: t('ok'),
      continueLabel: t('continue'),
    },
  };
};

export default useLoginController;
