import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";
import Config from "../../../config/Config";
import Breadcrumb from "../../components/Breadcrumb";

const AddPincode = () => {
  const history = useHistory();
  const [isAddLoaded, setIsAddLoaded] = useState(true);
  const [pincode, setPincode] = useState({
    pincode: "",
    city: "",
    state: "",
  });

  // Submit Handler
  const submitHandler = (evt) => {
    setIsAddLoaded(false);
    evt.preventDefault();

    fetch(Config.SERVER_URL + "/pincode", {
      method: "POST",
      body: JSON.stringify(pincode),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status === 200) {
            M.toast({ html: result.message, classes: "bg-success" });
            history.goBack();
          } else {
            const errorKeys = Object.keys(result.error);
            errorKeys.forEach((key) => {
              M.toast({ html: result.error[key], classes: "bg-danger" });
            });
            M.toast({ html: result.message, classes: "bg-danger" });
          }
          setIsAddLoaded(true);
        },
        (error) => {
          setIsAddLoaded(true);
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
        <Breadcrumb title={"PINCODES"} pageTitle={"Add Pincode"} />

        {/* Add Pincode Form */}
        <div className="row">
          <div className={"col-md-11 mx-auto"}>
            <form
              onSubmit={submitHandler}
              className="form-horizontal form-material"
            >
              {/* Pincode Details */}
              <div className={"row shadow-sm bg-white py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>Pincode Details</h3>
                </div>

                {/* STATE NAME */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    STATE NAME!
                  </label>
                  <input
                    type="text"
                    value={pincode.state}
                    onChange={(evt) =>
                      setPincode({ ...pincode, state: evt.target.value })
                    }
                    className="form-control"
                    placeholder={"Bengal"}
                  />
                </div>

                {/* CITY NAME */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    CITY NAME!
                  </label>
                  <input
                    type="text"
                    value={pincode.city}
                    onChange={(evt) =>
                      setPincode({ ...pincode, city: evt.target.value })
                    }
                    className="form-control"
                    placeholder={"Kolkata"}
                  />
                </div>

                {/* PINCODE */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    PINCODE!
                  </label>
                  <input
                    type="number"
                    value={pincode.pincode}
                    onChange={(evt) =>
                      setPincode({ ...pincode, pincode: evt.target.value })
                    }
                    className="form-control"
                    placeholder={"854301"}
                  />
                </div>

                <div className={"form-group col-md-6"}>
                  <button
                    className="btn btn-info rounded px-3 py-2"
                    type={"submit"}
                  >
                    {isAddLoaded ? (
                      <div>
                        <i className="fas fa-plus"></i> Add Pincode
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
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPincode;
