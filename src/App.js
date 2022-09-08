import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginForm from "./Comp/LoginForm";
import SignupForm from "./Comp/SignupForm";
import MailTable from "./Comp/MailTable";

function App() {
  return (
    <>
      {/* <h1>welcome</h1>   */}
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<LoginForm />} />
          <Route path="login" element={<LoginForm />} />
          <Route path="signup" element={<SignupForm />} />
          <Route path="mail" element={<MailTable />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
