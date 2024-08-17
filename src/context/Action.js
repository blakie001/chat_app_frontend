export const LoginStart = (userCredentials) => ({
  type: "LOGIN_START",
});

export const LoginSuccess = (token) => ({
  type: "LOGIN_SUCCES",
  payload: token,
});

export const LoginFailure = () => ({
  type: "LOGIN_FAILURE",
});

export const Logout = () => ({
  type: "LOGOUT",
});

export const RegisterFailure = (error) => ({
  type: "REGISTER_FAILURE",
  payload: error,
});

export const RegisterStart = () => ({
  type: "REGISTER_START",
});

export const RegisterSuccess = (user) => ({
  type: "REGISTER_SUCCESS",
  payload: user,
});
