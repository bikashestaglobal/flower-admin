import React, { useEffect, useState, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import M from "materialize-css";
import Config from "../../../config/Config";
import { storage } from "../../../firebase/FirebaseConfig";
import Select from "react-select";
import Breadcrumb from "../../components/Breadcrumb";
import Spinner from "../../components/Spinner";

function AddBucket() {
  const history = useHistory();
  const [isAddLoaded, setIsAddLoaded] = useState(true);
  const [defaultImages, setDefaultImages] = useState("");
  const [defaultImgProgress, setDefaultImgProgress] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    mrp: "",
    sellingPrice: "",
    validity: "",
    image: "",
    shortDescription: "",
    description: "",
    category: "",
    occasion: "",
    seoTitle: "",
    seoDescription: "",
    seoTags: "",
  });
  const editorRef = useRef(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [progressInfos, setProgressInfos] = useState([]);

  const [categories, setCategories] = useState([]);
  const [occasions, setOccasions] = useState([]);

  const [selectCat, setSelectCat] = useState([]);
  const [selectOccasion, setSelectOccasion] = useState([]);

  const titleChangeHandler = (evt) => {
    const value = evt.target.value;
    setFormData({
      ...formData,
      slug: value
        .toLowerCase()
        .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "")
        .replace(/\s+/g, "-"),
      name: value,
    });
  };

  // Image Change
  const imageChangeHandler = (event) => {
    handleUpload(event.target.files[0]);
  };

  // File Delete Handler
  const fileDeleteHandler = (image) => {
    // Create a reference to the file to delete
    const fileRef = storage.refFromURL(image);
    // Delete the file
    fileRef
      .delete()
      .then(() => {
        // File deleted successfully
        setDefaultImages("");
        setDefaultImgProgress("");
      })
      .catch((error) => {
        // Uh-oh, an error occurred
        M.toast({ html: error, classes: "bg-danger" });
      });
  };

  // Upload Image
  const handleUpload = (image) => {
    const uploadTask = storage.ref(`buckets/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setDefaultImgProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("buckets")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            setDefaultImages(url);
            setFormData((old) => {
              return {
                ...old,
                image: url,
              };
            });
          });
      }
    );
  };

  // Submit Handler
  const submitHandler = (evt) => {
    setIsAddLoaded(false);
    evt.preventDefault();

    // const filteredCat = selectCat.map((value) => {
    //   return value.catId;
    // });
    // const filteredOccasion = selectOccasion.map((value) => {
    //   return value.catId;
    // });

    fetch(Config.SERVER_URL + "/buckets", {
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
          setIsAddLoaded(true);
        },
        (error) => {
          setIsAddLoaded(true);
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  };

  // get Category
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/categories?skip=0&limit=0`, {
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
            let f = result.body.map((v) => {
              return { label: v.name, value: v._id };
            });

            setCategories(f);
          } else {
            M.toast({ html: result.message, classes: "bg-danger" });
          }
        },
        (error) => {
          M.toast({ html: error, classes: "bg-danger" });
        }
      );
  }, []);

  // get Occasion
  useEffect(() => {
    fetch(`${Config.SERVER_URL}/occasions?limit=0&skip=0`, {
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
            let modifyForSelect = result.body.map((value) => {
              return { label: value.name, value: value._id };
            });
            setOccasions(modifyForSelect);
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
    <div className="page-wrapper px-0 pt-0">
      <div className={"container-fluid"}>
        {/* Bread crumb and right sidebar toggle */}
        <Breadcrumb title={"BUCKET"} pageTitle={"Add Bucket"} />

        {/* End Bread crumb and right sidebar toggle */}

        {/* Buckrt Form */}
        <div className="row mt-2">
          <div className={"col-md-12 mx-auto"}>
            <form
              onSubmit={submitHandler}
              className="form-horizontal form-material"
            >
              {/* BUCKET DETAILS */}
              <div className={"row shadow-sm bg-white py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>BUCKET DETAILS</h3>
                </div>

                {/* BUCKET NAME */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    BUCKET NAME
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={titleChangeHandler}
                    className="form-control"
                    placeholder={"Enter bucket name"}
                  />
                </div>

                {/* BUCKET SLUG */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    BUCKET SLUG
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(evt) =>
                      setFormData({ ...formData, slug: evt.target.value })
                    }
                    className="form-control"
                    placeholder={"Enter bucket slug"}
                  />
                </div>

                {/* BUCKET MRP */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    BUCKET MRP
                  </label>
                  <input
                    type="number"
                    value={formData.mrp}
                    onChange={(evt) =>
                      setFormData({ ...formData, mrp: evt.target.value })
                    }
                    className="form-control"
                    placeholder={"Enter bucket mrp"}
                  />
                </div>

                {/* BUCKET SELLING PRICE */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    BUCKET SELLING PRICE
                  </label>
                  <input
                    type="number"
                    value={formData.sellingPrice}
                    onChange={(evt) =>
                      setFormData({
                        ...formData,
                        sellingPrice: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter selling price"}
                  />
                </div>

                {/* BUCKET VALIDITY IN DAYS */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    BUCKET VALIDITY IN DAYS
                  </label>
                  <input
                    type="text"
                    value={formData.validity}
                    onChange={(evt) =>
                      setFormData({
                        ...formData,
                        validity: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"Enter number of days"}
                  />
                </div>

                {/* SELECT CATEGORY */}
                <div className={"form-group col-md-6 overflow-none"}>
                  <label htmlFor="" className="text-dark h6 active">
                    SELECT CATEGORY
                  </label>
                  <div className="">
                    <Select
                      options={categories}
                      onChange={(evt) => {
                        setFormData({ ...formData, category: evt.value });
                      }}
                    />
                  </div>
                </div>

                {/* SELECT OCCASION */}
                <div className={"form-group col-md-6 overflow-none"}>
                  <label htmlFor="" className="text-dark h6 active">
                    SELECT OCCASION
                  </label>

                  <div className="">
                    <Select
                      options={occasions}
                      onChange={(evt) => {
                        setFormData({ ...formData, occasion: evt.value });
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* BUCKET DESCRIPTION */}
              <div className={"row shadow-sm bg-white mt-3 py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>BUCKET DESCRIPTION</h3>
                </div>

                {/* SHORT DESCRIPTION */}
                <div className={"form-group col-md-12"}>
                  <label htmlFor="" className="text-dark h6 active">
                    SHORT DESCRIPTION
                  </label>
                  <input
                    type="text"
                    onChange={(evt) =>
                      setFormData({
                        ...formData,
                        shortDescription: evt.target.value,
                      })
                    }
                    name="weight"
                    value={formData.shortDescription}
                    className="form-control"
                    placeholder={"Write Short Descriptions"}
                  />
                </div>

                {/* LONG DESCRIPTION */}
                <div className={"form-group col-md-12"}>
                  <label htmlFor="" className="text-dark h6 active">
                    LONG DESCTRIPTION
                  </label>
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
                      height: 200,

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
                        "help",
                        "wordcount",
                      ],
                      toolbar:
                        "undo redo | blocks | " +
                        "bold italic forecolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | " +
                        "removeformat | help table image media anchor link",
                      content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    }}
                  />
                </div>
              </div>

              {/* SEO DETAILS */}
              <div className={"row shadow-sm bg-white py-3 mt-2"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>SEO DETAILS</h3>
                </div>

                {/* SEO TITLE */}
                <div className={"form-group mb-3 col-md-6"}>
                  <label className={"text-dark h6"}>SEO TITLE</label>
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

                {/* SEO TAGS */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    SEO TAGS
                  </label>
                  <input
                    type="text"
                    onChange={(evt) =>
                      setFormData({
                        ...formData,
                        seoTags: evt.target.value,
                      })
                    }
                    name="weight"
                    value={formData.seoTags}
                    className="form-control"
                    placeholder={"Write tags with comma separated"}
                  />
                </div>

                {/* SEO DESCRIPTION */}
                <div className={"form-group mb-3 col-md-12"}>
                  <label className={"text-dark h6"}>SEO DESCRIPTION</label>
                  <textarea
                    type="text"
                    onChange={(evt) =>
                      setFormData({
                        ...formData,
                        seoDescription: evt.target.value,
                      })
                    }
                    value={formData.seoDescription}
                    className="form-control"
                    placeholder={"Write SEO description"}
                  />
                </div>
              </div>

              {/* BUCKET IMAGE */}
              <div className={"row shadow-sm bg-white mt-3 py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>BUCKET IMAGE</h3>
                </div>

                {/* BUCKET IMAGE */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    BUCKET IMAGE
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={(evt) => imageChangeHandler(evt)}
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  {defaultImages ? (
                    <div className={"form-group"}>
                      <img
                        style={{
                          maxHeight: "200px",
                          maxWidth: "200px",
                          border: "1px solid #5a5a5a",
                        }}
                        src={defaultImages}
                      />
                      <button
                        style={{
                          position: "absolute",
                          top: "40%",
                          right: "45%",
                        }}
                        type="button"
                        className="btn bg-light text-danger"
                        title={"Delete Image"}
                        onClick={(evt) =>
                          fileDeleteHandler(defaultImages, "", "default_image")
                        }
                      >
                        X
                      </button>
                    </div>
                  ) : (
                    ""
                  )}

                  {defaultImgProgress ? (
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${defaultImgProgress}%` }}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        {defaultImgProgress}%
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                {/* Submit Button */}
                <div className={"form-group col-md-6"}>
                  <button
                    className="btn btn-info rounded px-3 py-2"
                    type={"submit"}
                  >
                    {isAddLoaded ? (
                      <div>
                        <i className="fas fa-plus"></i> Add Bucket
                      </div>
                    ) : (
                      <Spinner />
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
}

export default AddBucket;
