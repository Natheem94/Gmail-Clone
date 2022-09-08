import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getTouchRippleUtilityClass } from "@mui/material";

function MailTable() {
  let Navigate = useNavigate(); //Inizi

  let validate = () => {
    if (window.sessionStorage.getItem("token")) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    function call() {
      if (validate()) {
      } else Navigate("/login");
    }
    call();
  }, []);

  const [message, setMessage] = useState("");
  const [alartToggle, setAlartToggle] = useState(getTouchRippleUtilityClass);

  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [open, setOpen] = useState(false);
  const SnackbarhandleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  let HandleSubmit = async () => {
    setTimeout(() => {
        handleClose();        
    }, 2000);
    if (validate()) {
      let token = window.sessionStorage.getItem("token");
      let data = { to, subject, body };
      await axios
        .post("http://localhost:8000/users/sendemail", data, {
          headers: { authorization: token },
        })
        .then((response) => {
          if (response.data.statuscode === 200) {
            setAlartToggle(true);
            setMessage(response.data.message);
            setOpen(true);
          }
          else if (response.data.statuscode === 204){
            setAlartToggle(false);
            setMessage(response.data.message);
            setOpen(true);
            setTimeout(() => {
                Navigate("/login");
            }, 3000);
          }
        })
        .catch((error) => {
          setAlartToggle(true);
          setMessage(error);
          setOpen(true);
        });
    } else Navigate("/login");
  };
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button>
      <Snackbar open={open} autoHideDuration={3000} onClose={SnackbarhandleClose}>
        <Alert
          onClose={SnackbarhandleClose}
          severity={alartToggle ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>To</Form.Label>
              <Form.Control
                type="email"
                onChange={(e) => setTo(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setSubject(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                onChange={(e) => setBody(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            type="submit"
            onClick={() => HandleSubmit()}
          >
            Send
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MailTable;
