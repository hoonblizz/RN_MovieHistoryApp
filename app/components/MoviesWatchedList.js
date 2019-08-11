import React from 'react';
import {ScrollView, Dimensions, StyleSheet, Text, View, Alert} from 'react-native';
import { ListItem, Overlay, AirbnbRating } from 'react-native-elements';
import MoviesWatchedItemModal from './MoviesWatchedItemModal';
import { getLocalData, setLocalData } from '../apis/localStorage';
import { keyNames } from '../apis/keyNames';
import { sortTotalMovieData } from '../apis/appUtil';
import { TotalMovieListContext } from '../apis/contexts';

// https://facebook.github.io/react-native/docs/using-a-listview
// https://react-native-training.github.io/react-native-elements/docs/listitem.html

class MoviesWatchedList extends React.Component {

  // 이게 있어야만 나중에 this.context로 엑세스 가능 (single context만 가능)
  static contextType = TotalMovieListContext;

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      totalMovieData: props.totalMovieData,
      selectedMovieData: {}
    };

    //Alert.alert('Received: ' + props.totalMovieData.length)
    this.handleOnSelectMovie = this.handleOnSelectMovie.bind(this);
    this.handleOnFinishRating = this.handleOnFinishRating.bind(this);
    this.handleOnDateSelected = this.handleOnDateSelected.bind(this);
    this.handleOnRemoveFromList = this.handleOnRemoveFromList.bind(this);

  }

  closeModal() {
    this.setState({ modalVisible: false });  // close modal
  }

  // changedSelectedMovie is modified movie (rating or date)
  // changedTotalMovieData is movie list that is already changed.
  setDataToStorage(changedSelectedMovie, commandString) {

    //Alert.alert('data is ' + JSON.stringify(this.state.totalMovieData))

    let cpyTotalMovieData = [...this.state.totalMovieData];

    switch(commandString) {
      default: break;
      case keyNames.CHANGE:
        var foundIndex =  this.state.totalMovieData.findIndex(el =>
                            el.imdbID === changedSelectedMovie.imdbID
                          );
        cpyTotalMovieData[foundIndex] = changedSelectedMovie;
        break;

      case keyNames.REMOVE:
        var foundIndex =  this.state.totalMovieData.findIndex(el =>
                          el.imdbID === this.state.selectedMovieData.imdbID
                        );
        cpyTotalMovieData = [   // could use filter but just wanted to use ES6 way
            ...cpyTotalMovieData.slice(0, foundIndex),
            ...cpyTotalMovieData.slice(foundIndex + 1)
        ];
        this.closeModal();
        break;
    }

    cpyTotalMovieData = sortTotalMovieData(cpyTotalMovieData);

    setLocalData(keyNames.watchedMovieList, cpyTotalMovieData)
    .then(() => {
      this.setState({ totalMovieData: [...cpyTotalMovieData] });
    });

  }

  //
  handleOnSelectMovie(selectedMovie, totalMovieData) {
    this.setState({
      modalVisible: true,
      selectedMovieData: selectedMovie
    });
  }

  handleOnFinishRating(ratingVal) {
    //this.props.handleOnFinishRating(this.state.selectedMovieData, ratingVal); //passing to parent

    let cpySelectedMovie = this.state.selectedMovieData;
    cpySelectedMovie.myRating = ratingVal;
    this.setDataToStorage(cpySelectedMovie, 'CHANGE');
  }

  handleOnDateSelected(dateString) {
    //this.props.handleOnDateSelected(this.state.selectedMovieData, dateString); // passing to parent

    let cpySelectedMovie = this.state.selectedMovieData;
    cpySelectedMovie.watched = dateString;
    this.setDataToStorage(cpySelectedMovie, 'CHANGE');
  }

  handleOnRemoveFromList() {
    //this.props.handleOnRemoveFromList(this.state.selectedMovieData);

    this.setDataToStorage({}, 'REMOVE');

  }

  // Important!!
  componentDidUpdate(previousProps, previousState) {
    if (previousState.totalMovieData !== this.context) {
      this.setState({ totalMovieData: this.context });
    }
  }

  renderList(totalMovieData) {

    const {height, width} = Dimensions.get('window');
    //Alert.alert('Length is ' + totalMovieData.length)
    if (totalMovieData.length > 0) {

      return (
        <View style={{marginBottom: 85}}>
          <ScrollView>
            {
              totalMovieData.map((el, i) => (
                <ListItem
                  key={el.imdbID}
                  leftAvatar={{ source: { uri: el.Poster } }}
                  title={el.Title}
                  subtitle={el.Genre + '\nWatched: ' + el.watched}
                  badge={{ value: el.myRating, textStyle: { color: 'white' }, containerStyle: { marginTop: -20 } }}
                  chevronColor="black"
                  chevron
                  onPress={() => { this.handleOnSelectMovie(el, totalMovieData) }}
                />
              ))
            }
          </ScrollView>

          <Overlay
            isVisible={ this.state.modalVisible }
            onBackdropPress={() => this.setState({ modalVisible: false })}
            borderRadius={10}
            height={height - parseInt(height / 10)}
          >
            <MoviesWatchedItemModal
              movieDetail={ this.state.selectedMovieData }
              handleOnFinishRating={ this.handleOnFinishRating }
              handleOnDateSelected={ this.handleOnDateSelected }
              handleOnRemoveFromList={ this.handleOnRemoveFromList }
            />
          </Overlay>

        </View>
      );
    } else {
      return(
        <View style={{top: 200, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontWeight: '600', fontSize: 16}}>Search and Add Movies!</Text>
        </View>
      );
    }
  }

  render() {
    return (
      <TotalMovieListContext.Consumer>
        {(totalMovieData) => this.renderList(totalMovieData)}
      </TotalMovieListContext.Consumer>
    );
  }
};

export default MoviesWatchedList;
