import React from 'react';
import '../styles/Form.css';
import { Message } from './Message';
import { useState } from 'react';

function Form({ mode }) {

    const lowerCaseMode=mode.toLowerCase();

    const [submit, setSubmit] = useState(false);
    const [validName, setValidName] = useState(true);
    const [validEmail, setValidEmail] = useState(true);
    const [isEmail, setIsEmail] = useState(true);
    const [validMessage, setValidMessage] = useState(true);

    function handleChange(event) {

        
        if (event.target.id === 'name') {
            if (event.target.value==='') {
                setValidName(false);
            } else {
                setValidName(true);
            }
        }

        if (event.target.id === 'message') {
            if (event.target.value==='') {
                setValidMessage(false);
            } else {
                setValidMessage(true);
            }
        }

        if (event.target.id === 'email') {
            if (event.target.value==='') {
                setIsEmail(false);
                setValidEmail(true);
            } else if (!(/(^\w+\.?\w+@\w+\.\w\w+$)/.test(event.target.value))) {
                setValidEmail(false);
                setIsEmail(true);
            } else {
                setValidEmail(true);
            }
        }


    } 

    async function handleSubmit(event) {

        event.preventDefault();

        const form = document.querySelector('form');
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');


        if (name.value === '') {
            setValidName(false);
        }

        if (email.value === '') {
            setIsEmail(false);
            setValidEmail(true);

        } else if (!(/(^\w+\.?\w+@\w+\.\w\w+$)/.test(email.value))) {
            setValidEmail(false);
            setIsEmail(true);
        }

        if (message.value === '') {
            setValidMessage(false);
        }

        console.log(validName,validEmail,isEmail,validMessage)

        if (name.value !== '' && /(^\w+\.?\w+@\w+\.\w\w+$)/.test(email.value) && message.value !== '') {
            

            const formData = new FormData(form);

            const response = await fetch(form.action,{method:form.method,body:formData,headers:{'Accept': 'aplication/json'}});
    
            if(response.ok) {
                setSubmit(true);
            }

        }



    }

    function closeMessage() {
        setSubmit(false);
    }

    return (

        <main className='sectionContainer contactSection'>

            <div className='sectionGap' id='CONTACT'></div>
            <h2 className={`${lowerCaseMode}ModeElement`}>CONTACT</h2>
            {!submit&&<section className={`formSection ${lowerCaseMode}ModeComponent`}>
                <h3 className={`${lowerCaseMode}ModeElement contactMeTitle`}>Contact me</h3>
                <form onSubmit={handleSubmit} action='https://formspree.io/f/xknapzwy' method='POST'>
                    <label></label>
                    <input onChange={handleChange} type='text' name='name' placeholder='Name' className={`${lowerCaseMode}ModeformInput formInput` } id='name' />
                    {!validName&&<h3 className='error errorName'>Name is required</h3>}
                    <input onChange={handleChange} type='text' name='email' placeholder='e-mail' className={`${lowerCaseMode}ModeformInput formInput`} id='email'/>
                    {!isEmail&&<h3 className='error errorEmail'>E-mail is required</h3>}
                    {!validEmail&&<h3 className='error errorEmail'>invalid E-mail</h3>}
                    <textarea onChange={handleChange} name='message' placeholder='Message' className={`${lowerCaseMode}ModeformInput formInput textArea`} id='message'/>
                    {!validMessage&&<h3 className='error errorMessage'>Message is required</h3>}
                    <button type='submit' className={`${lowerCaseMode}ModeformInput formInput formButton`}>SEND</button>
                </form>
            </section>}
            {submit&&<Message mode={mode} controlFunction={closeMessage}/>}

        </main>

    )
}

export { Form };