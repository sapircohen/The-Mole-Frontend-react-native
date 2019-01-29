import {Facebook,Constants} from 'expo';
import firebase from 'firebase';

const permissions = ['public_profile','email'];

const loginAsync = async () =>{
    try {
        const {type,token } = await Facebook.logInWithReadPermissionsAsync(Constants.manifest.facebookAppId,{permissions});
        if (type ==="success") {
            console.log(token.authResponse)
            checkLoginState(token);
            return Promise.resolve(token);
        }
        return Promise.reject('no success');
    } catch (error) {
        return Promise.reject(error);
    }
}

const checkLoginState = (event) => {
    if (event) {
       console.log(event); 
      // User is signed-in Facebook.
      var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) =>{
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!isUserEqual(event, firebaseUser)) {
          // Build Firebase credential with the Facebook auth token.
          var credential = firebase.auth.FacebookAuthProvider.credential(
            event
        );
          // Sign in with the credential from the Facebook user.
          firebase.auth().signInAndRetrieveDataWithCredential(credential)
          .then((type)=>{
              console.log("user signed in" + type.user.uid)
              if (type.additionalUserInfo.isNewUser) {
                  firebase.database()
                  .ref('users/' + type.user.uid)
                  .set({
                      gmail:type.user.email,
                      profile_picture:type.additionalUserInfo.profile.picture,
                      locale:type.additionalUserInfo.profile.locale,
                      first_name:type.additionalUserInfo.profile.given_name,
                      last_name:type.additionalUserInfo.profile.family_name,
                      created_at:Date.now()
                  }).catch(error=>{console.log(error)})
              }else{
                firebase.database()
                .ref('users/' + type.user.uid)
                .update({
                    last_logged_in:Date.now()
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
          // User is already signed-in Firebase with the correct user.
          console.log('User already signed-in Firebase.');

        }
      });
    } else {
      // User is signed-out of Facebook.
      firebase.auth().signOut();
    }
  }

  const isUserEqual = (facebookAuthResponse, firebaseUser) =>{
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === firebase.auth.FacebookAuthProvider.PROVIDER_ID &&
            providerData[i].uid === facebookAuthResponse.userID) {
          // We don't need to re-auth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  }

export const FacebookApi = {
    loginAsync
}