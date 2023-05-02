import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";
import Config from "../../../config/Config";
import Breadcrumb from "../../components/Breadcrumb";
import Spinner from "../../components/Spinner";

const AddSupervisor = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Submit Handler
  const submitHandler = (evt) => {
    setLoading(true);
    evt.preventDefault();

    fetch(Config.SERVER_URL + "/supervisors", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_admin_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
          if (result.status === 200) {
            M.toast({ html: result.message, classes: "bg-success" });
            history.goBack();
          } else {
            const errorKeys = Object.keys(result.errors);
            errorKeys.forEach((key) => {
              M.toast({ html: result.errors[key], classes: "bg-danger" });
            });
            M.toast({ html: result.message, classes: "bg-danger" });
          }
          setLoading(false);
        },
        (error) => {
          setLoading(false);
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  };

  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        {/* <!-- ============================================================== --> */}
        {/* <!-- Bread crumb and right sidebar toggle --> */}
        {/* <!-- ============================================================== --> */}
        <Breadcrumb title={"SUPERVISORS"} pageTitle={"Add Supervisor"} />

        {/* Add Supervisor Form */}
        <div className="row">
          <div className={"col-md-11 mx-auto"}>
            <form
              onSubmit={submitHandler}
              className="form-horizontal form-material"
            >
              {/* SUPERVISOR DETAILS */}
              <div className={"row shadow-sm bg-white py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>SUPERVISOR DETAILS</h3>
                </div>

                {/* SUPERVISOR NAME */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    SUPERVISOR NAME
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(evt) =>
                      setFormData({ ...formData, name: evt.target.value })
                    }
                    className="form-control"
                    placeholder={"Enter Full Name"}
                  />
                </div>

                {/* SUPERVISOR MOBILE */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    SUPERVISOR MOBILE
                  </label>
                  <input
                    type="text"
                    value={formData.mobile}
                    onChange={(evt) =>
                      setFormData({ ...formData, mobile: evt.target.value })
                    }
                    className="form-control"
                    placeholder={"Enter Mobile Number"}
                  />
                </div>

                {/* SUPERVISOR EMAIL */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    SUPERVISOR EMAIL
                  </label>
                  <input
                    type="text"
                    value={formData.email}
                    onChange={(evt) =>
                      setFormData({ ...formData, email: evt.target.value })
                    }
                    className="form-control"
                    placeholder={"Enter Email Address"}
                  />
                </div>

                {/* PASSWORD */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    PASSWORD
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(evt) =>
                      setFormData({ ...formData, password: evt.target.value })
                    }
                    className="form-control"
                    placeholder={"Enter Password"}
                  />
                </div>

                <div className={"form-group col-md-6"}>
                  <button
                    className="btn btn-info rounded px-3 py-2"
                    type={"submit"}
                  >
                    {loading ? (
                      <Spinner />
                    ) : (
                      <div>
                        <i className="fas fa-plus"></i> ADD SUPERVISOR
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSupervisor;
