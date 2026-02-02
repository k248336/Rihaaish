import * as Yup from 'yup';

export const AuthSchema = {
  LoginSchema: Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  }),
  SignupSchema: Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters long')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[^A-Za-z0-9]/, 'Password must contain at least one symbol')
      .required('Password is required'),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
    firstname: Yup.string().required('First name is required'),
    lastname: Yup.string().required('Last name is required'),
    mobile_no: Yup.string().required('Phone is required'),
  }),
  CompleteProfileSchema: Yup.object().shape({
    bio: Yup.string().required('Bio is required'),
    country: Yup.string().required('Country is required'),
    city: Yup.string().required('City is required'),
    location: Yup.string().required('Location is required'),
  }),
  editProfileSchema: Yup.object().shape({
    firstname: Yup.string().required('First name is required'),
    lastname: Yup.string().required('Last name is required'),
  }),
};

export const authInitialValues = {
  Login: {
    email: __DEV__ ? 'james@yopmail.com' : '',
    password: __DEV__ ? 'Test@123' : '',
  },
  Signup: {
    email: '',
    password: '',
    confirm_password: '',
    firstname: '',
    lastname: '',
    mobile_no: '',
  },
  CompleteProfile: {
    bio: '',
    country: '',
    city: '',
    location: '',
  },
};
