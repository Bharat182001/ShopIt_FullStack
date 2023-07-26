import React from "react";
import "./aboutSection.css";
import { Avatar, Typography } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import { MdFacebook } from "react-icons/md";

const About = () => {
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/dcowugl70/image/upload/v1690300372/avatars/qefdf0e9lbg3gaigxrbt.png"
              alt="Founder"
            />
            <Typography>Bharat Data</Typography>
            <span>
              <strong>ShopIt</strong><hr />An E-Commerce Website made with ❤️ by Bharat Data for Online Shopping of goods and services.
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Our Social Media Links</Typography>
            <a href="https://instagram.com/databharat0007" target="blank">
              <InstagramIcon className="instagramSvgIcon" />
            </a>
            <a href="https://www.facebook.com/bharat.data.50/" target="blank">
              <MdFacebook className="facebookSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
