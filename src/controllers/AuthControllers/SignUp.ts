import { authInitialValues, AuthSchema } from '../../models';
import { useTranslation } from '../../utilities/translations';
import { hideLoader, showLoader, signup } from '../../redux/slices';
import { useAppDispatch, useToggle } from '../../hooks';
import {
  screens,
  strings,
  utility,
  navigate,
  deviceType,
} from '../../utilities';

const useSignUpController = () => {
  const dispatch = useAppDispatch();

  const [check, setCheck, toggle] = useToggle();
  const { t } = useTranslation();

  const handleSignUp = async (values: any) => {
    // utility.showAlertMessage('success', strings.verifyYourEmail, 4000);
    navigate(screens.otpVerification, {
      email: values.email,
    });
    // if (!check) {
    //   return utility.showAlertMessage('danger', strings.agreeToTerms);
    // }

    // dispatch(showLoader());

    // const payload = {
    //   email: values.email,
    //   password: values.password,
    //   confirm_password: values.confirm_password,
    //   firstname: values.firstname,
    //   lastname: values.lastname,
    //   mobile_no: values.mobile_no,
    //   device_type: deviceType,
    //   device_token: '123123123',
    // };

    // dispatch(signup(payload))
    // .unwrap()
    // .then(res => {
    // console.log('signup res: ', res);

    // dispatch(hideLoader());
    // utility.showAlertMessage('success', strings.verifyYourEmail, 4000);
    // navigate(screens.otpVerification, {
    //   email: values.email,
    // });
    // })
    // .catch(err => {
    // dispatch(hideLoader());
    // });
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
