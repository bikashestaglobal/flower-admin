import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AdminContext } from "../AdminRouter";
import Config from "../../config/Config";
import { toast } from "react-toastify";
function Login() {
  // Create State
  const [email, setEmail] = useState("codescroller@gmail.com");
  const [password, setPassword] = useState("@Code100");
  const [loading, setLoading] = useState(false);

  // Use Context
  const { state, dispatch } = useContext(AdminContext);

  // Submit Handler
  const submitHandler = async (evt) => {
    evt.preventDefault();
    setLoading(true);
    const formData = {
      email,
      password,
    };

    try {
      const response = await fetch(Config.SERVER_URL + "/admins/login", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (result.status === 200) {
        toast.success(result.message);
        localStorage.setItem("admin", JSON.stringify(result.body));
        localStorage.setItem("jwt_admin_token", result.body.token);
        dispatch({ type: "ADMIN", payload: result.data });
        window.location.href = "/admin";
      } else {
        if (result.errors.email) toast.error(result.errors.email);
        if (result.errors.password) toast.error(result.errors.password);
        if (result.message) toast.error(result.message);
        setLoading(false);
      }
    } catch (error) {
      toast.error(error);
      setLoading(false);
    }
  };

  return (
    <div className={"container-fluid"} style={{ height: "100vh" }}>
      <div className={"row"} style={{ paddingTop: "10%" }}>
        <div className={"col-md-4 m-auto"}>
          <div className={"card shadow-sm bg-white rounded-0 border-0"}>
            <div className={"card-body"}>
              <div className={"text-center mb-3"}>
                <img
                  className={"img img-fluid"}
                  src={"/assets/images/logo.png"}
                  style={{ height: "70px" }}
                />
                <h4 className={"form-heading"}>Login to Your Account</h4>
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
                      disabled={loading}
                      className={"btn btn-info shadow-sm form-btn"}
                    >
                      {loading ? (
                        <div>
                          <span
                            className="spinner-border spinner-border-sm mr-1"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Loading..
                        </div>
                      ) : (
                        <div>
                          <i className="fas fa-sign-in"></i> Login
                        </div>
                      )}
                    </button>
                  </div>

                  <div className={"mt-3"}>
                    <Link to={"/admin/forgot-password"}>
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
