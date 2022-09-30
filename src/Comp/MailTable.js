import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Badge from "react-bootstrap/Badge";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { getTouchRippleUtilityClass } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import MarkunreadIcon from "@mui/icons-material/Markunread";

import { validate } from "../Common/common";

function MailTable() {
  let Navigate = useNavigate(); //Inizi
  let Location = useLocation(); //
  let [outboxTable, setOutboxTable] = useState([]);
 
  let callfunc = async () => {
    if (validate()) {
      let token = window.sessionStorage.getItem("token");
      let outboxMail = await axios.get("https://gmailclone09.herokuapp.com/users/outbox", {
        headers: { authorization: token },
      });
      console.log(outboxMail);
      if (outboxMail.data.statuscode === 200) {
        setOutboxTable(outboxMail.data.data);
      } else Navigate("/login");
    } else Navigate("/login");
  };

  useEffect(() => {
    callfunc();
  }, []);

  const name = Location.state.name;
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
      callfunc();
    }, 2000);
    if (validate()) {
      let token = window.sessionStorage.getItem("token");
      let data = { to, subject, body };
      await axios
        .post("https://gmailclone09.herokuapp.com/users/sendemail", data, {
          headers: { authorization: token },
        })
        .then((response) => {
          if (response.data.statuscode === 200) {
            setAlartToggle(true);
            setMessage(response.data.message);
            setOpen(true);
          } else if (response.data.statuscode === 204) {
            alert(response.data.message);
            Navigate("/login");
          }
        })
        .catch((error) => {
          setAlartToggle(false);
          setMessage(error);
          setOpen(true);
        });
    } else Navigate("/login");
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Logout
    </Tooltip>
  );
  return (
    <>
      <Navbar bg="primary" variant="dark">
        <Container>
          <MarkunreadIcon fontSize="large" />
          &nbsp;
          <Navbar.Brand onClick={() => Navigate("/login")}>
            Gmail-Clone
          </Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              Signed in as:{" "}
              <span className="text-uppercase fs-6 fw-bold">{name}</span>
            </Navbar.Text>
          </Navbar.Collapse>
          <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip}
          >
            <LogoutIcon
              className="my-auto mx-4 "
              onClick={() => {
                window.sessionStorage.removeItem("token");
                Navigate("/login");
              }}
            />
          </OverlayTrigger>
        </Container>
      </Navbar>
      <div className="row justify-content-start mt-2">
        <div className="col-1">
          <Nav className="flex-column">
            <Button className="mx-2" variant="primary" onClick={handleShow}>
              Compose
            </Button>
            <Nav.Item className="text-center fw-semibold mt-2">
              Sent
              <Badge bg="info" style={{ color: "black" }}>
                {outboxTable.length}
              </Badge>
            </Nav.Item>
            <Nav.Item className="text-center fw-semibold mt-2">Inbox</Nav.Item>
            <Nav.Item className="text-center fw-semibold mt-2">Draft</Nav.Item>
          </Nav>
        </div>
        <div className="col-11">
          <Table
            striped
            bordered
            hover
            size="sm"
            className="table-bordered border-primary"
          >
            <thead>
              <tr>
                <th >To</th>
                <th>Subject</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {outboxTable.map((e) => {
                return (
                  <tr key={e._id}>
                    <td>{e.to}</td>
                    <td>{e.subject}</td>
                    <td>{e.body}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={SnackbarhandleClose}
      >
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
          <Modal.Title>Send Mail</Modal.Title>
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
