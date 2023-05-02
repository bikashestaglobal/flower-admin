import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import M from "materialize-css";
import Config from "../../../config/Config";
import Breadcrumb from "../../components/Breadcrumb";
import Spinner from "../../components/Spinner";

const EditFlavour = () => {
  const history = useHistory();
  const { id } = useParams();
  const [isUpdateLoaded, setIsUpdateLoaded] = useState(true);
  const [isFlavourLoaded, setIsFlavourLoaded] = useState(false);
  const [flavour, setFlavour] = useState({
    name: "",
    status: "",
  });

  // Submit Handler
  const submitHandler = (evt) => {
    setIsUpdateLoaded(false);
    evt.preventDefault();
    const updateData = {
      name: flavour.name,
      status: flavour.status,
    };
    fetch(`${Config.SERVER_URL}/flavour/${id}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
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
          setIsUpdateLoaded(true);
        },
        (error) => {
          setIsUpdateLoaded(true);
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  };

  // get Records
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/flavour/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status === 200) {
            setFlavour(result.body);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
          setIsFlavourLoaded(true);
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setIsFlavourLoaded(true);
        }
      );
  }, []);

  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        {/* <!-- ============================================================== --> */}
        {/* <!-- Bread crumb and right sidebar toggle --> */}
        <Breadcrumb title="FLAVOURS" pageTitle={"Update Flavour"} />

        {/* Add Coupon Form */}
        <div className="row">
          {isFlavourLoaded ? (
            <div className={"col-md-11 mx-auto"}>
              <form
                onSubmit={submitHandler}
                className="form-horizontal form-material"
              >
                {/* Coupon Details */}
                <div className={"row shadow-sm bg-white py-3"}>
                  <div className="col-md-12">
                    <h3 className={"my-3 text-info"}>Flavour Details</h3>
                  </div>

                  {/* Flavour Name */}
                  <div className={"form-group col-md-6"}>
                    <label htmlFor="" className="text-dark h6 active">
                      FLAVOUR NAME HERE !
                    </label>
                    <input
                      type="text"
                      value={flavour.name}
                      onChange={(evt) =>
                        setFlavour({ ...flavour, name: evt.target.value })
                      }
                      className="form-control"
                      placeholder={"Chocolate Cake"}
                    />
                  </div>

                  {/* Flavour Status */}
                  <div className={"form-group col-md-6"}>
                    <label htmlFor="" className="text-dark h6 active">
                      FLAVOUR STATUS
                    </label>
                    <select
                      name=""
                      id=""
                      value={flavour.status}
                      onChange={(evt) => {
                        setFlavour({ ...flavour, status: evt.target.value });
                      }}
                      className="form-control"
                    >
                      <option value={true}>Active</option>
                      <option value={false}>Disabled</option>
                    </select>
                  </div>

                  <div className={"form-group col-md-6"}>
                    <button
                      className="btn btn-info rounded px-3 py-2"
                      type={"submit"}
                    >
                      {isUpdateLoaded ? (
                        <div>
                          <i className="fas fa-refresh"></i> Update Flavour
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
          ) : (
            <div className="col-md-11 mx-auto text-center bg-white py-5">
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditFlavour;
