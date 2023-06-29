import { useState } from 'react';
import '../styles/Info.scss';


function Info({ mode, name, info }) {

    const [activeInfo,setActiveInfo] = useState(false);


    function aboutInfo() {
        setActiveInfo(true);

    }

    function closeAboutInfo() {
        setActiveInfo(false);
    }


    return (
            <>
                <span onMouseLeave={closeAboutInfo} onMouseEnter={aboutInfo} className={`skillIcon aboutIcon${mode} aboutIcon`} />
                {activeInfo&&<div className={`info info${mode}`} >

                <div className='infoTitle'>{name}</div>
                <p className='infoContent'>{info}</p>    
                    
                </div>}
            </>
    )
};


export { Info };