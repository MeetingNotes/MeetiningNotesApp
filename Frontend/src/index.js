import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { RecoilRoot } from 'recoil';
import awsConfig from './config/aws-exports.js'
import { Amplify } from 'aws-amplify';
import App from './App.jsx';
import { Authenticator } from '@aws-amplify/ui-react';
Amplify.configure(awsConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<React.StrictMode>
    <Authenticator.Provider>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </Authenticator.Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
