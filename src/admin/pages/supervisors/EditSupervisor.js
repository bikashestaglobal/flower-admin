import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import M from "materialize-css";
import Config from "../../../config/Config";
import Breadcrumb from "../../components/Breadcrumb";
import Spinner from "../../components/Spinner";

const EditSupervisor = () => {
  const history = useHistory();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    state: "",
  });

  // Submit Handler
  const submitHandler = (evt) => {
    setLoading(false);
    evt.preventDefault();
    const updateData = {
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      status: formData.status,
    };
    fetch(`${Config.SERVER_URL}/supervisors/${formData.id}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_admin_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
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
          setLoading(true);
        },
        (error) => {
          setLoading(true);
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  };

  // get Records
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/supervisors/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_admin_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status === 200) {
            setFormData(result.body);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  }, []);

  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        {/* <!-- ============================================================== --> */}
        {/* <!-- Bread crumb and right sidebar toggle --> */}
        {/* <!-- ============================================================== --> */}
        <Breadcrumb title={"SUPERVISORS"} pageTitle={"Update Supervisor"} />

        {/* Edit SUPERVISOR Form */}
        <div className="row">
          <div className={"col-md-11 mx-auto"}>
            <form
              onSubmit={submitHandler}
              className="form-horizontal form-material"
            >
              {/* Coupon Details */}
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
                    placeholder={"Enter Supervisor Name"}
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
                    placeholder={"Enter Supervisor Mobile"}
                  />
                </div>

                {/* SUPERVISOR EMAIL */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    SUPERVISOR EMAIL
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(evt) =>
                      setFormData({ ...formData, email: evt.target.value })
                    }
                    className="form-control"
                    placeholder={"Enter Supervisor Email"}
                  />
                </div>

                {/* STATUS */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    SELECT STATUS
                  </label>
                  <select
                    value={formData.status}
                    onChange={(evt) =>
                      setFormData({ ...formData, status: evt.target.value })
                    }
                    name=""
                    className="form-control"
                    id=""
                  >
                    <option value="">Select Status</option>
                    <option value={true}>Active</option>
                    <option value={false}>Disabled</option>
                  </select>
                </div>

                <div className={"form-group col-md-12"}>
                  <button
                    className="btn btn-info rounded px-3 py-2"
                    type={"submit"}
                  >
                    {loading ? (
                      <Spinner />
                    ) : (
                      <div>
                        <i className="fas fa-refresh"></i> UPDATE SUPERVISOR
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

export default EditSupervisor;
