import React, { createContext } from 'react';

export let TotalMovieListContext = React.createContext({
  totalMovieData: [],
  setTotalMovieDataFnc: () => {}
});
