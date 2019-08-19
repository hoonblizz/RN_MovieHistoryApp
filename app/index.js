
import React, { Component } from 'react';
import {Platform, StyleSheet, Text, View, TextInput, Button, Alert} from 'react-native';

import { createBottomTabNavigator, createAppContainer, NavigationEvents, BottomTabBar } from 'react-navigation';
import { getLocalData, setLocalData } from './apis/localStorage';
import { keyNames } from './apis/keyNames';
import { TotalMovieListContext } from './apis/contexts';
import StatusBarControl from './components/StatusBarControl';
import MoviesWatchedList from './components/MoviesWatchedList';
import MovieSearchContainer from './components/MovieSearchContainer';
import firebase from 'react-native-firebase';
import Keys from '../key/Keys';
import Icon from 'react-native-vector-icons/FontAwesome5';

class ListScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <View>
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
        <MovieSearchContainer />
      </View>
    );
  }
}


const TabBarComponent = (props) => {
  const Banner = firebase.admob.Banner;
  const AdRequest = firebase.admob.AdRequest;
  const request = new AdRequest();
  const unitId = Keys.admob_unitID_ios;

  return (
    <View>
      <Banner
        unitId={unitId}
        size={'SMART_BANNER'}
        request={request.build()}
        onAdLoaded={() => {
          //console.log('Advert loaded');
        }}
      />
      <BottomTabBar {...props} />
    </View>
  );
}


const TabNavigator = createBottomTabNavigator(
  {
    List: {
      screen: ListScreen,
      navigationOptions: {
        tabBarLabel:"",
        tabBarIcon: ({ tintColor }) => (
          <Icon name="th-list" size={28} color={tintColor} />
        )
      }
    },
    Search: {
      screen: SearchScreen,
      navigationOptions: {
        tabBarLabel:"",
        tabBarIcon: ({ tintColor }) => (
          <Icon name="search" size={28} color={tintColor} />
        )
      }
    }
  },
  {
    tabBarComponent: props => {
      return (
        <TabBarComponent
          {...props}
          style={{
            borderTopColor: keyNames.inactiveColor,
            backgroundColor: 'white',
            paddingTop: '2%'
          }}
        />
      );
    },
    tabBarOptions: {
      showLabel: false,
      activeTintColor: keyNames.blueColor,
      inactiveTintColor: keyNames.inactiveColor
    }
  }
);

const AppContainer = createAppContainer(TabNavigator);

export default class App extends Component {
  //const contextValue = useContext(TotalMovieListContext);

  constructor(props) {
    super(props);

    // https://stackoverflow.com/questions/41030361/how-to-update-react-context-from-inside-a-child-component
    // https://stackoverflow.com/questions/50502664/how-to-update-the-context-value-in-provider-from-the-consumer
    this.setTotalMovieDataFnc = (updatedTotalMovieData) => {
      this.setState({
        totalMovieData: [...updatedTotalMovieData]
      });
      console.log('Set Movie done!! ');
    };

    this.state = {
      totalMovieData: [],
      setTotalMovieDataFnc: this.setTotalMovieDataFnc
    };

    this.loadData = this.loadData.bind(this);

  }

  async loadData() {

    const watchedMovieList = await getLocalData(keyNames.watchedMovieList);

    if(watchedMovieList) {
      const movieListArray = JSON.parse(watchedMovieList);
      this.setState({ totalMovieData: [...movieListArray] });
    }

  }

  componentDidMount() {
    this.loadData();
  }

  render() {



    return (
      <TotalMovieListContext.Provider value={this.state}>
        <StatusBarControl />
        <AppContainer />
      </TotalMovieListContext.Provider>
    );
  }
}
