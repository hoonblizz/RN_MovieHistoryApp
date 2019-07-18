
import React, { Component } from 'react';
import {Platform, StyleSheet, Text, View, TextInput, Button, Alert} from 'react-native';

import { createBottomTabNavigator, createAppContainer, NavigationEvents } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
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
    this.setState({isLoading: true}, () => {
      AsyncStorage.getItem('@watchedMovieList_key')
      .then(watchedMovieList => {
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
    });
  }

  setDataToStorage(selectedMovie) { // selectedMovie is modified movie (rating or date)
    var foundIndex = this.state.totalMovieData.findIndex(el => el.imdbID === selectedMovie.imdbID);
    let cpyTotalMovieData = this.state.totalMovieData;
    cpyTotalMovieData[foundIndex] = selectedMovie;

    AsyncStorage.setItem('@watchedMovieList_key', JSON.stringify(cpyTotalMovieData))
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

      AsyncStorage.setItem('@watchedMovieList_key', JSON.stringify(newTotalMovieData))
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

  componentDidMount() {
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

    AsyncStorage.getItem('@watchedMovieList_key')
    .then(watchedMovieList => {
      if(watchedMovieList) {
        let newList = JSON.parse(watchedMovieList);
        newList.push(newMovie);

        // Future task: Sort by watched date
        AsyncStorage.setItem('@watchedMovieList_key', JSON.stringify(newList));
        //Alert.alert('Set item is done');
      } else {
        let newList = [];
        newList.push(newMovie);
        AsyncStorage.setItem('@watchedMovieList_key', JSON.stringify(newList));
      }
    })
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
        backgroundColor: 'white',
        height: 50
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
