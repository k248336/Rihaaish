import {
  goBack,
  strings,
  utility,
} from '../../utilities';
import {
  changePassword,
  hideLoader,
  showLoader,
} from '../../redux/slices';
import useAppDispatch from '../../hooks/useAppDispatch';

const useChangePasswordController = () => {
  const dispatch = useAppDispatch();

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
    dispatch(showLoader());
    try {
      await dispatch(
        changePassword({
          old_password: values.currentpassword,
          new_password: values.newpassword,
        }),
      ).unwrap();
      utility.showAlertMessage(
        'success',
        strings.passwordChangedSuccess,
      );
      goBack();
    } catch {
      // checkError from postService
    } finally {
      dispatch(hideLoader());
    }
  };

  return {
    values: {
      initialValues: initialvalues,
      userInfo: {},
    },
    functions: {
      handleOnSubmit,
    },
  };
};

export default useChangePasswordController;
