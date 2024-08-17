const Reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        token: null,
        isFetching: true,
        error: false,
      };
    case "LOGIN_SUCCESS":
      console.log(action)
      return {
        token: action.payload,
        isFetching: false,
        error: false,
      };
    case "LOGIN_FAILURE":
      return {
        token: null,
        isFetching: false,
        error: true,
      };

    case "LOGOUT":
      return {
        token: null,
        isFetching: false,
        error: false,
      };
    default:
      return state;
  }
};

export default Reducer;
