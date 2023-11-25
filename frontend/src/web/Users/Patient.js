import React, { useState } from 'react';
import CombinedForm from '../cmpts/Patient/CombinedForm';
import PatientPage from '../cmpts/Patient/PatientPgae';

function App() {
  const [selectedComponent, setSelectedComponent] = useState('post');

  return (
    <div>
      <div>
        <button onClick={() => setSelectedComponent('post')}>Create Post</button>
        <button onClick={() => setSelectedComponent('card')}>Patient Page</button>
      </div>

      {selectedComponent === 'post' && <CombinedForm />}
      {selectedComponent === 'card' && <PatientPage />}
    </div>
  );
}

export default App;
