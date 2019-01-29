import {Google, Constants} from 'expo';
import firebase from 'firebase';

const scopes = ['profile','email'];

const loginAsync = async ()=>{
    try {
        const result = await Google.logInAsync({
            androidClientId:Constants.manifest.extra.googleAppId.android,
            iosClientId: Constants.manifest.extra.googleAppId.ios,
            scopes
        })
        if (result.type ==="success") {
            onSignIn(result);
            return Promise.resolve(result.accessToken);
        }
        return Promise.reject('Not able to log into google acount');
    } catch (error) {
        return Promise.reject(error);
    }
}

const onSignIn = (googleUser) => {
    console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) =>{
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
        );
        // Sign in with credential from the Google user.
        firebase.auth()
        .signInAndRetrieveDataWithCredential(credential)
        .then((result)=>{
          console.log("user signed in");
          if (result.additionalUserInfo.isNewUser) {
            firebase.database()
            .ref('/users/'+result.user.uid)
            .set({
                gmail: result.user.email,
                profile_picture: result.additionalUserInfo.profile.picture,
                locale:result.additionalUserInfo.profile.locale,
                first_name: result.additionalUserInfo.profile.given_name,
                last_name:result.additionalUserInfo.profile.family_name,
                created_at:Date.now
            })
            .then((snapshot)=>{
                //console.log('snapshot',snapshot)
            })
          }else{
            firebase.database()
            .ref('/users/'+result.user.uid)
            .update({
                last_logged_in: Date.now()
            })
          }
        })
        .catch((error) =>{
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
        });
      } else {
        console.log('User already signed-in Firebase.');
      }
    });
  }

  const  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
            providerData[i].uid === googleUser.getBasicProfile().getId()) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  }


export const GoogleApi = {loginAsync,onSignIn};