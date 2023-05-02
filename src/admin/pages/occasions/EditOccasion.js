import React, { useState, useEffect } from "react";
import M from "materialize-css";
import { useHistory, useParams } from "react-router-dom";
import Config from "../../../config/Config";
import { storage } from "../../../firebase/FirebaseConfig";
import Breadcrumb from "../../components/Breadcrumb";
import Spinner from "../../components/Spinner";

const EditOccasion = () => {
  const history = useHistory();
  const { id } = useParams();
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(true);

  const [isAdded, setIsAdded] = useState(false);

  const [data, setData] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image: "",
    shortDescription: "",
  });

  const titleChangeHandler = (evt) => {
    const value = evt.target.value;
    setFormData({
      ...formData,
      slug: value.toLowerCase().replace(/\s+/g, "-"),
      name: value,
    });
  };

  // Submit Handler
  const submitHandler = (evt) => {
    setLoading(true);
    evt.preventDefault();

    if (progress > 0 && progress < 100) {
      M.toast({ html: "Wait for Image uploading", classes: "bg-warning" });
      return;
    }

    // Data for update
    const updatedData = {
      name: formData.name,
      slug: formData.slug,
      image: formData.image,
      shortDescription: formData.shortDescription,
      status: formData.status,
    };

    fetch(Config.SERVER_URL + "/occasions/" + formData._id, {
      method: "PUT",
      body: JSON.stringify(updatedData),
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

            setIsAdded(!isAdded);
            setProgress(0);
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

  // For Image
  const imgChangeHandler = (e, type) => {
    if (e.target.files[0]) {
      setUploaded(false);
      handleUpload(e.target.files[0], type);
    }
  };

  // Upload Image
  const handleUpload = (image, type) => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            if (type == "ADD") {
              setFormData({
                ...formData,
                image: url,
              });
            } else {
              setData({
                ...data,
                image: url,
              });
            }
            setUploaded(true);
            // setCategory({ ...category, category_image: url })
          });
      }
    );
  };

  // get Records
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/occasions/${id}`, {
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

        <Breadcrumb title={"PARENT CATEGORY"} pageTitle={"Update Category"} />

        {/* Add Category Form */}
        <div className="row">
          <div className={"col-md-11 mx-auto"}>
            <form
              onSubmit={submitHandler}
              className="form-horizontal form-material"
            >
              {/* Category Details */}
              <div className={"row shadow-sm bg-white py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>Category Details</h3>
                </div>

                {/* Category Name */}
                <div className={"form-group mb-3 col-md-6"}>
                  <label className={"text-dark h6"}>Category Name</label>
                  <input
                    type="text"
                    onChange={titleChangeHandler}
                    value={formData.name}
                    className="form-control"
                    placeholder={"Rose"}
                  />
                </div>
                {/* Category Slug */}
                <div className={"form-group mb-3 col-md-6"}>
                  <label className={"text-dark h6"}>Category Slug</label>
                  <input
                    type="text"
                    onChange={(evt) =>
                      setFormData({
                        ...formData,
                        slug: evt.target.value,
                      })
                    }
                    value={formData.slug}
                    className="form-control"
                    placeholder={"rose"}
                  />
                </div>

                {/* SELECT STATUS */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    SELECT STATUS
                  </label>
                  <select
                    name=""
                    id=""
                    value={formData.status}
                    onChange={(evt) => {
                      setFormData({ ...formData, status: evt.target.value });
                    }}
                    className="form-control"
                  >
                    <option value={true}>Active</option>
                    <option value={false}>Disabled</option>
                  </select>
                </div>

                {/* Short Description */}
                <div className={"form-group mb-3 col-md-6"}>
                  <label className={"text-dark h6"}>Short Description</label>
                  <input
                    type="text"
                    onChange={(evt) =>
                      setFormData({
                        ...formData,
                        shortDescription: evt.target.value,
                      })
                    }
                    value={formData.shortDescription}
                    className="form-control"
                    placeholder={"Write short description"}
                  />
                </div>

                {/* Images */}
                <div className={"form-group mb-3 col-md-6"}>
                  <div className="row">
                    <div className={!formData.image ? "col-md-8" : "col-md-12"}>
                      <label className={"text-dark h6"}>Image</label>
                      <input
                        type="file"
                        name=""
                        className="form-control"
                        onChange={(e) => imgChangeHandler(e, "ADD")}
                      />
                    </div>

                    {!uploaded ? (
                      <div className="col-md-4">
                        <span
                          className="spinner-border spinner-border-sm mr-1"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Loading..
                      </div>
                    ) : (
                      <div className="col-md-4">
                        {formData.image ? (
                          <img
                            style={{
                              height: "100px",
                              width: "100px",
                              borderRadius: "20px",
                            }}
                            className="img img-thumbnail"
                            src={formData.image}
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Image Url */}
                <div className={"form-group mb-3 col-md-6"}>
                  <label className={"text-dark h6"}>Image URL</label>
                  <input
                    type="text"
                    name=""
                    className="form-control"
                    placeholder="Image URL"
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Seo Details */}
              <div className={"row shadow-sm bg-white py-3 mt-2"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>SEO Details</h3>
                </div>

                {/* SEO Title */}
                <div className={"form-group mb-3 col-md-6"}>
                  <label className={"text-dark h6"}>SEO Title</label>
                  <input
                    type="text"
                    onChange={(evt) =>
                      setFormData({
                        ...formData,
                        seoTitle: evt.target.value,
                      })
                    }
                    value={formData.seoTitle}
                    className="form-control"
                    placeholder={"Write title"}
                  />
                </div>

                {/* SEO Description */}
                <div className={"form-group mb-3 col-md-6"}>
                  <label className={"text-dark h6"}>SEO Description</label>
                  <input
                    type="text"
                    onChange={(evt) =>
                      setFormData({
                        ...formData,
                        seoDescription: evt.target.value,
                      })
                    }
                    value={formData.seoDescription}
                    className="form-control"
                    placeholder={"Write description"}
                  />
                </div>

                <div className={"form-group col-md-12"}>
                  <button
                    disabled={loading}
                    className="btn btn-info rounded"
                    type={"submit"}
                  >
                    {loading ? (
                      <Spinner />
                    ) : (
                      <div>
                        <i className="fas fa-refresh"></i> Update
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

export default EditOccasion;
