import '../styles/DarkModeButton.scss';


function DarkModeButton({ controlFunction, mode }) {

    return (
        <span onClick={controlFunction} className={`darkModeButton darkModeButton${mode}`}></span>

    )
};

export { DarkModeButton };