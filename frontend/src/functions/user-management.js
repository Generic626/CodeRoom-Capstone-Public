const getUser = () => {
  const token = sessionStorage.getItem("token");
  const email = sessionStorage.getItem("email");
  const name = sessionStorage.getItem("name");

  return { token, email, name };
};

const setUser = (name, email, token) => {
  sessionStorage.setItem("name", name);
  sessionStorage.setItem("email", email);
  sessionStorage.setItem("token", token);
};

const signOutUser = () => {
  sessionStorage.removeItem("name");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("email");
  window.location.reload();
};

const updateName = (name) => {
  sessionStorage.setItem("name", name);
};

const retrieveAuthHeader = () => {
  const { token } = getUser();
  const requestHeaders = {
    Authorization: `Bearer ${token}`,
  };
  return requestHeaders;
};

export { getUser, signOutUser, setUser, retrieveAuthHeader, updateName };
