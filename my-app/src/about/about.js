import React from "react";
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
class About extends React.Component {
    constructor(props){
        super(props);
    }
 
    render() {
        return (
            <div className="aboutPage">
                <div className="aboutHeader">
                    <h1>Web 3 Assignment 2</h1>
                    <h2>By Logan Corbett</h2>
                    <br/>

                </div>
                <div className="mainText">
                    <h2>Technology used:</h2>
                    <ul>
                        <li>React</li>
                        <li>NodeJS</li>
                        <li>MongoDB Atlas</li>
                        <li>VSCode</li>
                        <li>React Bootstrap</li>
                    </ul>

                    <h2>API Links</h2>

                    <p><a href="https://web3assignment2.herokuapp.com/api/movies"> Full Movie List Link</a></p>
                   <p> <a href="https://web3assignment2.herokuapp.com/api/movies/2">Specific Movie Based on ID link</a></p>
                   <p> <a href="https://web3assignment2.herokuapp.com/api/find/title/The">Title Substring Link</a></p>
                   <p><a href="https://web3assignment2.herokuapp.com/api/find/rating/5/8">Rating Link</a></p>
                   <p> <a href="https://web3assignment2.herokuapp.com/api/find/year/2010/2011"> API Years Link</a></p>
                </div>
                <div>
                    <h3>Credits:</h3>
                    <p>Photos taken from: <a href="https://unsplash.com/photos/evlkOfkQ5rE">here</a> and <a href="https://media2.giphy.com/media/xUbVzuNjpWe0E/giphy.gif?cid=790b76116961966c0be53a69dc4fb7e4679210f10742be1f&rid=giphy.gif">here</a></p>
                </div>
               <Link to='/home'> <Button variant="primary" >Return to home</Button></Link>
               <Link to={{ pathname: '/defaultView',
                                state: {
                                filters: {on:false,
                                         title:""}
                                    }
                               }}> <Button variant="info">Return to Movie List</Button> </Link>
                </div>
        );
    }
}
export default About