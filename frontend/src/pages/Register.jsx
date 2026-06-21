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


<div>

  <h1>
    Register
  </h1>

  <form
  onSubmit={
    handleSubmit
  }
  >

    <input
      type="text"
      name="username"
      placeholder="User Name"
      value={formData.username}
      onChange={handleChange}
    />

    <br />
    <br />

    <input
      type="email"
      name="email"
      placeholder="Email"
      value={formData.email}
      onChange={handleChange}
    />

    <br />
    <br />

    <input
      type="password"
      name="password"
      placeholder="Password"
      value={formData.password}
      onChange={handleChange}
    />

    <br />
    <br />

    <button
    type="submit"
    >
      Register
    </button>

  </form>

</div>


);

}

export default Register;
