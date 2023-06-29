import '../styles/Message.scss';


function Message({ mode, controlFunction }) {

    const lowerCaseMode=mode.toLowerCase();

    return (
        <div className={`${lowerCaseMode}ModeComponent messageBox`}>
            <p>Your message has been sent successfully!</p><br/><br/>
            <p className='contactYouSoon'>I will contact you soon.</p>
            <div onClick={controlFunction} className={`closeIcon ${lowerCaseMode}ModeElement closeIconMessage`}>X</div>
        </div>
    )
};


export { Message };