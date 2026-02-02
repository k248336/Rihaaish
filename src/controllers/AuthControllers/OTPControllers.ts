import { useState } from 'react';
import { useAppDispatch } from '../../hooks';
import { authInitialValues, AuthSchema } from '../../models';
import {
  sendOtp,
  hideLoader,
  showLoader,
  verifyOtpRegister,
  verifyOtpForgotPass,
} from '../../redux/slices';
import {
  reset,
  screens,
  strings,
  utility,
  replace,
  navigate,
  deviceType,
} from '../../utilities';

const useOTPControllers = () => {
  const dispatch = useAppDispatch();
  const [timer, setTimer] = useState('60');

  const handleonSubmit = async (
    isForgotPass: boolean,
    value: string,
    email: string,
  ) => {
    // dispatch(showLoader());

    var data = {
      email: email,
      otp: value,
      device_type: deviceType,
      device_token: '123123123',
    };

    // dispatch(isForgotPass ? verifyOtpForgotPass(data) : verifyOtpRegister(data))
    //   .unwrap()
    //   .then((res: any) => {
    //     console.log('verifyCode res: ', res);
    //     dispatch(hideLoader());

    if (isForgotPass) {
      // utility.showAlertMessage(
      //   'success',
      //   strings.otpVerifiedSuccessfully,
      //   3000,
      // );
      replace(screens.resetPass, { email: email });
    } else {
      // utility.showAlertMessage(
      //   'success',
      //   strings.otpVerifiedSuccessfully,
      //   3000,
      // );
      reset(screens.CompleteProfile);
    }
    // })
    // // .catch((err: any) => {
    // //   dispatch(hideLoader());
    // // });
  };

  const resendCode = async (email: string) => {
    // dispatch(showLoader());

    var data = {
      email: email,
    };

    // dispatch(sendOtp(data))
    // .unwrap()
    // .then(res => {
    // console.log('resendOtp res: ', res);
    // dispatch(hideLoader());
    // utility.showAlertMessage('success', res?.message);
    // })
    // .catch(err => {
    //   dispatch(hideLoader());
    // });
  };

  function _timer() {
    let count = 60;
    let interval = setInterval(function () {
      setTimer(count < 10 ? '0' + count.toString() : count.toString());
      if (count === 0) {
        clearInterval(interval);
        setTimer('00');
      }
      count--;
    }, 1000);
  }

  const onResendCode = (data: any) => {
    _timer();
    // resendCode(data);
  };

  const navigateToScreen = (name: string) => {
    navigate(name);
  };

  return {
    values: {
      timer: timer,
      schema: AuthSchema.LoginSchema,
      initialValues: authInitialValues.Login,
    },
    functions: {
      handleonSubmit,
      navigateToScreen,
      onResendCode,
      _timer,
    },
  };
};

export default useOTPControllers;
