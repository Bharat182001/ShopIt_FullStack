import React from "react";
import { MdErrorOutline } from "react-icons/md";
import "./NotFound.css";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="PageNotFound">
      <MdErrorOutline />

      <Typography> Page Not Found </Typography>
      <Link to="/">Home</Link>
    </div>
  );
};

export default NotFound;
