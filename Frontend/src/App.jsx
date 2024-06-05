import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import { DashBoard } from './pages/DashBoard';
import { TitleBar } from './components/TitleBar/TitleBar';

const App = () => (
<>
<TitleBar/>
<Authenticator socialProviders ={['google']} loginMechanisms={['email']} signUpAttributes={['email', 'phone_number']}>
  {({ user }) => (
    <Router>
      <Routes>
        <Route path="/login" element={<Navigate to="/" />} />
        <Route path="/dashboard" element={<Navigate to="/" />} />
        <Route path="/" element={<DashBoard user={user} />} />
        <Route path="*" element={<div style={{ textAlign: 'center', fontSize: '24px', padding: '50px', backgroundColor: 'lightgrey', color: 'red' }}>Whoops, not found</div>} /> {/* Catch-all route */}
      </Routes>
    </Router>
  )}
</Authenticator>
</>
);

export default App;
