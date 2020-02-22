import React from 'react';
import './default.css';
import 'typeface-roboto';
import Header from './header'
class DefaultView extends React.Component {
    constructor(props) {
        super(props);
        this.state = { movieList: [],
                       favorites:[],
                        filters:{on:false,title:"",minYear:0,maxYear:3000,rating:0} };
       }


       async componentDidMount() {
        try {
        const url = "http://www.randyconnolly.com/funwebdev/3rd/api/movie/movies-brief.php?id=ALL";
        const response = await fetch(url);
        const jsonData = await response.json();

        this.setState( {movieList: jsonData } );
        }
        catch (error) {
        console.error(error);
        }
       }

       filterOn = () =>{
           this.state.filters.on = true;
           this.setState({filters:this.state.filters})
       }
       addToFavorites = movie =>{
        this.state.favorites.push(movie);
        this.setState({favorites: this.state.favorites})
    }

       render(){
           return(
               <div className="container">
                <Header />
               <FavoritesList favoritesList={this.state.favorites}/>
               <MoviesList movieList={this.state.movieList} addFav={this.addToFavorites}/>
               </div>
           )
       }
    }

    class MovieFilter extends React.Component {
        constructor(props){
            super(props);
        }

    }

    class MoviesList extends React.Component {
        constructor(props){
            super(props);
        }
        handleFilter = () =>{
            if (this.props.filter.on){
                const newList = this.props.movieList.filter(movie => {
                    return (movie.title.includes(this.state.filters.title)  )
                }

                )
            }
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
                {this.props.movieList.map((movie,index) => {
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