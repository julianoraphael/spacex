import React from 'react';
import './Loader.css'; // Importe o arquivo CSS para estilizar a animação

const Loader: React.FC = () => {
  return (
    <div className="loader-container">
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
