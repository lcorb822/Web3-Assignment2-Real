import React from "react";
import { Link } from 'react-router-dom';
class About extends React.Component {
    constructor(props){
        super(props);
    }
 
    render() {
        return (
            <div>
                <div className="aboutHeader">
                    <h1>Web 3 Assignment 1</h1>
                    <h2>By Logan Corbett</h2>

                </div>
                <div>
                    <h2>Technology used:</h2>
                    <ul>
                        <li>React</li>
                        <li>VSCode</li>
                        <li>Not used: CSS</li>
                    </ul>
                </div>
                <div>
                    <h3>Credits:</h3>
                    <p>Photos taken from: https://unsplash.com/photos/evlkOfkQ5rE and https://media2.giphy.com/media/xUbVzuNjpWe0E/giphy.gif?cid=790b76116961966c0be53a69dc4fb7e4679210f10742be1f&rid=giphy.gif</p>
                </div>
               <Link to='/home'> <button>Return to home</button></Link>
               <Link to={{ pathname: '/defaultView',
                                state: {
                                filters: {on:false,
                                         title:""}
                                    }
                               }}> <button>Return to Movie List</button> </Link>
                </div>
        );
    }
}
export default About