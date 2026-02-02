import * as Yup from 'yup';
export const InviteSchema = {
  SendInviteSchema: Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
  }),
};
export const ChangePasswordSchema = {
  ChangePasswordSchema: Yup.object({
    currentpassword: Yup.string().required('Current password is required'),
    newpassword: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/, 'Password must contain at least one symbol')
    .required('Password is required'),
    confirmpassword: Yup.string()
    .oneOf([Yup.ref('newpassword')], 'Passwords must match')
    .required('Confirm password is required'),
  }),

};



