import '../styles/NavBarMobile.css'

function NavBarMobile() {
    return (
        <nav className="navBarMobile">
            <span className="burgerIcon burgerIconLight"></span>
            <div className='sFernando'>ING. S. FERNANDO CARRASCO</div>
            <div className='aboutMe'><span className="sfccPicture"></span>ABOUT ME</div>
        </nav>
    )
};

export { NavBarMobile };