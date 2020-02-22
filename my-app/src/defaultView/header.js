import React from 'react';
import { Link } from 'react-router-dom';
class Header extends React.Component {
   

    render(){
        return(
            <div>
        
        <Link to='/home'> <i className="fas fa-theater-masks"></i> </Link>
            <button>About</button>
            </div>
        )
    }
}
export default Header