import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { AdminContext } from "../AdminRouter";
import Config from "../../config/Config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

function EnterOtp() {
  // History Initialization
  const history = useHistory();

  // Create State
  const [otp, setOtp] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [otpLoading, setOTPLoading] = useState(false);

  // Use Context
  const { state, dispatch } = useContext(AdminContext);

  // Submit Handler
  const resendOtpHandler = async (evt) => {
    evt.preventDefault();
    setOTPLoading(true);
    const { email } = JSON.parse(localStorage.getItem("resetPassword")) || {};

    if (!email) {
      toast.error("Somthing went wrong !");
      history.push("/admin/login");
      return;
    }

    const adminData = {
      email,
    };

    try {
      const response = await fetch(Config.SERVER_URL + "/admins/findAccount", {
        method: "POST",
        body: JSON.stringify(adminData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (result.status === 200) {
        toast.success("OPT Resend Successful");
        localStorage.setItem(
          "resetPassword",
          JSON.stringify({
            email: result.body.email,
            token: result.body.token,
          })
        );
        setOTPLoading(false);
      } else {
        if (result.errors.email) toast.error(result.errors.email);
        if (result.message) toast.error(result.message);
        setOTPLoading(false);
      }
    } catch (error) {
      toast.error(error);
      setOTPLoading(false);
    }
  };

  // Submit Handler
  const verifyOtpHandler = async (evt) => {
    evt.preventDefault();
    setVerificationLoading(true);
    try {
      const { email } = JSON.parse(localStorage.getItem("resetPassword")) || {};
      if (!email) {
        toast.error("Somthing went wrong !");
        history.push("/admin/login");
        return;
      }
      const response = await fetch(Config.SERVER_URL + "/admins/verifyOTP", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (result.status == 200) {
        toast.success(result.message);
        localStorage.setItem(
          "resetPassword",
          JSON.stringify({
            token: result.body.token,
          })
        );
        setVerificationLoading(false);
        history.push("/admin/create-password");
      } else {
        if (result.errors.otp) toast.error(result.errors.otp);
        if (result.errors.email) toast.error(result.errors.email);
        if (result.message) toast.error(result.message);
        setVerificationLoading(false);
      }
    } catch (error) {
      toast.error(error);
      setVerificationLoading(false);
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
                <h4 className={"form-heading"}>OTP Verification</h4>
              </div>
              <form onSubmit={verifyOtpHandler} className={"form-material"}>
                <div className={"form-group"}>
                  <div className={"form-group mb-4"}>
                    <input
                      type="text"
                      value={otp}
                      onChange={(evt) => setOtp(evt.target.value)}
                      className="form-control"
                      placeholder={"1234"}
                    />
                  </div>

                  <div className={"text-center"}>
                    <button
                      disabled={verificationLoading}
                      className={"btn btn-info shadow-sm form-btn"}
                    >
                      {verificationLoading ? (
                        <Spinner />
                      ) : (
                        <div>
                          <i className="fas fa-sign-in"></i> Verify OTP
                        </div>
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={otpLoading}
                      className={"btn btn-outline-info shadow-sm form-btn ml-2"}
                      onClick={resendOtpHandler}
                    >
                      {otpLoading ? (
                        <Spinner />
                      ) : (
                        <div>
                          <i className="fas fa-sign-in"></i> Resend
                        </div>
                      )}
                    </button>
                  </div>

                  <div className={"mt-3"}>
                    <Link to={"/branch/login"}>Back to Login?</Link>
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
export default EnterOtp;
