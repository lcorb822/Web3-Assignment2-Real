import React from 'react';
import { Link } from 'react-router-dom';
class Header extends React.Component {
   

    render(){
        return(
            <div className="item-header">
        
        <Link to='/home'> <i  className="fas fa-theater-masks" id="homeButton"></i> </Link>
            <button className="aboutButton">About</button>
            </div>
        )
    }
}
export default Header