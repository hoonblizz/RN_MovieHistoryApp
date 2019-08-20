// For utilities
import { keyNames } from './keyNames';

let dateToEpoch = (dateString) => {
  const dateStringArray = dateString.split(' ');
  return new Date(parseInt(dateStringArray[0]), parseInt(dateStringArray[1]), parseInt(dateStringArray[2])).getTime() / 1000;
}

export const sortTotalMovieData = (totalMovieData) => {

  let cpyTotalMovieData = [...totalMovieData];  // deep copy

  if(cpyTotalMovieData.length > 0 &&
    cpyTotalMovieData[0].hasOwnProperty(keyNames.watched) &&
    cpyTotalMovieData[0].hasOwnProperty(keyNames.myRating)) {

    cpyTotalMovieData = cpyTotalMovieData.sort((a, b) => {
      // compare watched time -> name
      let compareElement1 = dateToEpoch(a[keyNames.watched]);
      let compareElement2 = dateToEpoch(b[keyNames.watched]);

      if(compareElement1 === compareElement2) {
        compareElement1 = a.Title;
        compareElement2 = b.Title;
      }

      return compareElement1 > compareElement2;
    });

  }

  return cpyTotalMovieData;

};

export const addExtraProperties = (selectedMovieData) => {

  let cpyMovieData = JSON.parse(JSON.stringify(selectedMovieData));

  const timeNow = new Date();

  cpyMovieData[keyNames.myRating] = 1;
  cpyMovieData[keyNames.watched] = timeNow.getFullYear() + ' ' + (timeNow.getMonth() + 1) + ' ' + timeNow.getDate();
  cpyMovieData[keyNames.watchedWith] = [];
  cpyMovieData[keyNames.memo] = '';
  cpyMovieData[keyNames.added] = timeNow;
  cpyMovieData[keyNames.addedEpoch] = timeNow.getTime();

  return cpyMovieData;

}

export const checkMovieExistsInList = (targetImdbID, totalMovieData) => {
  let pos = totalMovieData.map(el => {return el.imdbID}).indexOf(targetImdbID);
  if(pos > -1) return true;
  else return false;
}
