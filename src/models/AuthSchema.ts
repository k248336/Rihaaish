import * as Yup from 'yup';

/** Letters (any script) and spaces only — no digits or punctuation. */
const nameShape = Yup.string()
  .transform((v: string | undefined) => {
    if (typeof v !== 'string') {
      return '';
    }
    return v.replace(/\s+/g, ' ').trim();
  })
  .max(150, 'Name is too long')
  .matches(/^[\p{L} ]+$/u, {
    message: 'Only letters and spaces are allowed',
    excludeEmptyString: true,
  });

export const AuthSchema = {
  LoginSchema: Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  }),
  SignupSchema: Yup.object({
    username: Yup.string()
      .trim()
      .min(3, 'Username must be at least 3 characters')
      .max(150, 'Username is too long')
      .matches(
        /^[a-zA-Z0-9._-]+$/,
        'Use only letters, numbers, dots, underscores or hyphens',
      )
      .required('Username is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters long')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[^A-Za-z0-9]/, 'Password must contain at least one symbol')
      .required('Password is required'),
    // confirm_password: Yup.string()
    //   .oneOf([Yup.ref('password')], 'Passwords must match')
    //   .required('Confirm password is required'),
    firstname: nameShape.required('First name is required'),
    lastname: nameShape.required('Last name is required'),
    mobile_no: Yup.string().required('Phone is required'),
  }),
  CompleteProfileSchema: Yup.object().shape({
    bio: Yup.string().required('Bio is required'),
    country: Yup.string().required('Country is required'),
    city: Yup.string().required('City is required'),
    location: Yup.string().required('Location is required'),
  }),
  editProfileSchema: Yup.object().shape({
    firstname: nameShape.required('First name is required'),
    lastname: nameShape.required('Last name is required'),
    mobile_no: Yup.string().required('Phone is required'),
    bio: Yup.string().max(2000).optional(),
  }),
};

export const authInitialValues = {
  Login: {
    email: __DEV__ ? 'mubashir@gmail.com' : '',
    password: __DEV__ ? 'Abcd@1234' : '',
  },
  Signup: {
    username: '',
    email: '',
    password: '',
    // confirm_password: '',
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
