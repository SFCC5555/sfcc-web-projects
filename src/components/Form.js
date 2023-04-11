import React from 'react';
import '../styles/Form.css';
import { Message } from './Message';
import { useState } from 'react';

function Form({ mode }) {

    const lowerCaseMode=mode.toLowerCase();

    const [submit, setSubmit] = useState(false);

    async function handleSubmit(event) {

        event.preventDefault();

        const form = document.querySelector('form');

        const formData = new FormData(form);

        const response = await fetch(form.action,{method:form.method,body:formData,headers:{'Accept': 'aplication/json'}});

        if(response.ok) {
            setSubmit(true);
        }

    }

    function closeMessage() {
        setSubmit(false);
    }

    return (

        <main className='sectionContainer'>

            <div className='sectionGap' id='CONTACT'></div>
            <h2 className={`${lowerCaseMode}ModeElement`}>CONTACT</h2>
            {!submit&&<section className={`formSection ${lowerCaseMode}ModeComponent`}>
                <h3 className={`${lowerCaseMode}ModeElement contactMeTitle`}>Contact Me</h3>
                <form onSubmit={handleSubmit} action='https://formspree.io/f/xknapzwy' method='POST'>
                    <label></label>
                    <input type='text' name='name' placeholder='Name' className={`${lowerCaseMode}ModeformInput formInput` } required />
                    <input type='email' name='email' placeholder='e-mail' className={`${lowerCaseMode}ModeformInput formInput`} required />
                    <textarea name='message' placeholder='Message' className={`${lowerCaseMode}ModeformInput formInput textArea`} required />
                    <button type='submit' className={`${lowerCaseMode}ModeformInput formInput formButton`}>SEND</button>
                </form>
            </section>}
            {submit&&<Message mode={mode} controlFunction={closeMessage}/>}

        </main>

    )
}

export { Form };