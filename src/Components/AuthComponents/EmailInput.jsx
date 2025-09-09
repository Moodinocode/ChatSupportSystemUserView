import { useState } from 'react';

const EmailInput = ({ value, onChange }) => {
  const [isValid, setIsValid] = useState(true);
  const talacoRegex = /^[^\s@]+@talaco\.net$/;

  const handleChange = (e) => {
    const email = e.target.value;
    onChange(e); // pass to parent if needed
    setIsValid(talacoRegex.test(email));
  };

  return (
    <div>
      <label className={`input ${!isValid ? 'input-error' : 'validator'}`}>
        <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
          </g>
        </svg>
        <input
          type="email"
          placeholder="mail@talaco.net"
          value={value}
          onChange={handleChange}
          required
          className="grow"
        />
      </label>
      {!isValid && (
        <div className="text-error text-xs mt-2">Email must be a valid @talaco.net address</div>
      )}
    </div>
  );
};

export default EmailInput;

