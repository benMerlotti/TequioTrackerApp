const _apiUrl = "/api/auth";

export const login = (email, password) => {
  return fetch(_apiUrl + "/login", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      Authorization: `Basic ${btoa(`${email}:${password}`)}`,
    },
  }).then((res) => {
    if (res.status === 401) {
      return res.text().then((message) => {
        throw new Error(message.trim() || "Unauthorized");
      });
    } else if (res.status === 403) {
      return res.text().then((message) => {
        throw new Error(message.trim() || "Your account is inactive.");
      });
    } else if (!res.ok) {
      throw new Error("An error occurred while logging in.");
    } else {
      return tryGetLoggedInUser();
    }
  });
};



export const logout = () => {
  return fetch(_apiUrl + "/logout");
};

export const tryGetLoggedInUser = () => {
  return fetch(_apiUrl + "/me").then((res) => {
    return res.status === 401 ? Promise.resolve(null) : res.json();
  });
};

export const register = (userProfile) => {
  userProfile.password = btoa(userProfile.password); // Encode the password
  return fetch(_apiUrl + "/register", {
    credentials: "same-origin",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userProfile),
  }).then((res) => {
    if (res.ok) {
      return "Registration successful. Please wait for activation.";
    } else {
      return res.json().then((error) => {
        throw new Error(error.message || "Registration failed.");
      });
    }
  });
};

