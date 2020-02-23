import React from 'react';
import './default.css';
import 'typeface-roboto';
import Header from './header'
class DefaultView extends React.Component {
    constructor(props) {
        super(props);
        const { on:onV,title:titleVar } = this.props.location.state.filters;
        this.state = { movieList: [],
                       favorites:[],
                        filters:{on:onV,
                        title:titleVar,
                        before:3000,
                        after:0,
                        below:10,
                        above:0},
                        isLoading : true};
       }


       async componentDidMount() {
        try {
        const url = "http://www.randyconnolly.com/funwebdev/3rd/api/movie/movies-brief.php?id=ALL";
        const response = await fetch(url);
        const jsonData = await response.json();
        jsonData.sort((a, b) => a.title.localeCompare(b.title));
        this.setState( {movieList: jsonData, isLoading : false } );
        }
        catch (error) {
        console.error(error);
        }
   
           
       }
       handleFilterChange = filterObj =>{
           
           const updateFilter = this.state.filters;
           for(let name in filterObj){
               updateFilter[name] = filterObj[name];
           }
           this.setState({filters:updateFilter})

       }

       addToFavorites = movie =>{
           const tempFavList = this.state.favorites;
           tempFavList.push(movie);
        this.setState({favorites: tempFavList});
    }
    
    Loading = () =>{
        return(
            <img src="https://media2.giphy.com/media/xUbVzuNjpWe0E/giphy.gif?cid=790b76116961966c0be53a69dc4fb7e4679210f10742be1f&rid=giphy.gif" alt="loading gif"/>
        )
    }
    
       render(){
           
           return(
            this.state.isLoading ?  this.Loading() : (
               <div className="container">
                <Header />
                <FavoritesList favoritesList={this.state.favorites}/>
                <MovieFilter returnFilter={this.handleFilterChange} />
                <MoviesList movieList={this.state.movieList} addFav={this.addToFavorites} filter={this.state.filters} />
               </div>)
           )
       }
    }

    class MovieFilter extends React.Component {
        constructor(props){
            super(props);
            this.state = {title:"",
                          before:3000,
                          after:0,
                          below:10,
                          above:0
                        }
        }

        handleChange = event =>{
            this.setState({
                [event.target.name]: event.target.value
            })
        }
        submitChange = () =>{
           const filterObj = this.state;
           filterObj.on = true;
           this.props.returnFilter(filterObj);
        }
        clearHandler = () =>{
          const filterObj = {title:"",
          before:3000,
          after:0,
          below:10,
          above:0,
           on : false};
          this.setState({title:filterObj.title,before:filterObj.before,after:filterObj.after,below:filterObj.below,above:filterObj.above,on:filterObj.on});
          this.props.returnFilter(filterObj);
        }
        render(){
            return(
                <div>
                    <form>
                    <label id="titleHeader" htmlFor="title">Title</label> <br/>
                    <input type="text" onChange={this.handleChange} defaultValue={this.state.title}  name="title"/> <br/>

                    <label id="titleHeader" htmlFor="year">Year</label> <br/>
                    <input type="radio" id="before" name="year" value="before"/>
                    <label htmlFor="male">Before</label> <input type="number" onChange={this.handleChange}  name="before"/><br/>
                    <input type="radio" id="after" name="year" value="after"/>
                    <label htmlFor="female">After</label> <input type="number" onChange={this.handleChange}   name="after"/><br/>
                    <input type="radio" id="between" name="year" value="between"/>
                    <label htmlFor="other">Between</label> <input type="number" onChange={this.handleChange}   name="after"/>
                                                       <input type="number" onChange={this.handleChange}   name="before"/> <br/>
                    <label id="titleHeader" htmlFor="rating">Rating</label> <br/>
                    <label htmlFor="rating">Below:(0-10)</label>
                    <input type="number" onChange={this.handleChange}   name="below"/> <br/>
                    <label htmlFor="rating">Above:(0-10)</label>
                    <input type="number" onChange={this.handleChange}   name="above"/><br/>
                    <label htmlFor="rating">Between:(0-10)</label>
                    <input type="number" onChange={this.handleChange}   name="above"/>
                    <input type="number" onChange={this.handleChange}   name="below"/> <br/>
                    
                    </form>
                    <button onClick={this.submitChange}>Filter</button>
                    <button onClick={this.clearHandler}>Clear</button>

                </div>
            )
        }

    }

    class MoviesList extends React.Component {
        constructor(props){
            super(props);
            this.state = { currentFilter:this.props.filter};
        }

        filterList = () =>{
            const newList = this.props.movieList.filter(movie =>{ 
            return    (movie.title.includes(this.props.filter.title) && 
            movie.release_date.substring(0,4) > this.props.filter.after &&
            movie.release_date.substring(0,4) < this.props.filter.before &&
            movie.ratings.average > this.props.filter.above &&
            movie.ratings.average < this.props.filter.below)
            
            })
            return newList
        }

        render(){
            return(

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
                {this.filterList().map((movie,index) => {
                    return <SingleMovie movie={movie} key={movie.id} addFav={this.props.addFav}/>
                    })}
    
                    </tbody>
                </table>
                </div>
            )
        }
    
    
    
    }
    
    class FavoritesList extends React.Component{
        constructor(props){
            super(props);
        } 
        Favorite = (props) =>{
            return(
                
                    <img className="favPoster" src={"http://image.tmdb.org/t/p/w92"+props.movie.poster} alt={props.movie.title} />
                
            )
        }

        render(){
            return(
                <div className="favorites">
                {this.props.favoritesList.map((favorite,index) => {
                    return <this.Favorite movie={favorite} key={favorite.id}/>
                    })}
                </div>
            )
        }
    }
    class LargeMovie extends React.Component {
        constructor(props){
            super(props);
            this.state = {movieData:{},isLoading: true};
        }

        async componentDidMount(){
            try {
                const url = "http://www.randyconnolly.com/funwebdev/3rd/api/movie/movies.php?id="+this.props.movie.id;
                const response = await fetch(url);
                const jsonData = await response.json();
                this.setState( {movieData: jsonData, isLoading : false } );
                }
                catch (error) {
                console.error(error);
                }

        }

        render(){
            return(
                <div>
                    <div>
                        <h1>{this.state.movieData.title}</h1>
                        <img src={"http://image.tmdb.org/t/p/w185"+this.state.movieData.poster} alt={this.state.movieData.tagline} />
                    </div>
                    <div>
                        <button>Add To Favorites</button>
                        <p>Relase Date:{this.state.movieData.release_date}</p>
                        <p>Revenue:{this.state.movieData.revenue}</p>
                        <p>Runtime:{this.state.movieData.runtime}</p>
                        <p>Tagline:{this.state.movieData.tagline}</p>
                        <p>IMDB Link:{"https://www.imdb.com/title/"+this.state.movieData.imdb_id}</p>
                        <p>TMDB Link:{"https://www.themoviedb.org/movie/"+this.state.movieData.tmdb_id}</p>
                        <p>Overview:{this.state.movieData.details.overview}</p>
                        <p>Average Rating:{this.state.movieData.ratings.average}</p>
                    </div>

                </div>
            )
        }
    }
   
    class SingleMovie extends React.Component {
        constructor(props){
            super(props);
        }
    
    
        render(){
            return(
                <tr className="singleRow">
                       
                        <td>    
                        <img src={"http://image.tmdb.org/t/p/w92"+this.props.movie.poster} alt={this.props.movie.title}/>
                        </td>
                        <td>
                        <p id="title">{this.props.movie.title}</p>
                        </td>
                        <td>
                        {this.props.movie.release_date.substring(0,4)}
                        </td>
                        <td>
                           <div className="rightSide">
                               {this.props.movie.ratings.average}
                                <button onClick={() => this.props.addFav({poster:this.props.movie.poster,title:this.props.movie.title, id:this.props.movie.id})}  type="submit" >
                                <i className="fas fa-heart"></i></button>                 
                            </div>         
                            </td>
                    </tr>
            );
        }
    
    }

export default DefaultView