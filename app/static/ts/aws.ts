import { CognitoUser, ISignUpResult } from 'amazon-cognito-identity-js';
import { Auth,Hub } from 'aws-amplify'
import 'amazon-cognito-js'
import Swal from 'sweetalert2'
Auth.configure({
  userPoolId: 'us-east-1_dqiapzBbr',
  userPoolWebClientId: '57a80fik1473v2up522vav7br2',
  oauth: {
    region: "us-east-1",
    domain: 'https://lineinthecloud.auth.us-east-1.amazoncognito.com',
    scope: ['email', 'openid', 'aws.cognito.signin.user.admin'],
    redirectSignIn: 'https://172.31.50.168:5000/login',
    redirectSignOut: 'https://172.31.50.168:5000/logout',
    responseType: 'code'
  }
})
function displayObject(data: any) {
  return Swal.fire({
    title: data && (data.message || data.title || ''),
    html: `<div class="text-danger" style="text-align:left">  ${JSON.stringify(data || {}, null, 6)
      .replace(/\n( *)/g, function (match, p1) {
        return '<br>' + '&nbsp;'.repeat(p1.length);
      })}</div>`
  })
}
function onLogout() {

  Auth.signOut().then(result => {
    setUserState(null);
  }).catch(err => {
    displayObject(err)
  })
}
function Login(){
  document.getElementById("login").addEventListener('click',function(){

  
  // @ts-ignore
    return Swal.fire({
  title: 'Login Form',
  html: `<form method="POST" required>`+`<input type="text" id="login" class="swal2-input" placeholder="Username">
  <input type="password" id="password" class="swal2-input" placeholder="Password">`+`<button class="swal2-input" onclick="ForgetPassword()">`+`<p>Forget Password?</p>`+`</button>`+`</form>`+`<button class="swal2-input" onClick="turnon()">`+`<i class="far fa-eye">`+`</i>`+`</button>`+`<div>`+`<button class="swal2-input" onclick="ongoogle()">`+`<i class="fab fa-google">`+`</i>`+`</button>`+`<button class="swal2-input">`+`<i class="fab fa-facebook-square">`+`</i>`+`</button>`+`</div>`,
  confirmButtonText: 'Sign in',
  focusConfirm: false,
  preConfirm: () => {
    let userdata={
      login = Swal.getPopup().querySelector('#login'),
     password = Swal.getPopup().querySelector('#password'),}
    if (!userdata.login){Swal.showValidationMessage(`請你輸入電子郵件<br>Please enter email`)}
    if (!userdata.password){Swal.showValidationMessage(`請你輸入密碼<br>Please enter password`)}
    if (!userdata.login && !userdata.password) {
      Swal.showValidationMessage(`請你輸入電子郵件及密碼<br>Please enter login and password`)
    }
}}).then((result,userdata.login,userdata.password)=>{
  if(result.isConfirmed){
    Auth.signIn(userdata.login.value,userdata.password.value).then(async (result: any) => {

    if (result.challengeName == 'SOFTWARE_TOKEN_MFA') {

      var verificationCode = prompt('Enter your TOTP token');

      Auth.confirmSignIn(result, verificationCode, 'SOFTWARE_TOKEN_MFA').then(confirmSigninResult => {
        getCurrentUser()
      })
        .catch(err => { displayObject(err); })
    }
    else {
      getCurrentUser()
    }
    toggleModal('login', false)

  }).catch(err => {
    if (err.code == "UserNotConfirmedException") {
      currentUserName = userData.username
      toggleModal('confirm', true)
    }
    else {
      displayObject(err)
    }
  }
  })}
  )

  });
}

function ForgetPassword(){
var usernameprompt = Swal.fire({html:`<input type="text" id="forgetlogin" class="swal2-input" placeholder="Enter your username:">`});
 // @ts-ignore
  Auth.forgotPassword(usernameprompt).then(result =>{
var renewcodeprompt = Swal.fire({html:`<input type="text" id="renewcode" class="swal2-input" placeholder="Enter your confirmation code:">`});
var newpasswordprompt = Swal.fire({html:`<input type="password" id="newpassword" class="swal2-input" placeholder="Enter your new password">`});
// @ts-ignore
    Auth.forgotPasswordSubmit(usernameprompt, renewcodeprompt, newpasswordprompt).then(confirationResult => {
      displayObject(confirationResult)
    })
      .catch(err => displayObject(err))
   })

    .catch(err => displayObject(err))
}



function setUserState(user: any) {
  var usernamePlaceholder = document.getElementById('username-placeholder');
  var loginButton = document.getElementById('login-button');
  var logoutButton = document.getElementById('logout-button');
  if (!user) {
    usernamePlaceholder.innerHTML = ''
    usernamePlaceholder.style.display = 'none'
    loginButton.style.display = 'block'
    logoutButton.style.display = 'none'
  }
  else {
    usernamePlaceholder.innerHTML = user.username
    usernamePlaceholder.style.display = 'block'
    loginButton.style.display = 'none'
    logoutButton.style.display = 'block'
  }
}

async function getCurrentUser(): Promise<CognitoUser> {
  try {

    var currentUser = <CognitoUser>(await Auth.currentAuthenticatedUser());
    console.log('getCurrentUser', currentUser);

    setUserState(currentUser)
    return currentUser
  }
  catch (err) {
    console.log('Error loading user', err);
    setUserState(null)
  }

}