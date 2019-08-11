
import React, { Component } from 'react';
import {Platform, StyleSheet, Text, View, TextInput, Button, Alert} from 'react-native';

import { createBottomTabNavigator, createAppContainer, NavigationEvents } from 'react-navigation';
import { getLocalData, setLocalData } from './apis/localStorage';
import { keyNames } from './apis/keyNames';
import { TotalMovieListContext } from './apis/contexts';
import StatusBarControl from './components/StatusBarControl';
import MoviesWatchedList from './components/MoviesWatchedList';
import MovieSearchContainer from './components/MovieSearchContainer';

class ListScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <StatusBarControl />
        <MoviesWatchedList />
        <NavigationEvents />
      </View>
    );
  }
}

class SearchScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <StatusBarControl />
        <MovieSearchContainer />
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
      //Alert.alert('Loading done: ' + watchedMovieList)
      if(watchedMovieList) {
        const movieListArray = JSON.parse(watchedMovieList);
        this.setState({
          totalMovieData: [...movieListArray],
          isLoading: false
        });
      } else {
        this.setState({
          isLoading: false
        });
      }
    });
  }

  componentDidMount() {
    this.loadData();
  }

  render() {
    return (
      <TotalMovieListContext.Provider value={this.state.totalMovieData}>
        <AppContainer />
      </TotalMovieListContext.Provider>
    );
  }
}
