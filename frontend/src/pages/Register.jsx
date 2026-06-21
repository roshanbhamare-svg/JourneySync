import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

function Register() {

const navigate = useNavigate();

const [formData, setFormData] = useState({


username: "",
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
  await registerUser(
    formData
  );

  alert(

    response.data
    ?.message ||

    "Registration Successful"

  );

  navigate(
    "/login"
  );

}
catch (error) {

  alert(

    error.response
    ?.data
    ?.message ||

    "Registration Failed"

  );

}


};

return (

<div className="auth-wrapper">

  <div className="auth-card">

    <div className="auth-header">
      <h1>Register</h1>
      <p>Create your JourneySync account</p>
    </div>

    <form onSubmit={handleSubmit}>

      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          name="username"
          placeholder="Enter a username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>

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
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="btn-primary" style={{ marginTop: "10px" }}>
        Register
      </button>

    </form>

    <div className="auth-footer">
      Already have an account? <a href="/login" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>Login</a>
    </div>

  </div>

</div>

);

}

export default Register;
