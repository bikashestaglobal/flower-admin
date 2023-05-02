import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { AdminContext } from "../Admin";
import Config from "../../config/Config";

function Login() {
  // History Initialization
  const history = useHistory();

  // Create State
  const [email, setEmail] = useState("codescroller@gmail.com");
  const [password, setPassword] = useState("123456");
  const [isLoaded, setIsLoaded] = useState(true);

  // Use Context
  const { state, dispatch } = useContext(AdminContext);
  // Submit Handler
  const submitHandler = (evt) => {
    evt.preventDefault();
    setIsLoaded(false);
    const branchData = {
      email,
      password,
    };
    fetch(Config.SERVER_URL + "/vendor/login", {
      method: "POST",
      body: JSON.stringify(branchData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          if (result.status === 200) {
            M.toast({ html: result.message, classes: "bg-success" });
            localStorage.setItem("vendor", JSON.stringify(result.body));
            localStorage.setItem("jwt_vendor_token", result.body.token);
            dispatch({ type: "VENDOR", payload: result.data });
            window.location.href = "/admin";
          } else {
            if (result.email)
              M.toast({ html: result.email, classes: "bg-danger" });
            if (result.password)
              M.toast({ html: result.password, classes: "bg-danger" });
            if (result.message)
              M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          setIsLoaded(true);
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  };

  return (
    <div className={"container-fluid pt-5"} style={{ height: "100vh" }}>
      <div className={"row"} style={{ paddingTop: "10%" }}>
        <div className={"col-md-4 m-auto"}>
          <div className={"card shadow-sm bg-white rounded-0 border-0"}>
            <div className={"card-body"}>
              <div className={"text-center mb-3"}>
                <img
                  className={"img img-fluid"}
                  src={"/assets/images/logo.png"}
                  style={{ height: "60px" }}
                />
              </div>
              <form onSubmit={submitHandler} className={"form-material"}>
                <div className={"form-group"}>
                  <div className={"form-group mb-4"}>
                    <input
                      type="text"
                      value={email}
                      onChange={(evt) => setEmail(evt.target.value)}
                      className="form-control"
                      placeholder={"Enter Email"}
                    />
                  </div>
                  <div className={"form-group mb-4"}>
                    <input
                      type="password"
                      value={password}
                      onChange={(evt) => setPassword(evt.target.value)}
                      className="form-control"
                      placeholder={"Enter Password"}
                    />
                  </div>
                  <div className={"text-center"}>
                    <button
                      className={
                        "btn btn-info px-4 shadow-sm rounded-0 border-0"
                      }
                    >
                      {isLoaded ? (
                        <div>
                          <i className="fas fa-sign-in"></i> Login
                        </div>
                      ) : (
                        <div>
                          <span
                            className="spinner-border spinner-border-sm mr-1"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Loading..
                        </div>
                      )}
                    </button>
                  </div>

                  <div className={"mt-3"}>
                    <Link to={"/branch/forgot-password"}>
                      Lost your password?
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
