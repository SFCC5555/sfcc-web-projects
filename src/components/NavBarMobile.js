import '../styles/NavBarMobile.css'

function NavBarMobile() {
    return (
        <nav className="navBarMobile">
            <span className="burgerIcon burgerIconLight"></span>
            <div>ING. S. FERNANDO CARRASCO</div>
            <div>ABOUT ME <span className="sfccPicture"></span></div>
        </nav>
    )
};

export { NavBarMobile };