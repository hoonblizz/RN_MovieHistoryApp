import React from 'react';
import {ScrollView, StyleSheet, Text, View, Alert} from 'react-native';
import { ListItem, SearchBar, Button } from 'react-native-elements';
import Keys from '../../key/Keys';
import { getLocalData, setLocalData } from '../apis/localStorage';
import { keyNames } from '../apis/keyNames';
import { sortTotalMovieData } from '../apis/appUtil';
import { TotalMovieListContext } from '../apis/contexts';

/*
Sample Search result
{"Search":[{"Title":"Spider-Man","Year":"2002","imdbID":"tt0145487","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BZDEyN2NhMjgtMjdhNi00MmNlLWE5YTgtZGE4MzNjMTRlMGEwXkEyXkFqcGdeQXVyNDUyOTg3Njg@._V1_SX300.jpg"},{"Title":"The Amazing Spider-Man","Year":"2012","imdbID":"tt0948470","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BMjMyOTM4MDMxNV5BMl5BanBnXkFtZTcwNjIyNzExOA@@._V1_SX300.jpg"},{"Title":"Spider-Man 2","Year":"2004","imdbID":"tt0316654","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BMzY2ODk4NmUtOTVmNi00ZTdkLTlmOWYtMmE2OWVhNTU2OTVkXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg"},{"Title":"Spider-Man 3","Year":"2007","imdbID":"tt0413300","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BYTk3MDljOWQtNGI2My00OTEzLTlhYjQtOTQ4ODM2MzUwY2IwXkEyXkFqcGdeQXVyNTIzOTk5ODM@._V1_SX300.jpg"},{"Title":"Spider-Man: Homecoming","Year":"2017","imdbID":"tt2250912","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BNTk4ODQ1MzgzNl5BMl5BanBnXkFtZTgwMTMyMzM4MTI@._V1_SX300.jpg"},{"Title":"The Amazing Spider-Man 2","Year":"2014","imdbID":"tt1872181","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BOTA5NDYxNTg0OV5BMl5BanBnXkFtZTgwODE5NzU1MTE@._V1_SX300.jpg"},{"Title":"Spider-Man: Into the Spider-Verse","Year":"2018","imdbID":"tt4633694","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BMjMwNDkxMTgzOF5BMl5BanBnXkFtZTgwNTkwNTQ3NjM@._V1_SX300.jpg"},{"Title":"Along Came a Spider","Year":"2001","imdbID":"tt0164334","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BOTVlY2VhMWEtYmRlOC00YWVhLWEzMDktZWJlYzNiMWJmZTIwXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg"},{"Title":"Spider","Year":"2002","imdbID":"tt0278731","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BMmY4OGRmNWMtNmIyNS00YWQ5LWJmMGUtMDI3MWRlMmQ0ZDQzL2ltYWdlXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg"},{"Title":"Spider-Man: The Animated Series","Year":"1994–1998","imdbID":"tt0112175","Type":"series","Poster":"https://m.media-amazon.com/images/M/MV5BMmQ1NzBlYmItNmZkZi00OTZkLTg5YTEtNTI5YjczZjk3Yjc1XkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg"}],"totalResults":"417","Response":"True"}
*/
class MovieSearchContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchKeyword: '',
      searchURL: '',
      searchData: []
    };
    this.searchGapTimer = 0;  // for setTimeout
    this.apiKey = Keys.movieAPI;

    this.handleOnAddToList = this.handleOnAddToList.bind(this);
    this.onHandleSearch = this.onHandleSearch.bind(this);

  }

  onHandleSearch = (searchKeyword) => {
    this.setState({ searchKeyword });
    clearTimeout(this.searchGapTimer);

    if(searchKeyword !== '' && searchKeyword.length > 1) {

      this.searchGapTimer = setTimeout(() => {

        fetch(Keys.movieSearchAPIURL(this.state.searchKeyword, this.apiKey))
        .then(res => res.json())
        .then(resData => {

          // Sort result by Year
          this.setState({
            searchData: resData.Search.sort((a, b) => { return b.Year > a.Year }).slice()
          });

        })
        .catch(err => {

        });
      }, 1000);

    } else {
      this.setState({searchData: []});  // empty data
    }

  };

  storeInLocal(updatedTotalMovieData) {

    const newList = sortTotalMovieData(updatedTotalMovieData);  // Sort

    setLocalData(keyNames.watchedMovieList, newList)
    .then(() => {
      this.props.setTotalMovieDataFnc(newList);
      Alert.alert('Added to your list');
    });

  }

  handleOnAddToList = (selectedMovie) => {
    // Find movie info then pass to parent
    fetch(Keys.movieGetAPIURL(selectedMovie.imdbID, this.apiKey))
    .then(res => res.json())
    .then(resData => {

      // Movie found
      //this.props.handleAddToList(resData); // send to parent
      // Attach new properties
      let newMovie = JSON.parse(JSON.stringify(resData));
      newMovie[keyNames.myRating] = 1;
      newMovie[keyNames.watched] = new Date().getFullYear() + ' ' + (new Date().getMonth() + 1) + ' ' + new Date().getDate();

      let newList = [];
      getLocalData(keyNames.watchedMovieList)
      .then(watchedMovieList => {
        if(watchedMovieList) {
          newList = JSON.parse(watchedMovieList);
        }
        newList.push(newMovie);
        this.storeInLocal(newList);
      });

    });

  }


  render() {

    let searchData = this.state.searchData;

    return (

      <View>
        <SearchBar
          placeholder="Search Movie..."
          onChangeText={text => this.onHandleSearch(text)}
          onClear={text => this.onHandleSearch('')}
          value={this.state.searchKeyword}
        />
        <ScrollView style={{marginBottom: 200}}>
          {
            searchData.map((el, i) => (
              <ListItem
                key={el.imdbID}
                leftAvatar={{ source: { uri: el.Poster } }}
                title={el.Title}
                subtitle={el.Year}
                rightElement={
                  <View>
                    <Button
                      title="Add"
                      type="outline"
                      onPress={() => { this.handleOnAddToList(el) }}
                    />
                  </View>
                }
              />
            ))
          }
        </ScrollView>
      </View>

    );
  }
}

const MovieSearchContainerWithContext = (Component) => {
   return (props) => {
     return (
       <TotalMovieListContext.Consumer>
          {({totalMovieData, setTotalMovieDataFnc}) => {
             return <Component {...props} setTotalMovieDataFnc={setTotalMovieDataFnc} />
          }}
       </TotalMovieListContext.Consumer>
     );
   };
};


export default MovieSearchContainerWithContext(MovieSearchContainer);
