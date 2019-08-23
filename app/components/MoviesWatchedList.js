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
  //static contextType = TotalMovieListContext;

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      totalMovieData: props.totalMovieData,
      selectedMovieData: {}
    };

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

    // Update Context (update state in parent level) -> also see componentDidUpdate
    this.props.setTotalMovieDataFnc(cpyTotalMovieData);
    setLocalData(keyNames.watchedMovieList, cpyTotalMovieData);

  }

  //
  handleOnSelectMovie(selectedMovie) {
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
    if (JSON.stringify(previousState.totalMovieData) !== JSON.stringify(this.props.totalMovieData)) {
      this.setState({ totalMovieData: [...this.props.totalMovieData] });
    }
  }

  // argument 안에 {} 로 써주는걸 destructing 이라한다.
  // 원래는 someObject.totalMovieData, someObject.setTotalMovieData 이런식이 되는걸 줄여준것
  render() {

    const {height, width} = Dimensions.get('window');
    let totalMovieData = this.props.totalMovieData;

    //console.log('props is ' + JSON.stringify(this.props))

    if (totalMovieData.length > 0) {

      return (
        <View style={{marginBottom: 20}}>
          <ScrollView>
            {
              totalMovieData.map((el, i) => (
                <ListItem
                  key={el.imdbID}
                  leftAvatar={{ source: { uri: el.Poster } }}
                  title={el.Title}
                  subtitle={el.Genre + '\nWatched: ' + el.watched}
                  badge={{
                      value: el.myRating,
                      textStyle: { color: 'white', fontSize: 16 },
                      containerStyle: {

                      },
                      badgeStyle: {
                        minWidth: 25, minHeight: 20,
                        backgroundColor: keyNames.blueColor
                      }
                  }}
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
};

// 중요!!! Context를 render 밖에서 사용하게끔 하는 구조
// Parent 로 받은 prop 은 모두 이어받고 ({...props} 로),
// 위에 클래스 MoviesWatchedList 에서 this.props로 context를 사용할수 있게 해준다.
const MoviesWatchedListWithContext = (Component) => {
   return (props) => {
     return (
       <TotalMovieListContext.Consumer>
          {({totalMovieData, setTotalMovieDataFnc}) => {
             return <Component {...props} totalMovieData={totalMovieData} setTotalMovieDataFnc={setTotalMovieDataFnc} />
          }}
       </TotalMovieListContext.Consumer>
     );
   };
};

export default MoviesWatchedListWithContext(MoviesWatchedList);
