import React, { useEffect, useState, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import M from "materialize-css";
import Config from "../../../config/Config";
import { storage } from "../../../firebase/FirebaseConfig";
import Select from "react-select";
import Breadcrumb from "../../components/Breadcrumb";

function AddProduct() {
  const history = useHistory();
  // State Variable

  const [isAddLoaded, setIsAddLoaded] = useState(true);
  const [defaultImages, setDefaultImages] = useState("");
  const [defaultImgProgress, setDefaultImgProgress] = useState("");

  const [product, setProduct] = useState({
    name: "",
    slug: "",
    mrp: "",
    sellingPrice: "",
    maximumOrderQuantity: 2,
    sku: "",
    defaultImage: "",
    images: [],
    shortDescription: "",
    description: "",
    category: "",
    occasion: "",
    tagLine: "",
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
    setProduct({
      ...product,
      slug: value
        .toLowerCase()
        .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "")
        .replace(/\s+/g, "-"),
      name: value,
    });
  };

  // Image Change
  const imageChangeHandler = (event, type) => {
    if (type == "default_image") {
      handleUpload(event.target.files[0], "", type);
    } else {
      if (event.target.files && event.target.files.length) {
        [...event.target.files].map((value, index) => {
          handleUpload(value, index);
        });
      }
    }
  };

  // File Delete Handler
  const fileDeleteHandler = (image, index, type) => {
    // Create a reference to the file to delete
    const fileRef = storage.refFromURL(image);
    // Delete the file
    fileRef
      .delete()
      .then(() => {
        // File deleted successfully
        if (type == "default_image") {
          setDefaultImages("");
          setDefaultImgProgress("");
        } else {
          let pImages = [...previewImages];
          pImages.splice(index, 1);

          let pInfos = [...progressInfos];
          pInfos.splice(index, 1);
          setProgressInfos(pInfos);
          setPreviewImages(pImages);
        }
      })
      .catch((error) => {
        // Uh-oh, an error occurred
        M.toast({ html: error, classes: "bg-danger" });
      });
  };

  // Upload Image
  const handleUpload = (image, i, type) => {
    const uploadTask = storage.ref(`products/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        if (type == "default_image") {
          setDefaultImgProgress(progress);
        } else {
          let arrs = [...progressInfos];
          arrs[i] = progress;
          setProgressInfos((old) => {
            return [...arrs];
          });
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("products")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            console.log(url);
            if (type == "default_image") {
              setDefaultImages(url);
              setProduct((old) => {
                return {
                  ...old,
                  defaultImage: url,
                };
              });
            } else {
              setPreviewImages((old) => [...old, url]);
              setProduct((old) => {
                return {
                  ...old,
                  images: [...old.images, { url }],
                };
              });
            }
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

    const addProduct = {
      ...product,
      images: previewImages,
    };

    fetch(Config.SERVER_URL + "/products", {
      method: "POST",
      body: JSON.stringify(addProduct),
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

  // const addCategoryHandler = (evt) => {
  //   const cat = {
  //     catId: evt.value,
  //     name: evt.label,
  //   };

  //   const isExist = selectCat.find((value) => {
  //     if (value.catId == cat.catId) {
  //       return true;
  //     }
  //   });

  //   if (isExist) {
  //     M.toast({ html: "Already Exist", classes: "text-light" });
  //     return;
  //   }

  //   setSelectCat([...selectCat, cat]);
  // };

  // const deleteCategoryHandler = (evt, value) => {
  //   evt.preventDefault();
  //   const filtered = selectCat.filter((cat, index) => cat.catId != value.catId);

  //   setSelectCat([...filtered]);
  // };

  // const addOccasionHandler = (evt) => {
  //   const cat = {
  //     catId: evt.value,
  //     name: evt.label,
  //   };

  //   const isExist = selectOccasion.find((value) => {
  //     if (value.catId == cat.catId) {
  //       return true;
  //     }
  //   });

  //   if (isExist) {
  //     M.toast({ html: "Already Exist", classes: "text-light" });
  //     return;
  //   }

  //   setSelectOccasion([...selectOccasion, cat]);
  // };

  // const deleteOccasionHandler = (evt, value) => {
  //   evt.preventDefault();
  //   const filtered = selectOccasion.filter(
  //     (cat, index) => cat.catId != value.catId
  //   );

  //   setSelectOccasion([...filtered]);
  // };

  return (
    <div className="page-wrapper px-0 pt-0">
      <div className={"container-fluid"}>
        {/* Bread crumb and right sidebar toggle */}
        <Breadcrumb title={"PRODUCTS"} pageTitle={"Add Product"} />

        {/* End Bread crumb and right sidebar toggle */}

        {/* Product Form */}
        <div className="row mt-2">
          <div className={"col-md-12 mx-auto"}>
            <form
              onSubmit={submitHandler}
              className="form-horizontal form-material"
            >
              {/* PRODUCT DETAILS */}
              <div className={"row shadow-sm bg-white py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>PRODUCT DETAILS</h3>
                </div>

                {/* Product Name */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    PRODUCT NAME
                  </label>
                  <input
                    type="text"
                    value={product.name}
                    onChange={titleChangeHandler}
                    className="form-control"
                    placeholder={"Enter product name"}
                  />
                </div>

                {/* Product Slug */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    PRODUCT SLUG
                  </label>
                  <input
                    type="text"
                    value={product.slug}
                    onChange={(evt) =>
                      setProduct({ ...product, slug: evt.target.value })
                    }
                    className="form-control"
                    placeholder={"Enter product slug"}
                  />
                </div>

                {/* PRODUCT MRP */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    PRODUCT MRP
                  </label>
                  <input
                    type="number"
                    value={product.mrp}
                    onChange={(evt) =>
                      setProduct({ ...product, mrp: evt.target.value })
                    }
                    className="form-control"
                    placeholder={"Enter product mrp"}
                  />
                </div>

                {/* PRODUCT SELLING PRICE */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    PRODUCT SELLING PRICE
                  </label>
                  <input
                    type="number"
                    value={product.sellingPrice}
                    onChange={(evt) =>
                      setProduct({ ...product, sellingPrice: evt.target.value })
                    }
                    className="form-control"
                    placeholder={"Enter product selling price"}
                  />
                </div>

                {/* PRODUCT SKU */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    PRODUCT SKU
                  </label>
                  <input
                    type="text"
                    value={product.sku}
                    onChange={(evt) =>
                      setProduct({ ...product, sku: evt.target.value })
                    }
                    className="form-control"
                    placeholder={"CPXY1234"}
                  />
                </div>

                {/* MAXIMUM ORDER QUANTITY */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    MAXIMUM ORDER QUANTITY
                  </label>
                  <input
                    type="text"
                    value={product.maximumOrderQuantity}
                    onChange={(evt) =>
                      setProduct({
                        ...product,
                        maximumOrderQuantity: evt.target.value,
                      })
                    }
                    className="form-control"
                    placeholder={"2"}
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
                        setProduct({ ...product, category: evt.value });
                      }}
                    />
                  </div>
                </div>

                {/* SELECT CATEGORY */}
                {/* <div className={"form-group col-md-6 overflow-none"}>
                  <label htmlFor="" className="text-dark h6 active">
                    SELECT CATEGORY
                  </label>
                  <div className="">
                    <Select
                      options={categories}
                      onChange={addCategoryHandler}
                    />
                  </div>
                </div> */}

                {/* SELECTED CATEGORY */}
                {/* <div className={"form-group col-md-6 overflow-none"}>
                  <label htmlFor="" className="text-dark h6 active">
                    SELECTED CATEGORY
                  </label>
                  <div className="border p-2">
                    {selectCat.map((value, index) => {
                      return (
                        <span
                          key={index}
                          className="badge badge-success p-2 btn mr-2 "
                          onClick={(evt) => deleteCategoryHandler(evt, value)}
                        >
                          <i className="fa fa-times text-danger"></i>
                          {value.name}
                        </span>
                      );
                    })}
                  </div>
                </div> */}

                {/* SELECT OCCASION */}
                {/* <div className={"form-group col-md-6 overflow-none"}>
                  <label htmlFor="" className="text-dark h6 active">
                    SELECT OCCASION
                  </label>
                  <div className="">
                    <Select options={occasions} onChange={addOccasionHandler} />
                  </div>
                </div> */}

                {/* SELECTED OCCASION */}
                {/* <div className={"form-group col-md-6 overflow-none"}>
                  <label htmlFor="" className="text-dark h6 active">
                    SELECTED OCCASION
                  </label>
                  <div className="border p-2">
                    {selectOccasion.map((value, index) => {
                      return (
                        <span
                          key={index}
                          className="badge badge-success p-2 btn mr-2 "
                          onClick={(evt) => deleteOccasionHandler(evt, value)}
                        >
                          <i className="fa fa-times text-danger"></i>
                          {value.name}
                        </span>
                      );
                    })}
                  </div>
                </div> */}

                {/* OCCASION */}
                <div className={"form-group col-md-6 overflow-none"}>
                  <label htmlFor="" className="text-dark h6 active">
                    SELECT OCCASION
                  </label>

                  <div className="">
                    <Select
                      options={occasions}
                      onChange={(evt) => {
                        setProduct({ ...product, occasion: evt.value });
                      }}
                    />
                  </div>
                </div>

                {/* PRODUCT TAGLINE */}
                <div className={"form-group col-md-6 overflow-none"}>
                  <label htmlFor="" className="text-dark h6 active">
                    PRODUCT TAGLINE
                  </label>

                  <div className="">
                    <Select
                      options={[
                        {
                          label: "HOT",
                          value: "HOT",
                        },
                        {
                          label: "SALE",
                          value: "SALE",
                        },
                        {
                          label: "BESTSALER",
                          value: "BESTSALER",
                        },
                      ]}
                      onChange={(evt) => {
                        setProduct({ ...product, tagLine: evt.value });
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* PRODUCT DESCRIPTION */}
              <div className={"row shadow-sm bg-white mt-3 py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>PRODUCT DESCRIPTION</h3>
                </div>

                {/* SHORT DESCRIPTION */}
                <div className={"form-group col-md-12"}>
                  <label htmlFor="" className="text-dark h6 active">
                    SHORT DESCRIPTION
                  </label>
                  <input
                    type="text"
                    onChange={(evt) =>
                      setProduct({
                        ...product,
                        shortDescription: evt.target.value,
                      })
                    }
                    name="weight"
                    value={product.shortDescription}
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
                      setProduct({
                        ...product,
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
                      setProduct({
                        ...product,
                        seoTitle: evt.target.value,
                      })
                    }
                    value={product.seoTitle}
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
                      setProduct({
                        ...product,
                        seoTags: evt.target.value,
                      })
                    }
                    name="weight"
                    value={product.seoTags}
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
                      setProduct({
                        ...product,
                        seoDescription: evt.target.value,
                      })
                    }
                    value={product.seoDescription}
                    className="form-control"
                    placeholder={"Write SEO description"}
                  />
                </div>
              </div>

              {/* PRODUCT IMAGES */}
              <div className={"row shadow-sm bg-white mt-3 py-3"}>
                <div className="col-md-12">
                  <h3 className={"my-3 text-info"}>PRODUCT IMAGES</h3>
                </div>

                {/* PRODUCT DEFAULT IMAGES */}
                <div className={"form-group col-md-6"}>
                  <label htmlFor="" className="text-dark h6 active">
                    PRODUCT DEFAULT IMAGE
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={(evt) => imageChangeHandler(evt, "default_image")}
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

                {/* Products Multiple Images */}
                <div className={"form-group col-md-12"}>
                  <label htmlFor="" className="text-dark h6 active">
                    PRODUCT IMAGES
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={imageChangeHandler}
                    className="form-control"
                  />
                </div>

                {/*Multiple Image Preview */}
                <div className="col-md-12 mb-1">
                  <div className="row">
                    {previewImages.map((img, index) => {
                      return (
                        <div className={"form-group col-md-3"} key={index}>
                          <img
                            style={{
                              maxHeight: "100%",
                              maxWidth: "100%",
                              border: "1px solid #5a5a5a",
                            }}
                            src={img}
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
                            onClick={(evt) => fileDeleteHandler(img, index)}
                          >
                            X
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Multiple image prpgress */}
                <div className="col-md-12 mb-2">
                  <div className="row">
                    {progressInfos.map((info, index) => {
                      return (
                        <div className="col-md-3" key={index}>
                          <div className="progress">
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{ width: `${info}%` }}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            >
                              {info}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Button */}
                <div className={"form-group col-md-6"}>
                  <button
                    className="btn btn-info rounded px-3 py-2"
                    type={"submit"}
                  >
                    {isAddLoaded ? (
                      <div>
                        <i className="fas fa-plus"></i> Add Product
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
}

export default AddProduct;
