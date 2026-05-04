import { useState } from 'react';
import { AuthSchema } from '../../models';
import { navigate, pop, strings, utility, sanitizeNameForApi } from '../../utilities';
import { useAppDispatch, useAppSelector, useToggle } from '../../hooks';
import {
  getProfile,
  hideLoader,
  showLoader,
  updateProfile,
} from '../../redux/slices';

const useEditProfileControllers = () => {
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector(state => state?.auth);

  const [imgPickerModal, setImgPickerModal, togglePickerModal] = useToggle();
  const [image, setImage] = useState<string>('');

  const initialValues = {
    email: userInfo?.email ?? '',
    firstname: userInfo?.firstname ?? '',
    lastname: userInfo?.lastname ?? '',
    mobile_no: userInfo?.mobile_no ?? '',
    bio: userInfo?.bio ?? '',
    dob: userInfo?.date_of_birth ?? '',
    location: '',
  };

  const handleEditProfile = async (values: typeof initialValues) => {
    dispatch(showLoader());

    const formData = new FormData();
    formData.append('first_name', sanitizeNameForApi(String(values.firstname ?? '')));
    formData.append('last_name', sanitizeNameForApi(String(values.lastname ?? '')));
    formData.append('phone', String(values.mobile_no ?? '').trim());
    formData.append('bio', String(values.bio ?? '').trim());
    formData.append('date_of_birth', String(values.dob ?? '').trim());

    if (image) {
      formData.append('avatar', {
        uri: image,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      } as any);
    }
    console.log(formData, 'formData');

    try {
      await dispatch(updateProfile(formData)).unwrap();
      await dispatch(getProfile()).unwrap();
      dispatch(hideLoader());
      utility.showAlertMessage('success', strings.profileUpdated);
      pop();
    } catch {
      dispatch(hideLoader());
    }
  };

  const navigateToScreen = (name: string) => {
    navigate(name);
  };

  return {
    values: {
      schema: AuthSchema.editProfileSchema,
      initialValues,
      imgPickerModal,
      image,
      userInfo,
    },
    functions: {
      handleEditProfile,
      navigateToScreen,
      togglePickerModal,
      setImgPickerModal,
      setImage,
    },
  };
};

export default useEditProfileControllers;
