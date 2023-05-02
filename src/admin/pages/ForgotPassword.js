import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { AdminContext } from "../AdminRouter";
import Config from "../../config/Config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
function ForgotPassword() {
  // History Initialization
  const history = useHistory();

  // Create State
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Use Context
  const { state, dispatch } = useContext(AdminContext);
  // Submit Handler
  const submitHandler = async (evt) => {
    evt.preventDefault();
    setLoading(true);
    const branchData = {
      email,
    };

    try {
      const response = await fetch(Config.SERVER_URL + "/admins/findAccount", {
        method: "POST",
        body: JSON.stringify(branchData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.status === 200) {
        toast.success(result.message);
        toast.success("OTP Send on Your Email !");

        localStorage.setItem(
          "resetPassword",
          JSON.stringify({
            email: result.body.email,
            token: result.body.token,
          })
        );
        history.push("/admin/enter-otp");
      } else {
        if (result.errors.email) toast.error(result.errors.email);
        if (result.message) toast.error(result.message);
        setLoading(false);
      }
    } catch (error) {
      toast.message(error);
      setLoading(false);
    }
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
                  style={{ height: "70px" }}
                />
                <h4 className={"form-heading"}>Forgot Your Password?</h4>
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

                  <div className={"text-center"}>
                    <button
                      disabled={loading}
                      className={"btn btn-info shadow-sm form-btn"}
                    >
                      {loading ? (
                        <Spinner />
                      ) : (
                        <div>
                          <i className="fas fa-sign-in"></i> Continue
                        </div>
                      )}
                    </button>
                  </div>

                  <div className={"mt-3"}>
                    <Link to={"/admin/login"}>Back to Login?</Link>
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
export default ForgotPassword;
