import "./Auth.scss";
import Login from "../UiComponents/Login/Login.tsx";
import Register from "../UiComponents/Register/Register.tsx";

function Auth() {
  return (
    <div className="auth-container">
      <div className="auth__logo-container">
        <h1>Kotodama</h1>
      </div>
      <Login />
      <Register />
    </div>
  );
}

export default Auth;
