import React from 'react';
import { Link } from 'react-router-dom';
class Header extends React.Component {
    constructor(props) {
        super(props);
    }

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