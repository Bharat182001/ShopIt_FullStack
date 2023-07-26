import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Search.css";
import MetaData from '../layout/MetaData';

const Search = () => {

    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate(); // using {history} is no longer in use, so use this hook

    const searchSubmitHandler = (e) => {
        e.preventDefault(); // avoids reloading of form on submitting

        if(keyword.trim()) { // spaces hata dega, ek word hona chahie
            navigate(`/products/${keyword}`);
        }
        else {
            navigate("/products");
        }
    }

  return (
    <Fragment>
      <MetaData title='Search A Product -- ShopIt' />

      <form className="searchBox" onSubmit={searchSubmitHandler}>
          <input 
              type="text" 
              placeholder='Search a product ...'
              onChange={(e)=>setKeyword(e.target.value)} 
          />
          <input type="submit" value="Search" />
      </form>
    </Fragment>
  )
}

export default Search
