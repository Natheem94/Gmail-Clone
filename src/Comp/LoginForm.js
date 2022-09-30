import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Box from "@mui/material/Box";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

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
      .post("https://gmailclone09.herokuapp.com/users/login", { email, password })
      .then((response) => {
        if (response.data.statusCode === 200) {
          window.sessionStorage.setItem("token", response.data.token);
          Navigate("/mail", { state: { name: response.data.name } });
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
        <Container>
          <Row className="justify-content-md-center">
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
          </Row>
          <Row>
          <Box
            className="mx-auto d-flex align-items-center justify-content-center fw-semibold"
            sx={{
              width: 400,
              height: 80,
              backgroundColor: "primary.dark",
              "&:hover": {
                backgroundColor: "primary.main",
                opacity: [0.9, 0.8, 0.7],
              },
            }}
          >
            Email id: mailidtest2@gmail.com<br/>Password: iawqyvibdsbamohi
          </Box>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default LoginForm;
