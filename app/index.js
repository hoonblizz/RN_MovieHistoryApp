
import React, { Component } from 'react';
import {Platform, StyleSheet, Text, View, TextInput, Button, Alert} from 'react-native';

import { createBottomTabNavigator, createAppContainer, NavigationEvents } from 'react-navigation';
import { getLocalData, setLocalData } from './apis/localStorage';
import { keyNames } from './apis/keyNames';
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

  }

  loadData() {
    // For Rerendering list.
    this.setState({isLoading: true}, async () => {

      const watchedMovieList = await getLocalData(keyNames.watchedMovieList);
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
            totalMovieData={ this.state.totalMovieData }
          />
          <NavigationEvents

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
    newMovie[keyNames.myRating] = 1;
    newMovie[keyNames.watched] = new Date().getFullYear() + ' ' + (new Date().getMonth() + 1) + ' ' + new Date().getDate();

    getLocalData(keyNames.watchedMovieList)
    .then(watchedMovieList => {
      if(watchedMovieList) {
        let newList = JSON.parse(watchedMovieList);
        newList.push(newMovie);

        // Future task: Sort by watched date
        setLocalData(keyNames.watchedMovieList, newList);
      } else {
        let newList = [];
        newList.push(newMovie);
        setLocalData(keyNames.watchedMovieList, newList);
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
