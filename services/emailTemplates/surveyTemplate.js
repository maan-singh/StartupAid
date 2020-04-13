const keys = require('../../config/keys');
// to handle multi-line strings very well or elegantly with js use backtick `` strings or string templates
// inside backticks, you can write as much html as you want to without having to put escape characters when we need a new line
module.exports = (survey) => {
  return `
    <html>
      <body>
        <div style="text-align: center;">
          <h3>I'd like your input!</h3>
          <p>Please answer the following question:</p>
          <p>${survey.body}</p>
          <div>
            <a href="${keys.redirectDomain}api/surveys/${survey.id}/yes">Yes</a>
          </div>
          <div>
            <a href="${keys.redirectDomain}api/surveys/${survey.id}/no">No</a>
          </div>
        </div>
      </body>
    </html>
  `;
};
