import { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

function Login() {

const navigate = useNavigate();

const [formData, setFormData] = useState({


email: "",
password: ""


});

const handleChange = (e) => {


setFormData({

  ...formData,

  [e.target.name]:
  e.target.value

});


};

const handleSubmit = async (e) => {


e.preventDefault();

try {

  const response =
  await loginUser(formData);

  localStorage.setItem(
    "user",
    JSON.stringify(
      response.data.data
    )
  );

  if(
    response.data.data
    ?.accessToken
  ){

    localStorage.setItem(
      "token",
      response.data.data.accessToken
    );

  }

  alert(
    "Login Successful"
  );

  navigate(
    "/dashboard"
  );

}
catch (error) {

  alert(

    error.response
    ?.data
    ?.message ||

    "Login Failed"

  );

}


};

return (

<div className="auth-wrapper">

  <div className="auth-card">

    <div className="auth-header">
      <h1>Login</h1>
      <p>Welcome back to JourneySync</p>
    </div>

    <form onSubmit={handleSubmit}>

      <div className="form-group">
        <label>Email Address</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="btn-primary" style={{ marginTop: "10px" }}>
        Login
      </button>

    </form>

    <div className="auth-footer">
      Don't have an account? <a href="/register" onClick={(e) => { e.preventDefault(); navigate("/register"); }}>Sign Up</a>
    </div>

  </div>

</div>

);

}

export default Login;
