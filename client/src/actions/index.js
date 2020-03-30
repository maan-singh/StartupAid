import axios from 'axios';
import { FETCH_USER } from './types';

//V1 - w/o redux thunk
// without using Redux Thunk, as we do not have access to Dispatch function so we simply return it.
// const fetchUser = () => {
//   const request = axios.get('/api/current_user');

//   return {
//     type: FETCH_USER,
//     payload: request
//   };
// };

// refactored to use redux thunk
// But due to Thunk, we have direct access to dispatch function, so we don't have to return the action just now as we can do
// with the dispatch function manually.
// We have to re-factor the actionCreator to use Redux Thunk.
// old below

// v2 w.o async await. we return a function and when it is executed it is gonna make the actual request.
// WE WANT TO DISPATCH ACTION AFTER A REQUEST HAS BEEN SUCCESSFULLY COMPLETED!
// const fetchUser = () => {
//   return function(dispatch) {
//    axios.get('/api/current_user')
//          .then(res => dispatch({ type: FETCH_USER, payload: res }));
// }
// };
// axios.get returns a promise.

// new v1.0 (STILL NEED TO REFACTOR) - we return a function with the actual request instead and not the action.
// the purpose of redux thunk middleware is to expect whatever value we return from the action creator. If redux thunk sees that
// we return a function instead of a normal action, redux thunk will automatically call that funciton and pass in that dispatch
// function as an argument.
// So now, as we have access to the dispatch function, we don't have to immediately return an action. We can at any given point of time
// we can dispatch the action.
// We want to dispatch an action here after the axios request has been successfully completed. ASYNC
// chain on .then statement like above. And once the promise is resolved, only then will we dispatch an action and have that sent off
// to all the different reducers.
export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');

  dispatch({ type: FETCH_USER, payload: res.data });
};

// ACTION CREATOR FOR STRIPE TO TAKE TOKEN TO BACKEND; POST REQUEST TO OUR BACKEND SERVER BECAUSE WE WANT TO SEND SOME INFO TO BACKEND
export const handleToken = token => async dispatch => {
  const res = await axios.post('/api/stripe', token);

  dispatch({ type: FETCH_USER, payload: res.data });
};

// Now add the action creator to one of the components. When the application starts to boot up, we actally fetch the user. App.js. centralize.
// change app to class component to use didmount lifecycle method. We need to fetch the user the very forst time tha app component
// is rendered to the screen.
// WHEN USER PAYS AND THE BACKEND SERVER SENDS BACK THE UPDATED USER MODEL WITH UPDATED CREDITS, THEN WE CAN REUSE THE EXACT SAME FETCH USER TYPE.
// REMEMBER, IF WE DISPATCH AN ACTION OF TYPE FETCH USER AND THAT CONTAINS A PAYLOAD OF THE USER MODEL, THE AUTH REDUCER WILL AUTOMATICALLY
// PICK IT UP AND IN THEORY, ANYTHING INSIDE OF OUR APPLICATION THAT DEPENDS ON OUR USER MODEL WILL BE AUTOMATICALLY UPDATED. NOW, HOOK IY UP TO PAYMENTS.
