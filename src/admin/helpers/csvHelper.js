import date from "date-and-time";
import Papa from "papaparse";
export const createCoupon = {
  headers: [
    { label: "couponCode", key: "couponCode" },
    { label: "applyFor", key: "applyFor" },
    { label: "discountType", key: "discountType" },
    { label: "discount", key: "discount" },
    { label: "description", key: "description" },
    { label: "minimumAmount", key: "minimumAmount" },
    { label: "numberOfUsesTimes", key: "numberOfUsesTimes" },
    { label: "startDate", key: "startDate" },
    { label: "expiryDate", key: "expiryDate" },
  ],
  data: [
    {
      couponCode: "WELCOMETEST",
      applyFor: "NEW_USER",
      discountType: "AMOUNT",
      discount: 20,
      description: "",
      minimumAmount: 1000,
      numberOfUsesTimes: 1,
      startDate: date.format(new Date(), "DD-MM-YYYY"),
      expiryDate: date.format(new Date(), "DD-MM-YYYY"),
    },
  ],
};

export const pincode = {
  headers: [
    { label: "pincode", key: "pincode" },
    { label: "state", key: "state" },
    { label: "city", key: "city" },
  ],
  dummyData: [
    {
      pincode: "999999",
      state: "BANGAL",
      city: "KOLKATA",
    },
  ],
};

export const newsletter = {
  headers: [{ label: "email", key: "email" }],
  dummyData: [
    {
      email: "codescroller@gmail.com",
    },
  ],
};
