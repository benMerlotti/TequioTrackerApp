import { createContext, useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { tryGetLoggedInUser } from "./managers/authManager";
import { Spinner } from "reactstrap";
import NavBar from "./components/NavBar";
import ApplicationViews from "./components/ApplicationViews";
import { getPendingActivations } from "./managers/abassadorManager";
export const UserContext = createContext();

function App() {
  const [loggedInUser, setLoggedInUser] = useState();
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    getPendingActivations().then(setPendingUsers);
  }, []);

  useEffect(() => {
    // user will be null if not authenticated
    tryGetLoggedInUser().then((user) => {
      setLoggedInUser(user);
    });
  }, []);

  // wait to get a definite logged-in state before rendering
  if (loggedInUser === undefined) {
    return <Spinner />;
  }

  return (
    <>
      <UserContext.Provider value={{ pendingUsers, setPendingUsers }}>
        <NavBar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
        <ApplicationViews
          loggedInUser={loggedInUser}
          setLoggedInUser={setLoggedInUser}
        />
      </UserContext.Provider>
    </>
  );
}

export default App;
