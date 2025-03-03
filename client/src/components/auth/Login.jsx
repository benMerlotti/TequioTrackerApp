/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../managers/authManager";
import { Button, FormFeedback, FormGroup, Input, Label } from "reactstrap";

export default function Login({ setLoggedInUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [failedLogin, setFailedLogin] = useState(false);
  const [warningMessage, setWarningMessage] = useState(""); // State for warning message

  const handleSubmit = (e) => {
    e.preventDefault();

    login(email, password)
      .then((user) => {
        if (!user) {
          setFailedLogin(true); // Generic failure for unexpected null user
        } else {
          setLoggedInUser(user); // Log in the user
          navigate("/"); // Redirect to home
        }
      })
      .catch((error) => {
        if (error.message === "Your account is inactive.") {
          setWarningMessage(
            "Admin has not yet activated your account. Please try again later."
          ); // Set the warning message
        } else {
          setWarningMessage(
            error.message || "Login failed. Please check your credentials."
          );
        }
      });
  };

  return (
    <div className="container" style={{ maxWidth: "500px" }}>
      <h3>Login</h3>
      <FormGroup>
        <Label>Email</Label>
        <Input
          invalid={failedLogin}
          type="text"
          value={email}
          onChange={(e) => {
            setFailedLogin(false);
            setWarningMessage(""); // Clear the warning message
            setEmail(e.target.value);
          }}
        />
      </FormGroup>
      <FormGroup>
        <Label>Password</Label>
        <Input
          invalid={failedLogin}
          type="password"
          value={password}
          onChange={(e) => {
            setFailedLogin(false);
            setWarningMessage(""); // Clear the warning message
            setPassword(e.target.value);
          }}
        />
        <FormFeedback>Login failed.</FormFeedback>
      </FormGroup>

      {/* Conditionally render the warning message */}
      {warningMessage && (
        <p style={{ color: "red", marginBottom: "10px" }}>{warningMessage}</p>
      )}

      <Button color="primary" onClick={handleSubmit}>
        Login
      </Button>
      <p>
        Not signed up? Register <Link to="/register">here</Link>
      </p>
    </div>
  );
}
