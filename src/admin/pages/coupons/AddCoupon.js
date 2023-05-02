import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import M from "materialize-css";
import Config from "../../../config/Config";
import Breadcrumb from "../../components/Breadcrumb";
import Spinner from "../../components/Spinner";

const AddCoupon = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    couponCode: "",
    applyFor: "",
    discountType: "",
    discount: "",
    description: "",
    numberOfUsesTimes: 1,
    minimumAmount: "",
    startDate: "",
    expiryDate: "",
  });

  const editorRef = useRef(null);
  // Submit Handler
  const submitHandler = (evt) => {
    setLoading(true);
    evt.preventDefault();

    fetch(Config.SERVER_URL + "/coupons", {
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
        <Breadcrumb title={"COUPONS"} pageTitle={"Add Coupon"} />

        {/* Add Coupon Form */}
        <div className="row">
          <div className={"col-md-11 mx-auto"}>
            <form
              onSubmit={submitHandler}
              className="form-horizontal form-material"
            >
              {/* Coupon Details */}
              <div className={"row shadow-sm bg-white py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>Coupon Details</h3>
                </div>

                {/* Coupon Code */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    ENTER COUPON CODE
                  </label>
                  <input
                    type="text"
                    value={formData.couponCode}
                    onChange={(evt) =>
                      setFormData({ ...formData, couponCode: evt.target.value })
                    }
                    className="form-control"
                    placeholder={"Coupon Code"}
                  />
                </div>

                {/* Apply For */}
                <div className={"col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    SELECT USER TYPE
                  </label>
                  <div className="d-flex mt-2">
                    <div className="custom-control custom-radio pl-0">
                      <input
                        type="radio"
                        id="userType1"
                        name="userType"
                        value={"NEW_USER"}
                        onChange={(evt) =>
                          setFormData({
                            ...formData,
                            applyFor: evt.target.value,
                          })
                        }
                        className="custom-control-input"
                      />
                      <label className="custom-control-label" for="userType1">
                        New User
                      </label>
                    </div>
                    <div className="custom-control custom-radio">
                      <input
                        type="radio"
                        id="userType2"
                        name="userType"
                        onChange={(evt) =>
                          setFormData({
                            ...formData,
                            applyFor: evt.target.value,
                          })
                        }
                        value={"EXISTING_USER"}
                        className="custom-control-input"
                      />
                      <label className="custom-control-label" for="userType2">
                        Existing User
                      </label>
                    </div>
                    <div className="custom-control custom-radio">
                      <input
                        type="radio"
                        id="userType3"
                        name="userType"
                        onChange={(evt) =>
                          setFormData({
                            ...formData,
                            applyFor: evt.target.value,
                          })
                        }
                        value={"ALL_USER"}
                        className="custom-control-input"
                      />
                      <label className="custom-control-label" for="userType3">
                        All User
                      </label>
                    </div>
                  </div>
                </div>

                {/* Discount type*/}
                <div className={"col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    SELECT DISCOUNT TYPE!
                  </label>
                  <div className="d-flex">
                    <div className="custom-control custom-radio pl-0 ml-0">
                      <input
                        type="radio"
                        id="discountType1"
                        name="discountType"
                        value={"AMOUNT"}
                        onChange={(evt) =>
                          setFormData({
                            ...formData,
                            discountType: evt.target.value,
                          })
                        }
                        className="custom-control-input"
                      />
                      <label
                        className="custom-control-label"
                        for="discountType1"
                      >
                        AMOUNT
                      </label>
                    </div>
                    <div className="custom-control custom-radio">
                      <input
                        type="radio"
                        id="discountType2"
                        name="discountType"
                        value={"PERCENTAGE"}
                        onChange={(evt) =>
                          setFormData({
                            ...formData,
                            discountType: evt.target.value,
                          })
                        }
                        className="custom-control-input"
                      />
                      <label
                        className="custom-control-label"
                        for="discountType2"
                      >
                        PRECENTAGE
                      </label>
                    </div>
                  </div>
                </div>

                {/* Discount aomunt */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    DISCOUNT AMOUNT!
                  </label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(evt) =>
                      setFormData({ ...formData, discount: evt.target.value })
                    }
                    name={"discount"}
                    className="form-control"
                    placeholder={"Discount Amount"}
                  />
                </div>

                {/* minimum Amount */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    MINIMUM AMOUNT FOR APPLYING COUPON
                  </label>
                  <input
                    type="number"
                    value={formData.minimumAmount}
                    onChange={(evt) =>
                      setFormData({
                        ...formData,
                        minimumAmount: evt.target.value,
                      })
                    }
                    name={"minimumAmount"}
                    className="form-control"
                    placeholder={"Minimum Amount For Coupon"}
                  />
                </div>

                {/* start Date */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    COUPON ACTIVATION DATE
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(evt) =>
                      setFormData({
                        ...formData,
                        startDate: evt.target.value,
                      })
                    }
                    name={"startDate"}
                    className="form-control"
                    placeholder={"Startting date"}
                  />
                </div>

                {/* Valid Upto */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    COUPON EXPIRY DATE
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(evt) =>
                      setFormData({ ...formData, expiryDate: evt.target.value })
                    }
                    name={"expiryDate"}
                    className="form-control"
                    placeholder={"Expiry Date"}
                  />
                </div>

                {/* Uses Times */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    USES TIMES FOR USER
                  </label>
                  <input
                    type="number"
                    value={formData.numberOfUsesTimes}
                    onChange={(evt) =>
                      setFormData({
                        ...formData,
                        numberOfUsesTimes: evt.target.value,
                      })
                    }
                    name={"startDate"}
                    className="form-control"
                    placeholder={"Valid Upto"}
                  />
                </div>
              </div>

              {/* Coupon Description */}
              <div className={"row shadow-sm bg-white mt-3 py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>Coupon Description</h3>
                </div>
                <div className={"form-group col-md-12"}>
                  <Editor
                    apiKey="dxkecw9qym6pvb1b00a36jykem62593xto5hg5maqyksi233"
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    initialValue={null}
                    // value={editorValue}
                    onChange={(newValue, editor) => {
                      setFormData({
                        ...formData,
                        description: editor.getContent(),
                      });
                    }}
                    init={{
                      height: 150,

                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "code",
                        "help",
                        "wordcount",
                      ],
                      toolbar:
                        "undo redo | blocks | " +
                        "bold italic forecolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | " +
                        "removeformat | help",
                      content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    }}
                  />
                </div>
                <div className={"form-group col-md-12"}>
                  <button
                    disabled={loading}
                    className="btn btn-info rounded px-3 py-2"
                    type={"submit"}
                  >
                    {loading ? (
                      <Spinner />
                    ) : (
                      <div>
                        <i className="fas fa-plus"></i> Add Coupon
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

export default AddCoupon;
