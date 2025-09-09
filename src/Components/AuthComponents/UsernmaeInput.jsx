import { useState } from 'react';

const UsernameInput = ({value, onChange,isLogin=false}) => {
  const [showHint, setShowHint] = useState(false);


  return (
    <div>
      <label className={`input ${!isLogin && 'validator'}`}>
        <svg
          className="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </g>
        </svg>
        <input
          type="text"
          required
          placeholder="Username"
    pattern="[A-Za-z][A-Za-z0-9\-]*"
    minLength="3"
    maxLength="30"
          value={value}
          onChange={onChange}
          title="Only letters, numbers or dash"
          //onFocus={() => setShowHint(!showHint)}
         onBlur={(e) => {
              const value = e.target.value;
              const isValid = e.target.checkValidity();
              if (value === "") {
                setShowHint(false); // Don't show hint if nothing was typed
              } else {
                setShowHint(!isValid); // Show hint only if invalid and not empty
              }
            }}
        />
      </label>

    { !isLogin && 
    <> 
      {/* Hint shown only when showHint is true */}
       <p className={`validator-hint ${showHint ? '' : 'hidden'}`}>
          Must be 3 to 30 characters
          <br />
          containing only letters, numbers or dash
        </p>
      </>
    }
    </div>
  );
};

export default UsernameInput;