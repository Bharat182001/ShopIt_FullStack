import React from 'react';
import playStore from '../../../images/playstore.png';
import appStore from '../../../images/Appstore.png';
import './Footer.css';

const Footer = () => {
  return (
    <footer id='footer'>
      <div className="leftFooter">
        <h4>DOWNLOAD OUR APP</h4>
        <p>Download App for Android and IOS mobile phone</p>
        <img src={playStore} alt="playstore" />
        <img src={appStore} alt="Appstore" />
      </div>

      <div className="midFooter">
        <h1>ShopIt.</h1>
        <p>High Quality is our first priority</p>

        <p>Copyrights 2023 &copy; DataBharat</p>
      </div>

      <div className="rightFooter">
        <h4>Follow Us</h4>
        <a href="http://instagram.com/databharat0007" target='_blank' rel='noreferrer'>Instagram</a>
        <a href="https://www.linkedin.com/in/bharat-data-0a4943182/" target='_blank' rel='noreferrer'>Linkedin</a>
        <a href="https://www.facebook.com/bharat.data.50/" target='_blank' rel='noreferrer'>Facebook</a>
      </div>
    </footer>
  )
}

export default Footer
