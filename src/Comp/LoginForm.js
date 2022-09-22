import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";


function LoginForm() {
  const Navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showpassword, setShowpassword] = useState(false);
  const [show, setShow] = useState(true);
  const [message, setMessage] = useState("");

  let HandleShowPassword = () => {
    setShowpassword((current) => !current);
  };
  let HandleSubmit = async () => {
    await axios
      .post("http://localhost:8000/users/login", { email, password })
      .then((response) => {
        console.log(response.data);
        if (response.data.statusCode === 200) {
          window.sessionStorage.setItem("token", response.data.token);
          Navigate("/mail",{state:{name:response.data.name}});
        } else {
          setShow(false);
          setMessage(response.data.message);
        }
      })
      .catch((error) => {
        setShow(false);
        setMessage(error);
      });
  };

  return (
    <>
      <div id="loginform" className="background">
        <Form className="w-25 p-4 blur">
          <Form.Label className="h3 fw-bold pb-2">Login</Form.Label>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type={showpassword ? "text" : "password"}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check
              type="checkbox"
              label="show Password"
              onChange={() => HandleShowPassword()}
            />
          </Form.Group>
          <Button
            variant="primary"
            // type="submit"
            onClick={() => HandleSubmit()}
          >
            Login
          </Button>
          <Button variant="info" className="ms-2">
            <Link to={"/signup"}>Signup</Link>
          </Button>
          <br />
          <br />
          {show ? (
            <></>
          ) : (
            <Alert variant="danger" onClose={() => setShow(true)} dismissible>
              {message}
            </Alert>
          )}
        </Form>
      </div>
    </>
  );
}

export default LoginForm;
