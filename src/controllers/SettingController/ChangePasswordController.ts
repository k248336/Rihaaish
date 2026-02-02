import { useState } from 'react';
import { ChangePasswordSchema, InviteSchema } from '../../models';
import {
  goBack,
  navigate,
  pop,
  reset,
  screens,
  strings,
  utility,
} from '../../utilities';
import useToggle from '../../hooks/useToggle';
import {
  changePassword,
  hideLoader,
  showLoader,
  signup,
  updateProfile,
  updloadAttachment,
} from '../../redux/slices';
import { useDispatch, useSelector } from 'react-redux';
import useAppDispatch from '../../hooks/useAppDispatch';
import { RootState } from '../../interface';

const useChangePasswordController = () => {
  const [focused, setFocused, toggleFocused] = useToggle();
  const dispatch = useAppDispatch();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const initialvalues = {
    currentpassword: '',
    newpassword: '',
    confirmpassword: '',
  };

 

  const handleOnSubmit = async (values: {
    currentpassword: string;
    newpassword: string;
    confirmpassword: string;
  }) => {
    const payload = {
      current_password: values.currentpassword,
      new_password: values.newpassword,
      confirm_password: values.confirmpassword,
    };
    console.log(payload, '-----payloaddd-----');
    dispatch(showLoader());

    dispatch(changePassword(payload))
      .unwrap()
      .then((res: any) => {
        console.log('changePassword res: ', res);
        resetNavigation()
        dispatch(hideLoader());
        utility.showAlertMessage('success', res?.message);

      })
      .catch((err: any) => {
        dispatch(hideLoader());
      });


    // setTimeout(() => {
    //   goBack();
    //   // dispatch(hideLoader());
    // }, 2000);
  };
  // 116382067
 const resetNavigation = () => {
    reset(screens.mainStack);
    // reset(screens.bottomTabs);
  };

  const navigateToScreen = (name: string) => {
    navigate(name);
  };

  return {
    values: {
      schema: ChangePasswordSchema.ChangePasswordSchema,
      initialValues: initialvalues,
      focused,
      userInfo,
    },
    functions: {
      handleOnSubmit,
      navigateToScreen,
      setFocused,
      toggleFocused,
    },
  };
};

export default useChangePasswordController;
