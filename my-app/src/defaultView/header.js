import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

class Header extends React.Component {
   

    render(){
        return(
            <div className="item-header">
        
        <Link to='/home'> <i  className="fas fa-theater-masks" id="homeButton"></i> </Link>
            <Link to='/about'><Button variant="info" className="aboutButton">About</Button> </Link>
            </div>
        )
    }
}
export default Header