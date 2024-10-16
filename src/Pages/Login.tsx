import React, { useState } from "react";
import inputHelper from "../Helper/inputHelper";
import apiResponse from "../Interfaces/apiResponse";
import { useLoginUserMutation } from "../Apis/AuthApi";
import { jwtDecode } from "jwt-decode";
import userModel from "../Interfaces/UserModel";
import { useDispatch } from "react-redux";
import { setLoggedInUser } from "../Storage/Redux/userAuthSlice";
import { useNavigate } from "react-router-dom";
import MainLoader from "../Components/Page/Common/MainLoader";

function Login() {
  const [loginUser] = useLoginUserMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState({
    userName: "",
    password: "",
  });
  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const response: apiResponse = await loginUser({
      userName: userInput.userName,
      password: userInput.password,
    });
   
    if (response.data) {
     // console.log(response.data.result);
      const { token } = response.data.result;
      const { fullName, id, email, role }: userModel = jwtDecode(token);
      localStorage.setItem("token", token);
      dispatch(setLoggedInUser({ fullName, id, email, role }));
      navigate("/");
      console.log(email);
    } else if (response.error) {
      setError(response.error.data?.errorMessages?.[0] || "Error" );
    }
    setLoading(false);
  };
  return (
    <div className="container text-center">
      {loading && <MainLoader></MainLoader>}
      <form method="post" onSubmit={handleSubmit}>
        <h1 className="mt-5">Login</h1>
        <div className="mt-5">
          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <input
              type="text"
              placeholder="Enter UserName"
              className="form-control"
              required
              name="userName"
              value={userInput.userName}
              onChange={handleUserInput}
            ></input>
          </div>
          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <input
              type="text"
              placeholder="Enter Password"
              className="form-control"
              required
              name="password"
              value={userInput.password}
              onChange={handleUserInput}
            ></input>
          </div>
          <div className="mt-2">
            <button
              type="submit"
              className="btn btn-success"
              style={{ width: "200px" }}
            >
              Login
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
