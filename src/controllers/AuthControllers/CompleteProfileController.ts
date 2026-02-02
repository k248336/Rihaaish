import { useState } from 'react';
import { AuthSchema } from '../../models';
import { useTranslation } from '../../utilities/translations';
import {
  navigate,
  pop,
  screens,
  strings,
  utility,
  replace,
} from '../../utilities';
import { useAppDispatch, useAppSelector, useToggle } from '../../hooks';
import {
  hideLoader,
  showLoader,
  updateProfile,
  updloadAttachment,
} from '../../redux/slices';
// removed incorrect replace import; using NavigationService.replace instead

const useCompleteProfileControllers = () => {
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector(state => state?.auth);
  const { t } = useTranslation();
  console.log(userInfo.user_type == 'instructor', '-----userInfo----');

  const [imgPickerModal, setImgPickerModal, togglePickerModal] = useToggle();
  const [image, setImage] = useState<string>('');
  const [imageRemoved, setImageRemoved] = useState<boolean>(false);

  const initialValues = {
    bio: '',
    country: '',
    city: '',
    location: '',
  };

  const handleCompleteProfile = async (values: any) => {
    // dispatch(showLoader());

    const payload = {
      bio: values.bio,
      country: values.country,
      city: values.city,
      location: values.location,
    } as any;

    replace(
      userInfo.user_type == 'instructor'
        ? screens.AddEducation
        : screens.preference,
    );

    //   if (image) {
    //     const selectedImage = {
    //       file: { uri: image, type: 'image/jpeg', name: 'image.jpg' },
    //       path: 'user',
    //     };

    //     const formData = new FormData();
    //     Object.entries(selectedImage).forEach(entry => {
    //       formData.append(entry[0], entry[1]);
    //     });

    //     updloadAttachment(formData)
    //       .then(res => {
    //         // console.log('updloadAttachment res: ', res);

    //         if (res?.length) {
    //           payload['image_url'] = res[0];
    //         }
    //         onUpdateProfile(payload);
    //       })
    //       .catch(err => {
    //         dispatch(hideLoader());
    //         utility.showAlertMessage('danger', strings.somethingWentWrong);
    //       });
    //   } else {
    //     if (imageRemoved) {
    //       payload['image_url'] = '';
    //     }
    //     onUpdateProfile(payload);
    //   }
    // };

    // const onUpdateProfile = async (payload: any) => {
    //   dispatch(updateProfile(payload))
    //     .unwrap()
    //     .then(res => {
    //       // console.log('updateProfile res: ', res);

    //       dispatch(hideLoader());
    //       utility.showAlertMessage('success', strings.profileUpdated);
    //       pop();
    //     })
    //     .catch(err => {
    //       dispatch(hideLoader());
    //     });
    // };
  };

  const navigateToScreen = (name: string) => {
    // navigate(name);
    navigate(
      userInfo.user_type == 'instructor'
        ? screens.AddEducation
        : screens.preference,
    );
  };

  return {
    values: {
      schema: AuthSchema(t).CompleteProfileSchema,
      initialValues: initialValues,
      imgPickerModal,
      image,
      userInfo,
    },
    functions: {
      handleCompleteProfile,
      navigateToScreen,
      togglePickerModal,
      setImgPickerModal,
      setImage: (val: string) => {
        setImage(val);
        setImageRemoved(false);
      },
      removeImage: () => {
        setImage('');
        setImageRemoved(true);
      },
    },
  };
};

export default useCompleteProfileControllers;
