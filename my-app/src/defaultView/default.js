import React from 'react';
import './default.css';
import 'typeface-roboto';
import Header from './header'
class DefaultView extends React.Component {
    constructor(props) {
        super(props);
        const { on: onV, title: titleVar } = this.props.location.state.filters;
        this.state = {
            movieList: [],
            favorites: [],
            filters: {
                on: onV,
                title: titleVar,
                before: 3000,
                after: 0,
                below: 10,
                above: 0
            },
            viewMode: "loading",
            selectedMovie : {}
        };
    }


    async componentDidMount() {
        try {
            const url = "http://www.randyconnolly.com/funwebdev/3rd/api/movie/movies-brief.php?id=ALL";
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

        const updateFilter = this.state.filters;
        for (let name in filterObj) {
            updateFilter[name] = filterObj[name];
        }
        this.setState({ filters: updateFilter })
    }

    addToFavorites = movie => {
        const tempFavList = this.state.favorites;
        tempFavList.push(movie);
        this.setState({ favorites: tempFavList });
    }
    movieView = movie => {
        this.setState({selectedMovie:movie,viewMode:"movieDetails"})
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
        return (<div className="container">
            <Header />
            <FavoritesList favoritesList={this.state.favorites} />
            <MovieFilter returnFilter={this.handleFilterChange} />
            <MoviesList movieList={this.state.movieList} addFav={this.addToFavorites} filter={this.state.filters} movieView={this.movieView} />
        </div>)
    }
    MovieDetails = () => {
        return (<div className="container">
            <Header />
            <FavoritesList favoritesList={this.state.favorites} />
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
            above: 0
        }
    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
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
            on: false
        };
        this.setState({ title: filterObj.title, before: filterObj.before, after: filterObj.after, below: filterObj.below, above: filterObj.above, on: filterObj.on });
        this.props.returnFilter(filterObj);
    }
    render() {
        return (
            <div>
                <form>
                    <label id="titleHeader" htmlFor="title">Title</label> <br />
                    <input type="text" onChange={this.handleChange} defaultValue={this.state.title} name="title" /> <br />

                    <label id="titleHeader" htmlFor="year">Year</label> <br />
                    <input type="radio" id="before" name="year" value="before" />
                    <label htmlFor="male">Before</label> <input type="number" onChange={this.handleChange} name="before" /><br />
                    <input type="radio" id="after" name="year" value="after" />
                    <label htmlFor="female">After</label> <input type="number" onChange={this.handleChange} name="after" /><br />
                    <input type="radio" id="between" name="year" value="between" />
                    <label htmlFor="other">Between</label> <input type="number" onChange={this.handleChange} name="after" />
                    <input type="number" onChange={this.handleChange} name="before" /> <br />
                    <label id="titleHeader" htmlFor="rating">Rating</label> <br />
                    <label htmlFor="rating">Below:(0-10)</label>
                    <input type="number" onChange={this.handleChange} name="below" /> <br />
                    <label htmlFor="rating">Above:(0-10)</label>
                    <input type="number" onChange={this.handleChange} name="above" /><br />
                    <label htmlFor="rating">Between:(0-10)</label>
                    <input type="number" onChange={this.handleChange} name="above" />
                    <input type="number" onChange={this.handleChange} name="below" /> <br />

                </form>
                <button onClick={this.submitChange}>Filter</button>
                <button onClick={this.clearHandler}>Clear</button>

            </div>
        )
    }

}

class MoviesList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { currentFilter: this.props.filter };
    }

    filterList = () => {
        const newList = this.props.movieList.filter(movie => {
            return (movie.title.includes(this.props.filter.title) &&
                movie.release_date.substring(0, 4) > this.props.filter.after &&
                movie.release_date.substring(0, 4) < this.props.filter.before &&
                movie.ratings.average > this.props.filter.above &&
                movie.ratings.average < this.props.filter.below)

        })
        return newList
    }

    render() {
        return (

            <div>
                <h1>Movie List</h1>
                <table className="movieTable">
                    <tbody>
                        <tr>
                            <th></th>
                            <th>Title</th>
                            <th>Year</th>
                            <th>Rating</th>
                        </tr>
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

            <img className="favPoster" src={"http://image.tmdb.org/t/p/w92" + props.movie.poster} alt={props.movie.title} />

        )
    }

    render() {
        return (
            <div className="favorites">
                {this.props.favoritesList.map((favorite, index) => {
                    return <this.Favorite movie={favorite} key={favorite.id} />
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
            const url = "http://www.randyconnolly.com/funwebdev/3rd/api/movie/movies.php?id=" + this.props.movie.id;
            const response = await fetch(url);
            const jsonData = await response.json();
            console.dir(jsonData);
            this.setState({ movieData: jsonData, viewMode:"movie" });
        }
        catch (error) {
            console.error(error);
        }

    }
    Cast = (castObj) =>{
        return(
            <table>
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
                                <td><button onClick={() => this.fetchCastInfo(cast)}>View</button></td>
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
            <table>
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
    return(<div>
        <div className="leftSide">
            <div>
            <h1>{this.state.movieData.title}</h1> <button onClick={() => this.props.returnView()}><i class="fa fa-window-close" ></i></button>                    
            <img src={"http://image.tmdb.org/t/p/w185" + this.state.movieData.poster} alt={this.state.movieData.tagline} />
        </div>
        <div>
            <button onClick={() => this.props.addFav(this.props.movie)}>Add To Favorites</button>
            <p>Relase Date: {this.state.movieData.release_date}</p>
            <p>Revenue: ${this.state.movieData.revenue}</p>
            <p>Runtime: {this.state.movieData.runtime} minutes</p>
            <p>Tagline: {this.state.movieData.tagline}</p>
            <a href={"https://www.imdb.com/title/" + this.state.movieData.imdb_id}> <p>IMDB Link  </p></a>
            <a href={"https://www.themoviedb.org/movie/" + this.state.movieData.tmdb_id}> <p>TMDB Link</p> </a>
            <p>Rating: {this.state.movieData.ratings.average}</p>

        </div>
        </div>
        <div className="rightSide">
            <h1>Cast and Crew</h1>
            <button onClick={() =>this.switchView()}>Switch Cast or Crew</button>
            {this.castOrCrew()}


        </div>
    </div>

    )
}
closeCast = () =>{
    this.setState({castMember: {}, viewMode: "movie" })
}
CastView = () =>{
    
    return(
        <div>
            <div className="leftSide">
                <h1>{this.state.castMember.name}</h1>
                <img src={"http://image.tmdb.org/t/p/w185" + this.state.castMember.profile_path} alt={this.state.castMember.name} />
                <button onClick={() => this.closeCast()}>Close Cast View</button>
            </div>
            <div>
                <p>Birthday: {this.state.castMember.birthday}</p>
                <p>Biography: {this.state.castMember.biography}</p>
                <p>Place of Birth: {this.state.castMember.place_of_birth}</p>

            </div>
            <div className="rightSide">
                <h1>Cast and Crew</h1>
                <button onClick={() =>this.switchView()}>Switch Cast or Crew</button>
                {this.castOrCrew()}
            </div>

        </div>
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
                    <p id="title">{this.props.movie.title}</p>
                </td>
                <td>
                    {this.props.movie.release_date.substring(0, 4)}
                </td>
                <td>
                    <div className="rightSide">
                        {this.props.movie.ratings.average}
                        <button onClick={() => this.props.addFav(this.props.movie)} type="submit" >
                            <i className="fas fa-heart"></i></button>
                        <button onClick={()=>this.props.movieView(this.props.movie)}>View</button>
                    </div>
                </td>
            </tr>
        );
    }

}

export default DefaultView