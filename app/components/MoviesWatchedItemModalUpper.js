
import React from 'react';
import {StyleSheet, Text, View, Alert} from 'react-native';
import { Rating, Button } from 'react-native-elements';
import DateTimePicker from "react-native-modal-datetime-picker";
// https://github.com/mmazzarolo/react-native-modal-datetime-picker

class MoviesWatchedItemModalUpper extends React.Component {
  constructor(props) {
    super(props);
    //let pickedDate = (!props.pickedDate || props.pickedDate.length < 1) ? new Date().getFullYear() + ' ' + (new Date().getMonth() + 1) + ' ' + new Date().getDate() : props.pickedDate;
    this.state = {
      pickedDate: props.pickedDate,
      myRating: props.myRating,
      datePickerVisible: false
    }

    this.handleDatePickerVisible = this.handleDatePickerVisible.bind(this);
    this.handleDatePickerInvisible = this.handleDatePickerInvisible.bind(this);
    this.handleDatePicked = this.handleDatePicked.bind(this);
  }

  handleDatePickerVisible() {
    this.setState({ datePickerVisible: true })
  }
  handleDatePickerInvisible() {
    this.setState({ datePickerVisible: false })
  }
  handleDatePicked(datePicked) {
    let dateString = datePicked.getFullYear() + ' ' + (datePicked.getMonth() + 1) + ' ' + datePicked.getDate();
    this.setState({
      pickedDate: dateString,
    });
    this.props.handleOnDateSelected(dateString);
    this.handleDatePickerInvisible();
  }

  render() {
    return (
      <View style={styles.viewContainer}>

        <Rating
          type="star"   // star, rocket, bell, heart
          ratingCount={10}
          startingValue={this.state.myRating}
          imageSize={25}
          style={{marginBottom: 10}}
          onFinishRating={this.props.handleOnFinishRating}
        />

        <Button
          title={'Watched: ' + this.state.pickedDate}
          type="outline"
          onPress={this.handleDatePickerVisible}
        />

        <DateTimePicker
          isVisible={this.state.datePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.handleDatePickerInvisible}
          mode={'date'}
        />

      </View>
    );
  }
};

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  watchedDateText: {
    textAlign: 'center', fontSize: 16, fontWeight: '600', color: 'black',
    marginTop: 10, marginBottom: 0
  },
});


export default MoviesWatchedItemModalUpper;
