import auth from '@react-native-firebase/auth';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {
  statusCodes,
  GoogleSignin,
} from '@react-native-google-signin/google-signin';
import {strings} from './strings';
import utility from './utility';

GoogleSignin.configure({
  webClientId:
    '82518889087-vlvg1jfbdr78g4isjn534ahbmd4q13er.apps.googleusercontent.com',
});

class SocialLoginHelpers {
  _googleLogin = async (onSuccess: (user: any, provider: string) => void) => {
    try {
      await GoogleSignin.signOut();

      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      // Get the users ID token
      const {data} = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(
        data?.idToken as string,
      );

      // Sign-in the user with the credential
      return auth()
        .signInWithCredential(googleCredential)
        .then(res => {
          // console.log('google login res: ', JSON.stringify(res));
          onSuccess(res?.user, 'google');
        })
        .catch(err => console.log('google login error: ', err));
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Google SIGN_IN_CANCELLED');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Google SIGN_IN_PROGRESS');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Google PLAY_SERVICES_NOT_AVAILABLE');
      } else {
        console.log('Google error: ', error);
      }
    }
  };

  _facebookLogin = async onSuccess => {
    // if (Platform.OS === 'android') {
    //   LoginManager.setLoginBehavior('web_only');
    // }

    // const result = await LoginManager.logInWithPermissions([
    //   'public_profile',
    // ]).then(
    //   function (result) {
    //     console.log('result ====>', result);
    //     if (result.isCancelled) {
    //       console.log('Login cancelled');
    //     } else {
    //       console.log(
    //         'Login success with permissions: ' +
    //           result.grantedPermissions?.toString(),
    //       );
    //     }
    //   },
    //   function (error) {
    //     console.log('Login fail with error: ' + error);
    //   },
    // );

    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);
    console.log('result result result result result result ====>', result);

    if (result.isCancelled) {
      console.log('User cancelled the login process');
      return;
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      console.log('Something went wrong obtaining access token');
      return;
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data?.accessToken,
    );

    // Sign-in the user with the credential
    return auth()
      .signInWithCredential(facebookCredential)
      .then(res => {
        // console.log('facebook login response: ', JSON.stringify(res));
        onSuccess(res?.user, 'facebook');
      })
      .catch(err => {
        console.log('facebook login error: ', err);

        if (err?.code == 'auth/account-exists-with-different-credential') {
          utility.showAlertMessage(
            'warning',
            strings.accountAlreadyRegistered,
            4000,
          );
        }
      });
  };

  _appleLogin = async (onSuccess: (user: any, provider: string) => void) => {
    // Start the sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    console.log('appleAuthRequestResponse   ====>', appleAuthRequestResponse);

    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      console.log('Apple Sign-In failed - no identify token returned');
      return;
    }

    // Create a Firebase credential from the response
    const {identityToken, nonce} = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );
    console.log('appleCredential   ====>', appleCredential);
    // Sign the user in with the credential
    return auth()
      .signInWithCredential(appleCredential)
      .then(res => {
        console.log('apple login response: ', res);

        const {fullName} = appleAuthRequestResponse;
        const displayName = fullName?.givenName
          ? `${fullName?.givenName} ${fullName?.familyName}`
          : '';

        let user = res?.user;
        (user as any).givenName = displayName;

        if (displayName != '') {
          user?.updateProfile({displayName});
        }

        onSuccess(user, 'apple');
      })
      .catch(err => console.log('apple login error: ', err));
  };

  _googleLogout = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {
      console.log('_googleLogout error: ', error);
      return;
    }
  };

  _facebookLogout = async () => {
    try {
      await LoginManager.logOut();
    } catch (error) {
      console.log('_facebookLogout error: ', error);
      return;
    }
  };
}

export default new SocialLoginHelpers();
