// Importing the necessary styles
import React from 'react';
import '../styles/Message.scss';

// Functional component to display a success message after form submission
function Message({ mode, controlFunction }) {
  // Converting the mode to lowercase for class names
  const lowerCaseMode = mode.toLowerCase();

  return (
    <div className={`${lowerCaseMode}ModeComponent messageBox`}>
      <p>Your message has been sent successfully!</p>
      <br />
      <br />
      <p className='contactYouSoon'>I will contact you soon.</p>

      {/* Close button for the message */}
      <div onClick={controlFunction} className={`closeIcon ${lowerCaseMode}ModeElement closeIconMessage`}>
        X
      </div>
    </div>
  );
}

export { Message };