import React from 'react';
import './default.css';
import 'typeface-roboto';
class DefaultView extends React.Component {
    constructor(props) {
        super(props);
        this.state = { movieList: [],
                       favorites:[],
                        filters:{title:"",year:0,rating:0} };
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

       addToFavorites = movie =>{
        this.state.favorites.push(movie);
        this.setState({favorites: this.state.favorites})
    }

       render(){
           return(
               <MoviesList movieList={this.state.movieList} addFav={this.addToFavorites}/>
           )
       }
    }


    class MoviesList extends React.Component {
        constructor(props){
            super(props);
        }
        
        render(){
            return(

            <div>
                <h1>Movie List</h1>
                <table className="movieTable">
                    <th></th>
                    <th>Title</th>
                    <th>Year</th>
                    <th>Rating</th>
                
                {this.props.movieList.map((movie,index) => {
                    return <SingleMovie movie={movie} key={movie.id} addFav={this.props.addFav}/>
                    })}
    
    
                </table>
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
                               {this.props.movie.ratings.popularity}
                                <button onClick={() => this.props.addFav({poster:this.props.movie.poster,title:this.props.movie.title, id:this.props.movie.id})}  type="submit" >
                                <i className="fas fa-heart"></i>
                                    
                                </button>                 
                            </div>         
                            </td>
                    </tr>
            );
        }
    
    }

export default DefaultView