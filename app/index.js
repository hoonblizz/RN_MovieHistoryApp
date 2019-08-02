
import React, { Component } from 'react';
import {Platform, StyleSheet, Text, View, TextInput, Button, Alert} from 'react-native';

import { createBottomTabNavigator, createAppContainer, NavigationEvents } from 'react-navigation';
import { getLocalData, setLocalData } from './apis/localStorage';
import StatusBarControl from './components/StatusBarControl';
import MoviesWatchedList from './components/MoviesWatchedList';
import MovieSearchContainer from './components/MovieSearchContainer';

// https://stackoverflow.com/questions/50412762/react-navigation-how-to-pass-data-across-different-screens-in-tabnavigator

class ListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalMovieData: [],
      isLoading: true
    };
    this.loadData = this.loadData.bind(this);
    this.setDataToStorage = this.setDataToStorage.bind(this);
    this.handleOnDateSelected = this.handleOnDateSelected.bind(this);
    this.handleOnFinishRating = this.handleOnFinishRating.bind(this);
    this.handleOnRemoveFromList = this.handleOnRemoveFromList.bind(this);
  }

  loadData() {
    // For Rerendering list.
    this.setState({isLoading: true}, async () => {

      const watchedMovieList = await getLocalData('watchedMovieList');
      if(watchedMovieList) {
        this.setState({
          totalMovieData: JSON.parse(watchedMovieList),
          isLoading: false
        });
      } else {
        this.setState({
          isLoading: false
        });
      }
    });
  }

  setDataToStorage(selectedMovie) { // selectedMovie is modified movie (rating or date)
    var foundIndex = this.state.totalMovieData.findIndex(el => el.imdbID === selectedMovie.imdbID);
    let cpyTotalMovieData = this.state.totalMovieData;
    cpyTotalMovieData[foundIndex] = selectedMovie;

    setLocalData('watchedMovieList', cpyTotalMovieData)
    .then(() => {
      this.setState({
        totalMovieData: cpyTotalMovieData
      });
    })
    .catch((err) => {

    });

  }

  handleOnFinishRating(selectedMovie, selectedRating) { // obj, int
    let cpySelectedMovie = selectedMovie;
    cpySelectedMovie.myRating = selectedRating;
    this.setDataToStorage(cpySelectedMovie);
  }

  handleOnDateSelected(selectedMovie, selectedDate) { // obj, string
    let cpySelectedMovie = selectedMovie;
    cpySelectedMovie.watched = selectedDate;
    this.setDataToStorage(cpySelectedMovie);
  }

  handleOnRemoveFromList(selectedMovie) { // passed as prop to modal

    this.setState({isLoading: true}, () => {
      var foundIndex = this.state.totalMovieData.findIndex(el => el.imdbID === selectedMovie.imdbID);
      let cpyTotalMovieData = this.state.totalMovieData;
      const newTotalMovieData = [   // could use filter but just wanted to use ES6 way
          ...cpyTotalMovieData.slice(0, foundIndex),
          ...cpyTotalMovieData.slice(foundIndex + 1)
      ];

      setLocalData('watchedMovieList', newTotalMovieData)  
      .then(() => {
        this.setState({
          totalMovieData: newTotalMovieData,
          isLoading: false
        });
      })
      .catch((err) => {
        this.setState({ isLoading: false });
      });

    });

  }

  componentWillMount() {
    this.loadData();
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <StatusBarControl />
          <Text>Loading...</Text>
        </View>
      );
    } else {
      return (
        <View>
          <StatusBarControl />
          <MoviesWatchedList
            totalMovieData={this.state.totalMovieData}
            handleOnFinishRating={this.handleOnFinishRating}
            handleOnDateSelected={this.handleOnDateSelected}
            handleOnRemoveFromList={this.handleOnRemoveFromList}
          />
          <NavigationEvents
            onWillFocus={this.loadData}
          />
        </View>
      );
    }

  }
}

class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.handleAddToList = this.handleAddToList.bind(this);
  }

  handleAddToList(selectedMovie) {
    // Attach new properties
    let newMovie = selectedMovie;
    newMovie.myRating = 1;
    newMovie.watched = new Date().getFullYear() + ' ' + (new Date().getMonth() + 1) + ' ' + new Date().getDate();

    getLocalData('watchedMovieList')
    .then(watchedMovieList => {
      if(watchedMovieList) {
        let newList = JSON.parse(watchedMovieList);
        newList.push(newMovie);

        // Future task: Sort by watched date
        setLocalData('watchedMovieList', newList);
      } else {
        let newList = [];
        newList.push(newMovie);
        setLocalData('watchedMovieList', newList);
      }
    });

  }

  render() {
    return (
      <View>
        <StatusBarControl />
        <MovieSearchContainer handleAddToList={this.handleAddToList} />
      </View>
    );
  }
}

const TabNavigator = createBottomTabNavigator(
  {
    List: ListScreen,
    Search: SearchScreen
  },
  {
    tabBarOptions: {
      activeTintColor: '#e91e63',
      labelStyle: {
        fontSize: 16,
        fontWeight: "600"
      },
      style: {
        backgroundColor: 'white'
      },
    }
  }
);

const AppContainer = createAppContainer(TabNavigator);

export default class App extends Component {
  render() {
    return (
      <AppContainer />
    );
  }
}
