import React, { createContext, useReducer, useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import LeftNavigation from "./LeftNavigation";
import TopNavigation from "./TopNavigation";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

import { initialState, adminReducer } from "../reducer/AdminReducer";
// import Profile from "./pages/Profile";
// import PageNoteFound from "./pages/PageNotFound";

// import ParentCategory from "./pages/ParentCategory";
// import Category from "./pages/Category";

// ================   Products  =====================
import AddProduct from "./pages/products/AddProduct";
import ProductList from "./pages/products/ProductList";
import EditProduct from "./pages/products/EditProduct";
import AddProductFromCSV from "./pages/products/AddProductFromCSV";
import EditProductFromCSV from "./pages/products/EditProductFromCSV";

// ================   Coupons  =====================
import AddCoupon from "./pages/coupons/AddCoupon";
import CouponList from "./pages/coupons/CouponList";
import EditCoupon from "./pages/coupons/EditCoupon";
import EditCouponFromCSV from "./pages/coupons/EditCouponFromCSV";
import AddCouponFromCSV from "./pages/coupons/AddCouponFromCSV";

// ================   Occasions  =====================
import AddOccasion from "./pages/occasions/AddOccasion";
import OccasionList from "./pages/occasions/OccasionList";
import EditOccasion from "./pages/occasions/EditOccasion";
import EditOccasionFromCSV from "./pages/occasions/EditOccasionFromCSV";
import AddOccasionFromCSV from "./pages/occasions/AddOccasionFromCSV";

// import ShippingMethodList from "./pages/shippingMethod/ShippingMethodList";
// import AddShippingMethod from "./pages/shippingMethod/AddShippingMethod";
// import EditShippingMethod from "./pages/shippingMethod/EditShippingMethod";
// import FlavourList from "./pages/flavours/FlavourList";
// import AddFlavour from "./pages/flavours/AddFlavour";
// import EditFlavour from "./pages/flavours/EditFlavour";
// import ColorList from "./pages/colors/ColorList";
// import AddColor from "./pages/colors/AddColor";
// import EditColor from "./pages/colors/EditColor";

// import DealsList from "./pages/deals/DealsList";
// import AddDeals from "./pages/deals/AddDeals";
// import EditDeals from "./pages/deals/EditDeals";

// ================   Pincodes  =====================
import PincodeList from "./pages/pincode/PincodeList";
import AddPincode from "./pages/pincode/AddPincode";
import EditPincode from "./pages/pincode/EditPincode";
import EditPincodeFromCSV from "./pages/pincode/EditPincodeFromCSV";
import AddPincodeFromCSV from "./pages/pincode/AddPincodeFromCSV";

// import ShapeList from "./pages/shapes/ShapeList";
// import AddShape from "./pages/shapes/AddShape";
// import EditShape from "./pages/shapes/EditShape";
// import NewOrders from "./pages/orders/NewOrders";

// import ViewOrder from "./pages/orders/ViewOrder";
// import OrderList from "./pages/orders/OrderList";
// import Setting from "./pages/setting/Setting";
// import MainSlider from "./pages/banners/MainSlider";
// import NextToSlider from "./pages/banners/NextToSlider";
// import DailyBestSaleBanner from "./pages/banners/DailyBestSaleBanner";
// import CategoryPageBanner from "./pages/banners/CategoryPageBanner";
// import OfferBanner from "./pages/banners/OfferBanner";

// Category
import CategoryList from "./pages/category/CategoryList";
import AddCategory from "./pages/category/AddCategory";
import EditCategory from "./pages/category/EditCategory";
import AddCategoryFromCSV from "./pages/category/AddCategoryFromCSV";
import EditCategoryFromCSV from "./pages/category/EditCategoryFromCSV";

// Newsletter
import NewsletterList from "./pages/newsletters/NewsletterList";
import AddNewsletter from "./pages/newsletters/AddNewsletter";
import EditNewsletter from "./pages/newsletters/EditNewsletter";
import AddNewsletterFromCSV from "./pages/newsletters/AddNewsletterFromCSV";
import EditNewsletterFromCSV from "./pages/newsletters/EditNewsletterFromCSV";

// Customer
import CustomerList from "./pages/customers/CustomerList";
// import CustomerReports from "./pages/reports/CustomerReports";
import EditCustomer from "./pages/customers/EditCustomer";
import ViewCustomer from "./pages/customers/ViewCustomer";

// import SubCategoryList from "./pages/subCategory/SubCategoryList";

// import AddFlaourFromCSV from "./pages/flavours/AddFlavourFromCSV";
// import EditFlavourFromCSV from "./pages/flavours/EditFlavourFomCSV";
// import AddShapeFromCSV from "./pages/shapes/AddShapeFromCSV";
// import EditShapeFromCSV from "./pages/shapes/EditShapeFromCSV";
// import AddColorFromCSV from "./pages/colors/AddColorFromCSV";
// import EditColorFromCSV from "./pages/colors/EditColorFromCSV";

// import AddAdonProductFromCSV from "./pages/adonProducts/AddAdonProductFromCSV";
// import EditAdonProductFromCSV from "./pages/adonProducts/EditAdonProductFromCSV";

// import ProductReports from "./pages/reports/ProductReports";

// import AddSubCategory from "./pages/subCategory/AddSubCategory";
// import EditSubCategory from "./pages/subCategory/EditSubCategory";
// import AddSubCategoryFromCSV from "./pages/subCategory/AddSubCategoryFromCSV";
// import EditSubCategoryFromCSV from "./pages/subCategory/EditSubCategoryFromCSV";
import ForgotPassword from "./pages/ForgotPassword";
import EnterOtp from "./pages/EnterOtp";
import CreateNewPassword from "./pages/CreateNewPassword";
// import TypeList from "./pages/types/TypeList";
// import AddType from "./pages/types/AddType";
// import EditType from "./pages/types/EditType";
// import AddTypeFromCSV from "./pages/types/AddTypeFromCSV";
// import EditTypeFromCSV from "./pages/types/EditTypeFromCSV";

// Supervisor
import SupervisorList from "./pages/supervisors/SupervisorList";
import AddSupervisor from "./pages/supervisors/AddSupervisor";
import EditSupervisor from "./pages/supervisors/EditSupervisor";
import SupervisorDashboard from "./pages/supervisors/SupervisorDashboard";
import Footer from "./Footer";
import AssignDeliveryBoys from "./pages/supervisors/AssignDeliveryBoys";
import SupervisorDeliveryBoys from "./pages/supervisors/SupervisorDeliveryBoys";
import DeliveryBoyList from "./pages/deliveryBoys/DeliveryBoyList";
import AddDeliveryBoy from "./pages/deliveryBoys/AddDeliveryBoy";
import EditDeliveryBoy from "./pages/deliveryBoys/EditDeliveryBoy";
import AssignPincodes from "./pages/supervisors/AssignPincodes";
import SupervisorPincodeList from "./pages/supervisors/SupervisorPincodeList";
import BucketList from "./pages/buckets/BucketList";
import AddBucket from "./pages/buckets/AddBucket";

// Create Context
export const AdminContext = createContext();

// Create Context
// const Routingo = () => {
//   const history = useHistory();
//   // Branch Context
//   const { state, dispatch } = useContext(AdminContext);
//   useEffect(() => {
//     const branch = JSON.parse(localStorage.getItem("branch"));
//     if (branch) {
//       dispatch({ type: "BRANCH", payload: branch });
//       // history.push("/")
//     } else {
//       history.push("/branch/login");
//     }
//   }, []);

//   return (
//     <Switch>
//       {/* <Route exact path="/branch/profile" component={Profile} /> */}
//

//       {/* Sub Category */}

//       <Route exact path="/branch/category" component={Category} />
//       <Route exact path="/branch/categories" component={SubCategoryList} />
//       <Route exact path="/branch/categories/add" component={AddSubCategory} />
//       <Route
//         exact
//         path="/branch/categories/edit/:id"
//         component={EditSubCategory}
//       />
//       <Route
//         exact
//         path="/branch/categories/addByCSV"
//         component={AddSubCategoryFromCSV}
//       />
//       <Route
//         exact
//         path="/branch/categories/editByCSV"
//         component={EditSubCategoryFromCSV}
//       />

//

//       {/* Adon Products */}
//       <Route exact path="/branch/adonProducts" component={AdonProductList} />
//       <Route exact path="/branch/adonProduct/add" component={AddAdonProduct} />
//       <Route
//         exact
//         path="/branch/adonProduct/addByCSV"
//         component={AddAdonProductFromCSV}
//       />
//       <Route
//         exact
//         path="/branch/adonProduct/editByCSV"
//         component={EditAdonProductFromCSV}
//       />

//       <Route
//         exact
//         path="/branch/adonProduct/edit/:id"
//         component={EditAdonProduct}
//       />

//

//

//       {/* Deals */}
//       <Route exact path="/branch/deals" component={DealsList} />
//       <Route exact path="/branch/deals/add" component={AddDeals} />
//       <Route exact path="/branch/deals/edit/:id" component={EditDeals} />

//       {/* Shipping Method */}
//       <Route
//         exact
//         path="/branch/shippingMethods"
//         component={ShippingMethodList}
//       />
//       <Route
//         exact
//         path="/branch/shippingMethod/add"
//         component={AddShippingMethod}
//       />
//       <Route
//         exact
//         path="/branch/shippingMethod/edit/:id"
//         component={EditShippingMethod}
//       />
//       {/* Flavour */}
//       <Route exact path="/branch/flavours" component={FlavourList} />
//       <Route exact path="/branch/flavour/add" component={AddFlavour} />
//       <Route
//         exact
//         path="/branch/flavour/addByCSV"
//         component={AddFlaourFromCSV}
//       />
//       <Route
//         exact
//         path="/branch/flavour/editByCSV"
//         component={EditFlavourFromCSV}
//       />
//       <Route exact path="/branch/flavour/edit/:id" component={EditFlavour} />

//       {/* Shape */}
//       <Route exact path="/branch/shapes" component={ShapeList} />
//       <Route exact path="/branch/shape/add" component={AddShape} />
//       <Route exact path="/branch/shape/addByCSV" component={AddShapeFromCSV} />
//       <Route
//         exact
//         path="/branch/shape/editByCSV"
//         component={EditShapeFromCSV}
//       />
//       <Route exact path="/branch/shape/edit/:id" component={EditShape} />

//       {/* Types */}
//       <Route exact path="/branch/types" component={TypeList} />
//       <Route exact path="/branch/type/add" component={AddType} />
//       <Route exact path="/branch/type/addByCSV" component={AddTypeFromCSV} />
//       <Route exact path="/branch/type/editByCSV" component={EditTypeFromCSV} />
//       <Route exact path="/branch/type/edit/:id" component={EditType} />

//       {/* Colors */}
//       <Route exact path="/branch/colors" component={ColorList} />
//       <Route exact path="/branch/color/addByCSV" component={AddColorFromCSV} />
//       <Route
//         exact
//         path="/branch/color/editByCSV"
//         component={EditColorFromCSV}
//       />
//       <Route exact path="/branch/color/add" component={AddColor} />
//       <Route exact path="/branch/color/edit/:id" component={EditColor} />

//       {/* Orders */}
//       <Route exact path="/branch/newOrders" component={NewOrders} />
//       <Route exact path="/branch/order/show/:id" component={ViewOrder} />
//       <Route exact path="/branch/orders" component={OrderList} />

//       {/* Reports */}

//       <Route exact path="/branch/report/products" component={ProductReports} />

//       {/* Settings */}
//       <Route exact path="/branch/setting" component={Setting} />

//       {/* Images */}
//       <Route exact path="/branch/slider" component={MainSlider} />
//       <Route exact path="/branch/nextToSlider" component={NextToSlider} />
//       <Route
//         exact
//         path="/branch/bestSaleBanner"
//         component={DailyBestSaleBanner}
//       />
//       <Route
//         exact
//         path="/branch/categoryPageBanner"
//         component={CategoryPageBanner}
//       />
//       <Route exact path="/branch/offerBanner" component={OfferBanner} />

//       {/* Page Not Found */}
//       <Route exact path="/*" component={PageNoteFound} />
//     </Switch>
//   );
// };

// Create Context
const Routing = () => {
  const history = useHistory();
  // Branch Context
  const { state, dispatch } = useContext(AdminContext);
  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("admin"));
    if (admin) {
      dispatch({ type: "ADMIN", payload: admin });
      // history.push("/")
    } else {
      history.push("/admin/login");
    }
  }, []);

  return (
    <Switch>
      <Route exact path="/admin" component={Dashboard} />
      <Route exact path="/admin/login" component={Login} />
      <Route exact path="/admin/forgot-password" component={ForgotPassword} />
      <Route exact path="/admin/enter-otp" component={EnterOtp} />
      <Route
        exact
        path="/admin/create-password"
        component={CreateNewPassword}
      />

      {/* Coupons */}
      <Route exact path="/admin/coupons" component={CouponList} />
      <Route exact path="/admin/coupon/add" component={AddCoupon} />
      <Route exact path="/admin/coupon/addByCSV" component={AddCouponFromCSV} />
      <Route
        exact
        path="/admin/coupon/editByCSV"
        component={EditCouponFromCSV}
      />
      <Route exact path="/admin/coupon/edit/:id" component={EditCoupon} />

      {/*  Pincode */}
      <Route exact path="/admin/pincodes" component={PincodeList} />
      <Route exact path="/admin/pincode/add" component={AddPincode} />
      <Route
        exact
        path="/admin/pincode/addByCSV"
        component={AddPincodeFromCSV}
      />
      <Route
        exact
        path="/admin/pincode/editByCSV"
        component={EditPincodeFromCSV}
      />
      <Route exact path="/admin/pincode/edit/:id" component={EditPincode} />

      {/* Categories */}
      <Route exact path="/admin/categories" component={CategoryList} />
      <Route exact path="/admin/category/add" component={AddCategory} />
      <Route
        exact
        path="/admin/category/addByCSV"
        component={AddCategoryFromCSV}
      />
      <Route
        exact
        path="/admin/category/editByCSV"
        component={EditCategoryFromCSV}
      />
      <Route exact path="/admin/category/edit/:id" component={EditCategory} />

      {/* Occasions */}
      <Route exact path="/admin/occasions" component={OccasionList} />
      <Route exact path="/admin/occasion/add" component={AddOccasion} />
      <Route
        exact
        path="/admin/occasion/addByCSV"
        component={AddOccasionFromCSV}
      />
      <Route
        exact
        path="/admin/occasion/editByCSV"
        component={EditCategoryFromCSV}
      />
      <Route exact path="/admin/occasion/edit/:id" component={EditOccasion} />

      {/* Supervisor */}
      <Route exact path="/admin/supervisors" component={SupervisorList} />
      <Route exact path="/admin/supervisor/add" component={AddSupervisor} />
      <Route
        exact
        path="/admin/supervisor/edit/:id"
        component={EditSupervisor}
      />
      <Route
        exact
        path="/admin/supervisor/dashboard/:id"
        component={SupervisorDashboard}
      />
      <Route
        exact
        path="/admin/supervisor/assignPincodes/:id"
        component={AssignPincodes}
      />
      <Route
        exact
        path="/admin/supervisor/assignDeliveryBoys/:id"
        component={AssignDeliveryBoys}
      />
      <Route
        exact
        path="/admin/supervisor/deliveryBoys/:id"
        component={SupervisorDeliveryBoys}
      />

      <Route
        exact
        path="/admin/supervisor/pincodes/:id"
        component={SupervisorPincodeList}
      />

      {/* Delivery boys */}
      <Route exact path="/admin/deliveryBoys" component={DeliveryBoyList} />
      <Route exact path="/admin/deliveryBoy/add" component={AddDeliveryBoy} />
      <Route
        exact
        path="/admin/deliveryBoy/edit/:id"
        component={EditDeliveryBoy}
      />

      {/* Newsletter */}
      <Route exact path="/admin/newsletters" component={NewsletterList} />
      <Route exact path="/admin/newsletter/add" component={AddNewsletter} />
      <Route
        exact
        path="/admin/newsletter/addByCSV"
        component={AddNewsletterFromCSV}
      />
      <Route
        exact
        path="/admin/newsletter/editByCSV"
        component={EditNewsletterFromCSV}
      />
      <Route
        exact
        path="/admin/newsletter/edit/:id"
        component={EditNewsletter}
      />

      {/* Customer */}
      <Route exact path="/admin/customers" component={CustomerList} />
      <Route exact path="/admin/customer/edit/:id" component={EditCustomer} />
      <Route exact path="/admin/customer/show/:id" component={ViewCustomer} />
      {/* <Route exact path="/admin/report/customers" component={CustomerReports} /> */}

      {/* Products */}
      <Route exact path="/admin/products" component={ProductList} />
      <Route exact path="/admin/product/add" component={AddProduct} />
      <Route
        exact
        path="/admin/product/addByCSV"
        component={AddProductFromCSV}
      />
      <Route exact path="/admin/product/edit/:id" component={EditProduct} />
      <Route
        exact
        path="/admin/product/editByCSV"
        component={EditProductFromCSV}
      />

      {/* Buckets */}
      <Route exact path="/admin/buckets" component={BucketList} />
      <Route exact path="/admin/bucket/add" component={AddBucket} />
      {/* <Route
        exact
        path="/admin/product/addByCSV"
        component={AddProductFromCSV}
      />
      <Route exact path="/admin/product/edit/:id" component={EditProduct} />
      <Route
        exact
        path="/admin/product/editByCSV"
        component={EditProductFromCSV}
      /> */}
    </Switch>
  );
};
const AdminRouter = () => {
  const [state, dispatch] = useReducer(adminReducer, initialState);
  return (
    <div id="main-wrapper">
      <AdminContext.Provider value={{ state: state, dispatch: dispatch }}>
        <Router>
          <TopNavigation />
          <LeftNavigation />

          <Routing />
          <Footer />
        </Router>
      </AdminContext.Provider>
    </div>
  );
};

export default AdminRouter;
