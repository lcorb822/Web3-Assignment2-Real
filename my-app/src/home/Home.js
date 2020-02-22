import React from "react";
import "./home.css";
import { Link } from 'react-router-dom';
class Home extends React.Component {
    render() {
        let imgUrl = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80";
        return (
            <div className='banner'
                style={{
                    backgroundImage: `url(${imgUrl})`,
                    height: '1200px',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                }}>
                <div className='middleText' >
                    <h1>Movie Browser</h1>

                    <form>
                    <label for="title">Title</label>
                     <input type="text" id="movTitle" name="title"/>
                    </form>
                   <Link to='/defaultView'> <button>Show Matching Movies</button>  <button>Show All Movies</button> </Link>
                </div>
            </div>
        );
    }
}
export default Home