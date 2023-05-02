import React, { useState, useEffect, useMemo } from "react";
import M from "materialize-css";
import $ from "jquery";
import { Link, useHistory, useParams } from "react-router-dom";
import Config from "../../../config/Config";
import Breadcrumb from "../../components/Breadcrumb";
import Spinner from "../../components/Spinner";
const date = require("date-and-time");

// Component Function
const AssignDeliveryBoys = (props) => {
  const history = useHistory();
  const { id } = useParams();
  const [pagination, setPagination] = useState({
    skip: 0,
    limit: 10,
    totalRecord: 0,
    totalPage: 0,
    currentPage: 1,
  });

  const [isAllDealsLoaded, setIsAllDealsLoaded] = useState(false);
  const [allDeliveryBoys, setAllDeliveryBoys] = useState([]);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [formData, setFormData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const selectDeliveryBoyHandler = (deliveryBoyId) => {
    if (formData.length) {
      const isExist = formData.some((value) => {
        return value == deliveryBoyId;
      });

      if (isExist) {
        const filteredArr = formData.filter((value) => {
          return value != deliveryBoyId;
        });
        setFormData([...filteredArr]);
      } else {
        setFormData([...formData, deliveryBoyId]);
      }
    } else {
      setFormData([deliveryBoyId]);
    }
  };

  // Get supervisor details
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`${Config.SERVER_URL}/supervisors/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_admin_token")}`,
          },
        });
        const result = await response.json();
        if (result.status == 200) {
          const deliveryBoysArray = result?.body?.deliveryBoys.map(
            (deliveryBoy) => {
              return deliveryBoy._id;
            }
          );
          setFormData([...deliveryBoysArray]);
        } else {
          M.toast({ html: result.message, classes: "bg-danger" });
        }
      } catch (error) {
        M.toast({ html: error, classes: "bg-danger" });
      }
    };

    getData();
  }, []);

  // Submit Handler
  const submitHandler = (evt) => {
    evt.preventDefault();

    setUpdateLoading(true);

    fetch(`${Config.SERVER_URL}/supervisors/${id}`, {
      method: "PUT",
      body: JSON.stringify({ deliveryBoys: formData }),
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
          } else {
            const errorKeys = Object.keys(result.errors);
            errorKeys.forEach((key) => {
              M.toast({ html: result.errors[key], classes: "bg-danger" });
            });
            M.toast({ html: result.message, classes: "bg-danger" });
          }
          setUpdateLoading(false);
        },
        (error) => {
          setUpdateLoading(false);
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  };
  const limitHandler = (e) => {
    const limit = e.target.value;
    const totalPage = Math.ceil(pagination.totalRecord / limit);
    setPagination({
      ...pagination,
      limit,
      totalPage,
    });
  };

  const pageHandler = (e, page) => {
    e.preventDefault();
    setPagination({
      ...pagination,
      skip: page == 1 ? 0 : (page - 1) * pagination.limit,
      currentPage: page,
    });
  };

  const previousPageHandler = (e) => {
    e.preventDefault();
    console.log(pagination);
    setPagination({
      ...pagination,
      currentPage: pagination.currentPage == 1 ? 1 : pagination.currentPage - 1,
      skip:
        pagination.currentPage == 1
          ? 0
          : (pagination.currentPage - 2) * pagination.limit,
    });
  };

  const nextPageHandler = (e) => {
    e.preventDefault();
    console.log(pagination);
    setPagination({
      ...pagination,
      currentPage:
        pagination.currentPage == pagination.totalPage
          ? pagination.totalPage
          : pagination.currentPage + 1,
      skip:
        pagination.currentPage == 1
          ? pagination.limit
          : (pagination.currentPage + 1) * pagination.limit,
    });
  };

  // Get Delivery Boys
  useEffect(() => {
    let url = `${Config.SERVER_URL}/deliveryBoys/getAllNotAssigned?skip=${pagination.skip}&limit=${pagination.limit}`;
    if (searchQuery) url += `&searchQuery=${searchQuery}`;
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_admin_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setIsAllDealsLoaded(true);
          if (result.status === 200) {
            setAllDeliveryBoys(result.body || []);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setIsAllDealsLoaded(true);
        }
      );
  }, [pagination.skip, pagination.limit, searchQuery]);

  // Count Delivery Boys
  useEffect(() => {
    let url = `${Config.SERVER_URL}/deliveryBoys/getAllNotAssigned?skip=0&limit=0`;
    if (searchQuery) url += `&searchQuery=${searchQuery}`;
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_admin_token")}`,
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setPagination({
            ...pagination,
            totalRecord: result?.body?.length,
            totalPage: Math.ceil(result?.body?.length / pagination.limit),
          });
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
          setIsAllDealsLoaded(true);
        }
      );
  }, [searchQuery]);

  // Return function
  return (
    <div className="page-wrapper px-0 pt-0">
      <div className={"container-fluid"}>
        {/* Bread crumb and right sidebar toggle */}
        <Breadcrumb
          title={"DELIVERY BOYS"}
          pageTitle={"Assign Delivery Boys"}
        />
        {/* End Bread crumb and right sidebar toggle */}
        {/* Assign Delivery Boys Form */}
        <div className="row mt-2">
          <div className={"col-md-11 mx-auto"}>
            <form
              onSubmit={submitHandler}
              className="form-horizontal form-material"
            >
              {/* Delivery Boys Details */}
              <div className={"row shadow-sm bg-white py-3 mt-2"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>Delivery Boys</h3>
                </div>

                <div className={"col-md-12 px-0"}>
                  {/* Heading */}
                  <div className={"card mb-0 mt-2 border-0 rounded"}>
                    <div className={"card-body pb-0 pt-2 d-flex"}>
                      <div>
                        <h4 className="float-left mt-2 mr-2">Search: </h4>
                      </div>
                      <div className="border px-2">
                        <input
                          type="search"
                          onChange={(evt) => {
                            setSearchQuery(evt.target.value);
                          }}
                          placeholder="By Name/Email"
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Data */}
                  {isAllDealsLoaded ? (
                    <div className="card border-0 rounded m-0 py-1">
                      {allDeliveryBoys?.length ? (
                        <div className="card-body py-0">
                          <div className="table-responsive">
                            <table
                              className={
                                "table table-bordered table-striped my-0"
                              }
                            >
                              <thead>
                                <tr>
                                  <th>SN</th>
                                  <th>NAME</th>
                                  <th>MOBILE</th>
                                  <th>EMAIL</th>

                                  <th className="text-center">ACTION</th>
                                </tr>
                              </thead>
                              <tbody>
                                {allDeliveryBoys.map((deliveryBoy, index) => {
                                  return (
                                    <tr key={deliveryBoy.id}>
                                      <td>{index + 1}</td>
                                      <td>{deliveryBoy.name}</td>
                                      <td>{deliveryBoy.mobile}</td>
                                      <td>{deliveryBoy.email}</td>

                                      <td className="text-center">
                                        <div className="form-check form-check-inline">
                                          <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={formData.some((value) => {
                                              return value == deliveryBoy._id;
                                            })}
                                            id={`deliveryBoy-${index}`}
                                            onChange={(evt) =>
                                              selectDeliveryBoyHandler(
                                                deliveryBoy._id
                                              )
                                            }
                                          />

                                          <label
                                            className="form-check-label"
                                            htmlFor={`deliveryBoy-${index}`}
                                          ></label>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                            {/* Pagination */}
                            <div className="mt-2 d-flex justify-content-between">
                              <div className="limit form-group shadow-sm px-3 border">
                                <select
                                  name=""
                                  id=""
                                  className="form-control"
                                  onChange={limitHandler}
                                >
                                  <option value="10">10</option>
                                  <option value="20">20</option>
                                  <option value="30">30</option>
                                </select>
                              </div>
                              <nav aria-label="Page navigation example">
                                <ul className="pagination">
                                  <li
                                    className={`page-item ${
                                      pagination.currentPage == 1
                                        ? "disabled"
                                        : ""
                                    }`}
                                  >
                                    <a
                                      className="page-link"
                                      href="#"
                                      tabindex="-1"
                                      onClick={previousPageHandler}
                                    >
                                      Previous
                                    </a>
                                  </li>
                                  {[...Array(pagination.totalPage)].map(
                                    (_, i) => {
                                      return (
                                        <li className="page-item">
                                          <a
                                            className="page-link"
                                            href="#"
                                            onClick={(e) =>
                                              pageHandler(e, i + 1)
                                            }
                                          >
                                            {i + 1}
                                          </a>
                                        </li>
                                      );
                                    }
                                  )}

                                  <li
                                    className={`page-item ${
                                      pagination.currentPage ==
                                      pagination.totalPage
                                        ? "disabled"
                                        : ""
                                    }`}
                                  >
                                    <a
                                      className="page-link"
                                      href="#"
                                      onClick={nextPageHandler}
                                    >
                                      Next
                                    </a>
                                  </li>
                                </ul>
                              </nav>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={
                            "alert alert-danger mx-3 rounded border-0 py-2"
                          }
                        >
                          No Data Available
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={"bg-white p-3 text-center"}>
                      <span
                        className="spinner-border spinner-border-sm mr-1"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Loading..
                    </div>
                  )}
                </div>

                <div className={"form-group col-md-12"}>
                  <button
                    disabled={updateLoading}
                    className="btn btn-info rounded px-3 py-2"
                    type={"submit"}
                  >
                    {updateLoading ? (
                      <Spinner />
                    ) : (
                      <div>
                        <i className="fas fa-plus"></i> Update
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

export default AssignDeliveryBoys;
