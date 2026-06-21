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


<div>

  <h1>
    Login
  </h1>

  <form
  onSubmit={
    handleSubmit
  }
  >

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
      Login
    </button>

  </form>

</div>


);

}

export default Login;
