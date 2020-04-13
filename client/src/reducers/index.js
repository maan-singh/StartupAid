import { combineReducers } from 'redux';
import { reducer as reduxForm } from 'redux-form';
import authReducer from './authReducer';
import surveysReducer from './surveysReducer';

// surveys piece of state will be produced by the surveys reducer.
export default combineReducers({
  auth: authReducer,
  form: reduxForm,
  surveys: surveysReducer,
});
