import React from 'react';

const SystemMessage = ({ variables }) => {
  return (
    <div className="flex justify-center my-3">
      <div className="bg-base-200 bg-opacity-80 px-3 py-1.5 rounded-lg shadow-sm max-w-md">
        <p className="text-xs text-base-content text-opacity-70 text-center">
          {variables || 'System message'}
        </p>
      </div>
    </div>
  );
};

export default SystemMessage;