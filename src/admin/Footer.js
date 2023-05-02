import React, { useContext } from "react";
import { AdminContext } from "./AdminRouter";

function Footer() {
  const { state, dispatch } = useContext(AdminContext);

  return state ? (
    <footer className="footer">© {new Date().getFullYear()} Esta Global</footer>
  ) : null;
}

export default Footer;
