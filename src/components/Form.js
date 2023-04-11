import React from 'react';
import '../styles/Form.css';

function Form({ mode }) {

    const lowerCaseMode=mode.toLowerCase();

    return (

        <main className='sectionContainer'>

            <div className='sectionGap' id='CONTACT'></div>
            <h2 className={`${lowerCaseMode}ModeElement`}>CONTACT</h2>
            <section className={`formSection ${lowerCaseMode}ModeComponent`}>
                <h3 className={`${lowerCaseMode}ModeElement contactMeTitle`}>Contact Me</h3>
                <form>
                    <label></label>
                    <input type='text' placeholder='Name' className={`${lowerCaseMode}ModeformInput formInput` } required />
                    <input type='email'placeholder='e-mail' className={`${lowerCaseMode}ModeformInput formInput`} required />
                    <textarea placeholder='Message' className={`${lowerCaseMode}ModeformInput formInput textArea`} required />
                    <button type='submit' className={`${lowerCaseMode}ModeformInput formInput formButton`}>SEND</button>
                </form>

            </section>

        </main>

    )
}

export { Form };