import React, { useState } from "react";
import "../styles/Form.scss";
import { Message } from "./Message";
import { Mode } from "../types";

interface FormProps {
  mode: Mode;
}

function Form({ mode }: FormProps) {
  const lowerCaseMode = mode.toLowerCase();

  const [submit, setSubmit] = useState(false);
  const [validName, setValidName] = useState(true);
  const [validEmail, setValidEmail] = useState(true);
  const [isEmail, setIsEmail] = useState(true);
  const [validMessage, setValidMessage] = useState(true);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    if (event.target.id === "name") {
      setValidName(event.target.value !== "");
    }

    if (event.target.id === "message") {
      setValidMessage(event.target.value !== "");
    }

    if (event.target.id === "email") {
      if (event.target.value === "") {
        setIsEmail(false);
        setValidEmail(true);
      } else if (!/(^\w+\.?\w+@\w+\.\w\w+$)/.test(event.target.value)) {
        setValidEmail(false);
        setIsEmail(true);
      } else {
        setValidEmail(true);
        setIsEmail(true);
      }
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const name = document.getElementById("name") as HTMLInputElement;
    const email = document.getElementById("email") as HTMLInputElement;
    const message = document.getElementById("message") as HTMLTextAreaElement;

    if (name.value === "") setValidName(false);

    if (email.value === "") {
      setIsEmail(false);
      setValidEmail(true);
    } else if (!/(^\w+\.?\w+@\w+\.\w\w+$)/.test(email.value)) {
      setValidEmail(false);
      setIsEmail(true);
    }

    if (message.value === "") setValidMessage(false);

    if (
      name.value !== "" &&
      /(^\w+\.?\w+@\w+\.\w\w+$)/.test(email.value) &&
      message.value !== ""
    ) {
      const formData = new FormData(form);

      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        setSubmit(true);
      }
    }
  }

  function closeMessage() {
    setSubmit(false);
  }

  return (
    <main className="sectionContainer contactSection">
      <div className="sectionGap" id="CONTACT"></div>
      <h2 className={`${lowerCaseMode}ModeElement`}>CONTACT</h2>
      {!submit && (
        <section className={`formSection ${lowerCaseMode}ModeComponent`}>
          <h3 className={`${lowerCaseMode}ModeElement contactMeTitle`}>
            Contact me
          </h3>
          <form
            onSubmit={handleSubmit}
            action="https://formspree.io/f/xknapzwy"
            method="POST"
          >
            <label></label>
            <input
              onChange={handleChange}
              type="text"
              name="name"
              placeholder="Name"
              className={`${lowerCaseMode}ModeformInput formInput`}
              id="name"
            />
            {!validName && (
              <h3 className="error errorName">Name is required</h3>
            )}
            <input
              onChange={handleChange}
              type="text"
              name="email"
              placeholder="e-mail"
              className={`${lowerCaseMode}ModeformInput formInput`}
              id="email"
            />
            {!isEmail && (
              <h3 className="error errorEmail">E-mail is required</h3>
            )}
            {!validEmail && (
              <h3 className="error errorEmail">Invalid E-mail</h3>
            )}
            <textarea
              onChange={handleChange}
              name="message"
              placeholder="Message"
              className={`${lowerCaseMode}ModeformInput formInput textArea`}
              id="message"
            />
            {!validMessage && (
              <h3 className="error errorMessage">Message is required</h3>
            )}
            <button
              type="submit"
              className={`${lowerCaseMode}ModeformInput formInput formButton`}
            >
              SEND
            </button>
          </form>
        </section>
      )}
      {submit && <Message mode={mode} controlFunction={closeMessage} />}
    </main>
  );
}

export { Form };
