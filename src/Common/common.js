export const validate = () => {
    if (window.sessionStorage.getItem("token")) {
      return true;
    } else {
      return false;
    }
  };