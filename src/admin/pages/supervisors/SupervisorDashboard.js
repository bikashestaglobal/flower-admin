import React, { useContext, useState, useEffect } from "react";
import { AdminContext } from "../../AdminRouter";
import Config from "../../../config/Config";
import M from "materialize-css";
import { Link, useParams } from "react-router-dom";
import date from "date-and-time";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function SupervisorDashboard() {
  const { state, dispatch } = useContext(AdminContext);
  const { id } = useParams();

  // Total Orders
  const [supervisorData, setSupervisorData] = useState({});
  const [supervisorDataLoading, setSupervisorDataLoading] = useState(false);

  // Get Supervisor Details
  useEffect(() => {
    setSupervisorDataLoading(true);
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
          if (result.status == 200) {
            setSupervisorData(result.body);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
          setSupervisorDataLoading(false);
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setSupervisorDataLoading(false);
        }
      );
  }, []);

  return (
    <div>
      <div className="page-wrapper px-0 pt-0">
        {/* <!-- ============================================================== --> */}
        {/* <!-- Container fluid  --> */}
        {/* <!-- ============================================================== --> */}
        <div className="container-fluid">
          {/* <!-- ============================================================== --> */}
          {/* <!-- Bread crumb and right siLine toggle --> */}
          {/* <!-- ============================================================== --> */}
          <div className="row page-titles mb-0">
            <div className="col-md-5 col-8 align-self-center">
              <h3 className="text-themecolor">Dashboard</h3>
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active">Dashboard</li>
              </ol>
            </div>
          </div>
          {/* <!-- End Bread crumb and right sidebar toggle --> */}

          {/* <!-- Card Section --> */}
          <div
            className={"row page-titles px-3 my-0 shadow-none"}
            style={{ background: "none" }}
          >
            <div className="col-md-12">
              <div className="d-flex justify-content-between">
                <h3 className="card-title mb-4">Stats Overview</h3>
              </div>
            </div>

            {/* Card Design */}
            <div className={"col-md-12"}>
              <div className={"row"}>
                {/* Delivery Boys */}
                <div className={"col-md-3"}>
                  <div className={"card bg-white border-0"}>
                    <Link to={`/admin/supervisor/deliveryBoys/${id}`}>
                      <div className={"card-body py-1"}>
                        <div className={"float-left"}>
                          <i
                            className={"mdi mdi-account v-big-icon text-info"}
                          />
                        </div>
                        <div className={"float-right text-right m-2"}>
                          <h2
                            className={"text-info"}
                            style={{ fontSize: "30px" }}
                          >
                            {supervisorDataLoading ? (
                              <div className={"text-center"}>
                                <span
                                  className="spinner-border spinner-border-sm mr-1"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                              </div>
                            ) : (
                              supervisorData?.deliveryBoys?.length
                            )}
                          </h2>
                          <span className={"text-info h6"}>Delivery Boys</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Pincodes */}
                <div className={"col-md-3"}>
                  <div className={"card bg-white border-0"}>
                    <Link to={`/admin/supervisor/pincodes/${id}`}>
                      <div className={"card-body py-1"}>
                        <div className={"float-left"}>
                          <i
                            className={
                              "mdi mdi-truck-delivery v-big-icon text-info"
                            }
                          />
                        </div>
                        <div className={"float-right text-right m-2"}>
                          <h2
                            className={"text-info"}
                            style={{ fontSize: "30px" }}
                          >
                            {supervisorDataLoading ? (
                              <div className={"text-center"}>
                                <span
                                  className="spinner-border spinner-border-sm mr-1"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                              </div>
                            ) : (
                              supervisorData?.pincodes?.length || 0
                            )}
                          </h2>
                          <span className={"text-info h6"}>Pincodes</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Row --> */}
          {/* .............. */}
          {/* <!-- ============================================================== --> */}
        </div>
        {/* <!-- ============================================================== --> */}
        {/* <!-- End Container fluid  --> */}
        {/* <!-- footer --> */}
        {/* <!-- ============================================================== --> */}
        {/* <!-- ============================================================== --> */}
        {/* <!-- End footer --> */}
        {/* <!-- ============================================================== --> */}
      </div>
    </div>
  );
}

export default SupervisorDashboard;
