import React from "react";
import Papa from "papaparse";
import { useState } from "react";
import Config from "../../../config/Config";
import M from "materialize-css";
import { useHistory } from "react-router-dom";
import tableToCSV from "../../helpers";
import Breadcrumb from "../../components/Breadcrumb";
import { newsletter } from "../../helpers/csvHelper";
import { CSVLink } from "react-csv";
const AddNewsletterFromCSV = () => {
  const history = useHistory();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploaded, setUploaded] = useState([]);

  const fileChangeHandler = (event) => {
    const files = event.target.files[0];
    if (files) {
      setUploadLoading(true);

      Papa.parse(event.target.files[0], {
        complete: async (results) => {
          let keys = results.data[0];
          // I want to remove some óíúáé, blan spaces, etc
          keys = results.data[0].map((v) =>
            v
              // .toLowerCase()
              .replace(/ /g, "_")
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          );
          let values = results.data.slice(1);
          let objects = values.map((array) => {
            let object = {};
            keys.forEach((key, i) => (object[key] = array[i]));
            return object;
          });
          // Now I call to my API and everything goes ok

          // Get data from array and call the api
          objects.map((item, i) => {
            if (item.email) {
              submitHandler(item);
            }
            if (i == objects.length - 1) {
              setUploadLoading(false);
            }
          });
        },
      });
    }
  };

  // Submit Handler
  const submitHandler = (data) => {
    fetch(Config.SERVER_URL + "/newsletters", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_branch_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.status === 200) {
            // M.toast({ html: result.message, classes: "bg-success" });
          } else {
            const errorKeys = Object.keys(result.error);
            errorKeys.forEach((key) => {
              M.toast({ html: result.error[key], classes: "bg-danger" });
            });
          }
          setUploaded((old) => {
            return [
              ...old,
              {
                email: result.body.email || "",
                message: result.message || result.errors.message,
              },
            ];
          });
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  };

  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        {/* <!-- ============================================================== --> */}
        {/* <!-- Bread crumb and right sidebar toggle --> */}

        <Breadcrumb title="NEWSLETTERS" pageTitle={"Add Emails"} />

        {/* Add Emails Form */}
        <div className="row">
          <div className={"col-md-11 mx-auto"}>
            <form
              //   onSubmit={submitHandler}
              className="form-horizontal form-material"
            >
              {/* Color Details */}
              <div className={"row shadow-sm bg-white py-3"}>
                <div className="col-md-12 d-flex justify-content-between">
                  <h3 className={"my-3 text-info"}>Upload CSV File</h3>
                  <div className="">
                    <CSVLink
                      className="btn btn-info"
                      data={newsletter.dummyData}
                      headers={newsletter.headers}
                      filename="newsletters.csv"
                    >
                      Download CSV
                    </CSVLink>
                  </div>
                </div>

                <div className={"form-group col-md-6"}>
                  <input
                    type="file"
                    onChange={fileChangeHandler}
                    className="form-control"
                    placeholder={"Chocolaty"}
                  />
                </div>
                <div className={"form-group col-md-6"}>
                  {uploadLoading ? (
                    <div className={"bg-white p-3 text-center"}>
                      <span
                        className="spinner-border spinner-border-sm mr-1"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Loading..
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="row">
          <div className="col-md-11 mx-auto">
            <div className={"row shadow-sm bg-white py-3"}>
              <div className="col-md-12">
                {uploaded.map((item, index) => {
                  return (
                    <div className="card card-body">
                      {" "}
                      {item.email} {item.message}{" "}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewsletterFromCSV;
