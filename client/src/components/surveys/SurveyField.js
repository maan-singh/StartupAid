// SurveyField contains logic to render a single
// label and text input
import React from 'react';

// {touched && error} - if touched is true, js will evaluate the entire statement and if error contains a string, that string will be returned.
// if touched is false, js will not execute boolean statement.
// props.input - event handlers from redux form
export default ({ input, label, meta: { error, touched } }) => {
  return (
    <div>
      <label>{label}</label>
      <input {...input} style={{ marginBottom: '5px' }} />
      <div className="red-text" style={{ marginBottom: '20px' }}>
        {touched && error}
      </div>
    </div>
  );
};
