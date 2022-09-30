import React, { useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Box from "@mui/material/Box";
import Snackbar from '@mui/material/Snackbar';
import * as yup from "yup";

function SignupForm() {
  let Navigate = useNavigate();
  const [showpassword, setShowpassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  let HandleShowPassword = () => {
    setShowpassword((current) => !current);
  };
  let handleSubmit = async (data) => {
    delete data.conformpassword;
    await axios
      .post("https://gmailclone09.herokuapp.com/adduser", data)
      .then((response) => {
        if (response.data.statuscode === 200) {
          setMessage(response.data.message)
          setOpen(true)
          setTimeout(() => {
            Navigate("/login");
          }, 2000);
        } else if (response.data.statuscode === 400) {
          setMessage(response.data.message)
          setOpen(true)
          setTimeout(() => {
            Navigate("/login");
          }, 2000);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      conformpassword: "",
      mobile: "",
    },
    validationSchema: yup.object({
      name: yup.string().required("* required"),
      email: yup.string().email().required("* required"),
      password: yup
        .string()
        .min(8, "Password is too short - should be 8 chars minimum.")
        .required("* required"),
      conformpassword: yup
        .string()
        .required("* required")
        .oneOf([yup.ref("password"), null], "Passwords must match"),
      mobile: yup.string().required("* required"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <Form onSubmit={formik.handleSubmit} className="SignupForm p-5">
        <Box
          className="mx-auto d-flex align-items-center justify-content-center display-4 fw-semibold"
          sx={{
            width: 800,
            height: 200,
            backgroundColor: "primary.dark",
            "&:hover": {
              backgroundColor: "primary.main",
              opacity: [0.9, 0.8, 0.7],
            },
          }}
        >
          Signup with your Gmail accout
        </Box>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            id="name"
            placeholder="Full Name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name ? (
            <div style={{ color: "red" }}>{formik.errors.name}</div>
          ) : null}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            id="email"
            placeholder="Enter email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <div style={{ color: "red" }}>{formik.errors.email}</div>
          ) : null}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type={showpassword ? "text" : "password"}
            name="password"
            id="password"
            placeholder="Password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? (
            <div style={{ color: "red" }}>{formik.errors.password}</div>
          ) : null}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="Show Password"
            onChange={() => HandleShowPassword()}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Conform Password</Form.Label>
          <Form.Control
            type="password"
            name="conformpassword"
            id="conformpassword"
            placeholder="Conform Password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.conformpassword}
          />
          {formik.touched.conformpassword && formik.errors.conformpassword ? (
            <div style={{ color: "red" }}>{formik.errors.conformpassword}</div>
          ) : null}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Mobile</Form.Label>
          <Form.Control
            type="tel"
            name="mobile"
            id="mobile"
            placeholder="Mobile No."
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.mobile}
          />
          {formik.touched.mobile && formik.errors.mobile ? (
            <div style={{ color: "red" }}>{formik.errors.mobile}</div>
          ) : null}
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        message={message}
      />
    </>
  );
}

export default SignupForm;
