import '../styles/NavBar.css';


function NavBar() {
    return (
        <nav className="navBar lightModeComponent">
            <span className="burgerIcon burgerIconLight"></span>
            <a href='https://sfcc-web-projects.netlify.app/' className='sFernando lightModeElement'>ING. S. FERNANDO CARRASCO</a>
            <div className='aboutMe lightModeElement'><span className="sfccPicture"></span>ABOUT ME</div>
        </nav>

    )
};

export { NavBar };