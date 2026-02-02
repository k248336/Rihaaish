import { useState } from 'react';
import { AuthSchema } from '../../models';
import { navigate, pop, strings, utility } from '../../utilities';
import { useAppDispatch, useAppSelector, useToggle } from '../../hooks';
import {
  hideLoader,
  showLoader,
  updateProfile,
  updloadAttachment,
} from '../../redux/slices';

const useEditProfileControllers = () => {
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector(state => state?.auth);

  const [imgPickerModal, setImgPickerModal, togglePickerModal] = useToggle();
  const [image, setImage] = useState<string>('');

  const initialValues = {
    email: userInfo?.email,
    firstname: userInfo?.firstname,
    lastname: userInfo?.lastname,
    mobile_no: userInfo?.mobile_no,
  };

  const handleEditProfile = async (values: any) => {
    dispatch(showLoader());

    const payload = {
      firstname: values.firstname,
      lastname: values.lastname,
    } as any;

    if (image) {
      const selectedImage = {
        file: { uri: image, type: 'image/jpeg', name: 'image.jpg' },
        path: 'user',
      };

      const formData = new FormData();
      Object.entries(selectedImage).forEach(entry => {
        formData.append(entry[0], entry[1]);
      });

      updloadAttachment(formData)
        .then(res => {
          // console.log('updloadAttachment res: ', res);

          if (res?.length) {
            payload['image_url'] = res[0];
          }
          onUpdateProfile(payload);
        })
        .catch(err => {
          dispatch(hideLoader());
          utility.showAlertMessage('danger', strings.somethingWentWrong);
        });
    } else {
      onUpdateProfile(payload);
    }
  };

  const onUpdateProfile = async (payload: any) => {
    dispatch(updateProfile(payload))
      .unwrap()
      .then(res => {
        // console.log('updateProfile res: ', res);

        dispatch(hideLoader());
        utility.showAlertMessage('success', strings.profileUpdated);
        pop();
      })
      .catch(err => {
        dispatch(hideLoader());
      });
  };

  const navigateToScreen = (name: string) => {
    navigate(name);
  };

  return {
    values: {
      schema: AuthSchema.editProfileSchema,
      initialValues: initialValues,
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
