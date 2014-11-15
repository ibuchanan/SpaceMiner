Meteor.startup(function () {
  AccountsEntry.config({
    homeRoute: '/home',                    // mandatory - path to redirect to after sign-out
    dashboardRoute: '/home',      // mandatory - path to redirect to after successful sign-in
    profileRoute: 'profile',
    passwordSignupFields: 'EMAIL_ONLY',
    showOtherLoginServices: true,      // Set to false to hide oauth login buttons on the signin/signup pages. Useful if you are using something like accounts-meld or want to oauth for api access
    extraSignUpFields: [{                             // Add extra signup fields on the signup page
      field: "firstName",                             // The database property you want to store the data in
      name: "",                                       // An initial value for the field, if you want one
      label: "First Name",                      // The html lable for the field
      placeholder: "Ninja",                 // A placeholder for the field
      type: "text",                            // The type of field you want
      required: true                           // Adds html 5 required property if true
    }, {
      field: 'lastName',
      name: '',
      label: 'Last Name',
      placeholder: 'Coder',
      type: 'text',
      required: true
    }, {
      field: 'nickName',
      name: '',
      label: 'Nick Name',
      placeholder: 'KrazyKoder',
      type: 'text',
      required: true
    }                         
  ]
  });
});