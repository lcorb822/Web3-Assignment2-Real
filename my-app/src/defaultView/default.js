import React from 'react';
import './default.css';
import 'typeface-roboto';
import Header from './header'
import { Button, Container, Row, Col, Image } from 'react-bootstrap';
import _ from 'lodash';
import axios from 'axios';
class DefaultView extends React.Component {
    constructor(props) {
        super(props);
        const { on: onV, title: titleVar } = this.props.location.state.filters;
        let setType = ""
        if (onV){
            setType = "title"
        }
        this.state = {
            movieList: [],
            favorites: [],
            filters: {
                on: onV,
                title: titleVar,
                before: 3000,
                after: 0,
                below: 10,
                above: 0,
                type: setType
            },
            viewMode: "loading",
            selectedMovie : {}
        };
    }
    async componentDidMount() {
        try {
            const url = "https://web3assignment2.herokuapp.com/api/movies";
            const response = await fetch(url);
            const jsonData = await response.json();
            jsonData.sort((a, b) => a.title.localeCompare(b.title));
            this.setState({ movieList: jsonData, viewMode: "default" });
        }
        catch (error) {
            console.error(error);
        }
    }

    handleFilterChange = filterObj => {
        const updateFilter = JSON.parse(JSON.stringify(this.state.filters))
        //const updateFilter = this.state.filters;
        for (let name in filterObj) {
            updateFilter[name] = filterObj[name];
        }
        this.setState({ filters: updateFilter })
    }
    addToFavorites = async (movie) => {
        
        const response = await axios.post(
            'https://web3assignment2.herokuapp.com/api/favorites',
            movie,
            { headers: { 'Content-Type': 'application/json' } })         
          console.log(response.data);
          try {
            const url = "https://web3assignment2.herokuapp.com/api/favorites";
            const response = await fetch(url);
            const jsonData = await response.json();
            this.setState({ favorites: jsonData });
        }
        catch (error) {
            console.error(error);
        }
    }

    removeFavorite = async(movie) =>{
        const url = 'https://web3assignment2.herokuapp.com/api/favorites'
        const sResponse = await  axios.delete(url, {data: movie });
        console.log(sResponse);
        try {
            const url = "https://web3assignment2.herokuapp.com/api/favorites";
            const response = await fetch(url);
            const jsonData = await response.json();
            this.setState({ favorites: jsonData });
        }
        catch (error) {
            console.error(error);
        }
    }
  
    movieView = movie => {
        this.setState({selectedMovie:movie});
        this.setState({viewMode:"movieDetails"});
    }
    defaultView = () => {
        this.setState({selectedMovie:{},viewMode:"default"})
    }

    Loading = () => {
        return (
            <img src="https://media2.giphy.com/media/xUbVzuNjpWe0E/giphy.gif?cid=790b76116961966c0be53a69dc4fb7e4679210f10742be1f&rid=giphy.gif" alt="loading gif" />
        )
    }
    Default = () => {
        return (<div className="mainContainer">
            <Header />
            <FavoritesList favoritesList={this.state.favorites} movieView={this.movieView} removeFav={this.removeFavorite}  />
            <MovieFilter returnFilter={this.handleFilterChange} className="item-filter" />
            <MoviesList movieList={this.state.movieList} addFav={this.addToFavorites} filter={this.state.filters} movieView={this.movieView} className="item-list"/>
        </div>)
    }
    MovieDetails = () => {
        return (<div className="container">
            <Header /> 
            <FavoritesList favoritesList={this.state.favorites} movieView={this.movieView} removeFav={this.removeFavorite}/>
            <LargeMovie movie={this.state.selectedMovie} addFav={this.addToFavorites} returnView={this.defaultView} />           
        </div>
        

        )
    }
    render() {
        if (this.state.viewMode == "loading") {
            return this.Loading();
        }
        else if (this.state.viewMode == "default") {
            return this.Default();

        } else if (this.state.viewMode == "movieDetails") {
            return this.MovieDetails();
        }

    }
}

class MovieFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            before: 3000,
            after: 0,
            below: 10,
            above: 0,
            type: ""
        }
    }

    handleChange = event => {
        let newType = ""
        switch(event.target.name) {
            case "title":
                newType = "title";
              break;
            case "before":
                newType = "year";
              break;
            case "after":
                newType = "year";
            break;
            case "above":
                newType = "rating";
              break;
            case "below":
                newType = "rating"
              break
          }
        this.setState({
            [event.target.name]: event.target.value, type: newType
        })

    }
    submitChange = () => {
        const filterObj = this.state;
        filterObj.on = true;
        this.props.returnFilter(filterObj);
    }
    clearHandler = () => {
        const filterObj = {
            title: "",
            before: 3000,
            after: 0,
            below: 10,
            above: 0,
            on: false,
            type: ""
        };
        this.setState({ title: filterObj.title, before: filterObj.before, after: filterObj.after, below: filterObj.below, above: filterObj.above, on: filterObj.on, type:filterObj.type });
        this.props.returnFilter(filterObj);
    }
    render() {
        return (
            <div className="item-filter">
                <h1>Movie Filter</h1>
                <form>
                    <label id="titleHeader" htmlFor="title">Title</label> <br />
                    <input type="text" onChange={this.handleChange} defaultValue={this.state.title} name="title" /> <br />

                    <label id="titleHeader" htmlFor="year">Year</label> <br />
                   
                     
                    <label htmlFor="other">Between</label> <br /> <input type="number" onChange={this.handleChange} name="after" /> 
                    <input type="number" onChange={this.handleChange} name="before" /> <br />
                    <label id="titleHeader" htmlFor="rating">Rating</label> <br />
        
                    <label htmlFor="rating">Between:(0-10)</label> <br />
                    <input type="number" onChange={this.handleChange} name="above" />
                    <input type="number" onChange={this.handleChange} name="below" /> <br />

                </form>
                <Button variant="outline-dark" onClick={this.submitChange}>Filter</Button>
                <Button variant="outline-dark"  onClick={this.clearHandler}>Clear</Button>

            </div>
        )
    }

}

class MoviesList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
                        filterList : [], filter: {}
        };
    }
    async componentDidMount() {
        if( this.props.filter.on) {
            if (this.props.filter.type == "title"){
                try {
                    const url = "https://web3assignment2.herokuapp.com/api/find/title/"+this.props.filter.title;
                    const response = await fetch(url);
                    const jsonData = await response.json();
                    jsonData.sort((a, b) => a.title.localeCompare(b.title));
                   
                    const newObj = JSON.parse(JSON.stringify(this.props.filter));
                    this.setState({filterList: jsonData, filter: newObj});
                }
                catch (error) {
                    console.error(error);
                }
            }
            
            if (this.props.filter.type == "year"){
                try {
                    const url = `https://web3assignment2.herokuapp.com/api/find/year/${this.props.movieList.filter.after}/${this.props.movieList.filter.before}`;
                    const response = await fetch(url);
                    const jsonData = await response.json();
                    jsonData.sort((a, b) => a.title.localeCompare(b.title));
                    this.setState({filterList: jsonData});
                }
                catch (error) {
                    console.error(error);
                }
            }   
            
            if (this.props.filter.type == "rating"){
                try {
                    const url = `https://web3assignment2.herokuapp.com/api/rating/${this.props.filter.above}/${this.props.movieList.filter.below}`;
                    const response = await fetch(url);
                    const jsonData = await response.json();
                    jsonData.sort((a, b) => a.title.localeCompare(b.title));
                    this.setState({filterList: jsonData});
                }
                catch (error) {
                    console.error(error);
                }
            }
            }
    
        else{
            this.setState({filterList: this.props.movieList});
        }
    
     }

    async componentDidUpdate(prevProps,prevState) {
        if(!_.isEqual(prevProps.filter,this.props.filter)){
        if( this.props.filter.on) {
            if (this.props.filter.type == "title"){
                try {
                    const url = "https://web3assignment2.herokuapp.com/api/find/title/"+this.props.filter.title;
                    const response = await fetch(url);
                    const jsonData = await response.json();
                    jsonData.sort((a, b) => a.title.localeCompare(b.title));
                    this.setState({filterList: jsonData});
                }
                catch (error) {
                    console.error(error);
                }
            }
            
            if (this.props.filter.type == "year"){
                try {
                    const url = `https://web3assignment2.herokuapp.com/api/find/year/${this.props.filter.after}/${this.props.filter.before}`;
                    const response = await fetch(url);
                    const jsonData = await response.json();
                    jsonData.sort((a, b) => a.title.localeCompare(b.title));
                    this.setState({filterList: jsonData});
                }
                catch (error) {
                    console.error(error);
                }
            }   
            
            if (this.props.filter.type == "rating"){
                try {
                    const url = `https://web3assignment2.herokuapp.com/api/find/rating/${this.props.filter.above}/${this.props.filter.below}`;
                    const response = await fetch(url);
                    const jsonData = await response.json();
                    jsonData.sort((a, b) => a.title.localeCompare(b.title));
                    this.setState({filterList: jsonData});
                }
                catch (error) {
                    console.error(error);
                }
            }
            }
    
        else{
            this.setState({filterList: this.props.movieList});
        }
    }
    }

     filterList = () => { 
         return this.state.filterList;
    }


    render() {
        return (

            <div className="item-list">
                <h1>Movie List</h1>
                <table className="movieTable">
                   <thead>
                        <tr>
                            <th></th>
                            <th>Title</th>
                            <th>Year</th>
                            <th>Rating</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.filterList().map((movie, index) => {
                            return <SingleMovie movie={movie} key={movie.id} addFav={this.props.addFav} movieView={this.props.movieView} />
                        })}

                    </tbody>
                </table>
            </div>
        )
    }



}

class FavoritesList extends React.Component {
    constructor(props) {
        super(props);
    }
    Favorite = (props) => {
        return (
            <div className="favPoster">
                <Button variant="danger" className="removeButton" onClick={()=>props.remFav(props.movie)}><i className="fa fa-window-close" ></i></Button>
            <img  onClick={()=>this.props.movieView(props.movie)} src={"http://image.tmdb.org/t/p/w92" + props.movie.poster} alt={props.movie.title} />
            </div>
        )
    }

    render() {
        return (
            <div className="item-favorite">
                {this.props.favoritesList.map((favorite, index) => {
                    return <this.Favorite movie={favorite} key={favorite.id} movieView={this.props.movieView} remFav={this.props.removeFav}/>
                })}
            </div>
        )
    }
}
class LargeMovie extends React.Component {
    constructor(props) {
        super(props);
        this.state = { movieData: {}, castCrew:"cast",castMember:{},viewMode:"loading" };
    }

    async componentDidMount() {
       
        try {
            const url = "https://web3assignment2.herokuapp.com/api/movies/" + this.props.movie.id;
          
            
            const response = await fetch(url);
            const jsonData = await response.json();
            this.setState({ movieData: jsonData[0], viewMode:"movie" });
        }
        catch (error) {
            console.error(error);
        }

    }
    async componentDidUpdate(prevProps) {
        if(this.props.movie.id !== prevProps.movie.id){
        try {
            const url = "https://web3assignment2.herokuapp.com/api/movies/" + this.props.movie.id;
            const response = await fetch(url);
            const jsonData = await response.json();
            this.setState({ movieData: jsonData[0], viewMode:"movie" });
        }
        catch (error) {
            console.error(error);
        }
    }

    }

    Cast = (castObj) =>{
        return(
            <table className="castTable">
                 <tbody>
                        <tr>
                            <th>Character</th>
                            <th>Name</th>
                            <th></th>
                        </tr>
                    {castObj.map((cast,index) => {
                        return(
                            <tr key={cast.id}>
                                <td>{cast.character}</td>
                                <td>{cast.name} </td>
                                <td><Button variant="outline-info" onClick={() => this.fetchCastInfo(cast)}>View</Button></td>
                            </tr>)
                    })}
 
                    </tbody>
            </table>
        )   
    }
    async fetchCastInfo (castObj){
        try {
            let url = `https://api.themoviedb.org/3/person/${castObj.id}?api_key=fbf53756fe16ca36e16c1ed7a5df8032`;
            const response = await fetch(url);
            const castMem = await response.json();
            this.setState({ castMember: castMem, viewMode: "cast" });
        }
        catch (error) {
            console.error(error);
        }
    }

    Crew = (crewObj) =>{
        return(
            <table className="crewTable">
                 <tbody>
                        <tr>
                            <th>Department</th>
                            <th>Job</th>
                            <th>Name</th>
                        </tr>
                    {crewObj.map((crew,index) => {
                        return(
                            <tr key={crew.credit_id}>
                                <td>{crew.department}</td>
                                <td>{crew.job} </td>
                                <td>{crew.name}</td>
                            </tr>)
                    })}
 
                    </tbody>
            </table>
        )   
    }
    Loading = () => {
        return (
            <img src="https://media2.giphy.com/media/xUbVzuNjpWe0E/giphy.gif?cid=790b76116961966c0be53a69dc4fb7e4679210f10742be1f&rid=giphy.gif" alt="loading gif" />
        )
    }
castOrCrew = () =>{
    if (this.state.castCrew === "cast"){
        return this.Cast(this.state.movieData.production.cast) ;
    }
    if (this.state.castCrew === "crew"){
        return this.Crew(this.state.movieData.production.crew) ;
    }
    
    }
    switchView = () =>{
        if(this.state.castCrew === "cast"){
            this.setState({castCrew:"crew"});
        }
        else if (this.state.castCrew === "crew") {
            this.setState({castCrew:"cast"})
    }
}
MovieView = () =>{
    return(<>
        
        <div className="item-movie-left">
            
            <h1>{this.state.movieData.title}</h1> <Button variant="outline-danger" onClick={() => this.props.returnView()}><i className="fa fa-window-close" ></i></Button>                    
          <div>  <Image className="p-3" src={"http://image.tmdb.org/t/p/w185" + this.state.movieData.poster} alt={this.state.movieData.tagline} rounded /></div>
        
            <div><Button variant="outline-success" onClick={() => this.props.addFav(this.props.movie)}>Add To Favorites</Button> </div>
            <p><strong>Relase Date:</strong> {this.state.movieData.release_date}</p>
            <p><strong>Revenue:</strong> ${this.state.movieData.revenue}</p>
            <p><strong>Runtime:</strong> {this.state.movieData.runtime} minutes</p>
            <p><strong>Tagline:</strong> {this.state.movieData.tagline}</p>
            <a href={"https://www.imdb.com/title/" + this.state.movieData.imdb_id}> <p>IMDB Link  </p></a>
            <a href={"https://www.themoviedb.org/movie/" + this.state.movieData.tmdb_id}> <p>TMDB Link</p> </a>
            <p><strong>Rating:</strong> {this.state.movieData.ratings.average}</p> 
        </div>
        
        <div className="item-movie-right">
            <h1>Cast and Crew</h1>
            <Button variant="info" onClick={() =>this.switchView()}>Switch Cast or Crew</Button>
            {this.castOrCrew()}


        </div>
        
    </>

    )
}
closeCast = () =>{
    this.setState({castMember: {}, viewMode: "movie" })
}
CastView = () =>{
    
    return(
        <>
            <div className="item-leftSide">
                <h1>{this.state.castMember.name}</h1>
               <div> <img className="p-1" src={"http://image.tmdb.org/t/p/w185" + this.state.castMember.profile_path} alt={this.state.castMember.name} /></div>
                <button onClick={() => this.closeCast()}>Close Cast View</button>
                <p><strong>Birthday:</strong> {this.state.castMember.birthday}</p>
                <p><strong>Biography:</strong> {this.state.castMember.biography}</p>
                <p><strong>Place of Birth:</strong> {this.state.castMember.place_of_birth}</p>

            </div>
            <div className="item-rightSide">
                <h1>Cast and Crew</h1>
                <Button variant="info" onClick={() =>this.switchView()}>Switch Cast or Crew</Button>
                {this.castOrCrew()}
            </div>

        </>
    )

}


    render() {
        if (this.state.viewMode == "loading") {
            return this.Loading();
        }
        else if (this.state.viewMode == "movie") {
            return this.MovieView();

        } else if (this.state.viewMode == "cast") {
            return this.CastView();
        }
    }
    }


class SingleMovie extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <tr className="singleRow">

                <td>
                    <img src={"http://image.tmdb.org/t/p/w92" + this.props.movie.poster} alt={this.props.movie.title} />
                </td>
                <td>
                    <p id="title" onClick={()=>this.props.movieView(this.props.movie)}>{this.props.movie.title}</p>
                </td>
                <td>
                    {this.props.movie.release_date.substring(0, 4)}
                </td>
                <td>
                    
                        {this.props.movie.ratings.average}
                        
                </td>
                <td>
                <div className="rightSide">
                        <Button variant="outline-success" onClick={() => this.props.addFav(this.props.movie)} type="submit" >
                            <i className="fas fa-heart"></i></Button>
                        <Button variant="outline-dark" onClick={()=>this.props.movieView(this.props.movie)}>View</Button>
                    </div>
                </td>
            </tr>
        );
    }

}

export default DefaultView