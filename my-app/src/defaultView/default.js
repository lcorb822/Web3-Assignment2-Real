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
          this.props.returnFilter(filterObj);
        }
        render(){
            return(
                <div>
                    <form>
                    <label for="title">Title</label> <br/>
                    <input type="text" onChange={this.handleChange} defaultValue=""  name="title"/> <br/>

                    <label for="year">Year</label> <br/>
                    <input type="radio" id="before" name="year" value="before"/>
                    <label for="male">Before</label> <input type="number" onChange={this.handleChange}  name="before"/><br/>
                    <input type="radio" id="after" name="year" value="after"/>
                    <label for="female">After</label> <input type="number" onChange={this.handleChange}   name="after"/><br/>
                    <input type="radio" id="between" name="year" value="between"/>
                    <label for="other">Between</label> <input type="number" onChange={this.handleChange}   name="after"/>
                                                       <input type="number" onChange={this.handleChange}   name="before"/> <br/>
                    <label for="rating">Rating</label> <br/>
                    <label for="rating">Below:(0-10)</label>
                    <input type="range"  name="below" min="0" max="10"/>
                    <label for="rating">Above:(0-10)</label>
                    <input type="range"  name="above" min="0" max="10"/>
                    <label for="rating">Between:(0-10)</label>
                    <input type="range"  name="above" min="0" max="10"/>
                    <input type="range"  name="belows" min="0" max="10"/> <br/>
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
            this.state = { currentFilter:{}};
        }

        componentDidMount() {
            console.log("ComponentDidMount called");

                    this.setState({currentFilter:this.props.filter});   

        }
/*
        componentDidUpdate  (prevProps,prevState) {
            console.log("componentDidUpdate called");
            console.log(this.props.filter ,prevProps.filter)
            if (this.state.currentFilter !==this.props.filter ) {
            try{
            console.log(this.props.filter.on);
            if (this.props.filter.on){
                const newList = this.props.movieList.filter(movie => (movie.title.includes(this.props.filter.title)))
                this.setState({filterList:newList,currentFilter:this.props.filter});
                //this.state.filterList = newList;
            }
            else{
                this.setState({filterList:this.props.movieList});
               // this.state.filterList= this.props.movieList;
            }
        }
            catch(error) {
            console.log(error)
            }
        }
        }
        */
        filterList = () =>{
            const newList = this.props.movieList.filter(movie => (movie.title.includes(this.props.filter.title)));
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