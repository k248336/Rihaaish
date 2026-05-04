import { Keyboard } from 'react-native';
import { authInitialValues, AuthSchema } from '../../models';
import { getProfile, hideLoader, showLoader, signup } from '../../redux/slices';
import { useAppDispatch, useToggle } from '../../hooks';
import {
  screens,
  strings,
  utility,
  navigate,
  reset,
  sanitizeNameForApi,
} from '../../utilities';

const useSignUpController = () => {
  const dispatch = useAppDispatch();

  const [check, setCheck, toggle] = useToggle();

  const handleSignUp = async (values: any) => {
    if (!check) {
      return utility.showAlertMessage('danger', strings.agreeToTerms);
    }

    Keyboard.dismiss();
    dispatch(showLoader());

    const payload = new FormData();
    const username = String(values.username ?? '')
      .trim()
      .replace(/[^a-zA-Z0-9._-]/g, '_');
    payload.append('username', username || 'user');
    payload.append('email', String(values.email ?? '').trim());
    payload.append('password', String(values.password ?? ''));
    payload.append(
      'first_name',
      sanitizeNameForApi(String(values.firstname ?? '')),
    );
    payload.append('last_name', sanitizeNameForApi(String(values.lastname ?? '')));
    payload.append('phone', String(values.mobile_no ?? '').trim());
    console.log('payload: ', payload);

    dispatch(signup(payload))
      .unwrap()
      .then(async () => {
        try {
          await dispatch(getProfile()).unwrap();
        } catch {
        }
        dispatch(hideLoader());
        utility.showAlertMessage('success', strings.signupSuccess, 4000);
        reset(screens.bottomTabs);
      })
      .catch((err: any) => {
        dispatch(hideLoader());
        const fieldErrors = err?.data?.data ?? err?.response?.data?.data;
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
            utility.showAlertMessage('danger', messages.join('\n'));
            return;
          }
        }
        const msg =
          err?.data?.message ?? err?.message ?? 'Something went wrong';
        utility.showAlertMessage('danger', msg);
      });
  };

  const navigateToScreen = (name: string) => {
    navigate(name);
  };

  return {
    values: {
      schema: AuthSchema.SignupSchema,
      initialValues: authInitialValues.Signup,
      check,
    },
    functions: {
      handleSignUp,
      navigateToScreen,
      toggle,
    },
  };
};

export default useSignUpController;
