// Importing necessary styles and dependencies
import '../styles/Touch.scss';
import React, { useEffect } from 'react';
import $ from 'jquery';
import 'animate.css/animate.min.css';

// Functional component for the touch section
function Touch({ mode }) {
  let lowerCaseMode = mode.toLowerCase();

  useEffect(() => {
    $(document).ready(function () {
      // Event handler for the 'Touch this Button' button
      $('.touch').mouseenter(function () {
        // Changing text and applying a CSS class for animation
        $(this).css('translate', '200px');
        $(this).text('Too Slow!');
        setTimeout(() => {
          $(this).remove();
        }, 100);
      });

      // Event handler for the 'Don't Touch this Button' button
      $('.dontTouch').mouseenter(function () {
        $(this).text("Don't!");
      });

      $('.dontTouch').mouseleave(function () {
        $(this).text("Don't Touch this Button");
      });

      $('.dontTouch').click(function () {
        // Adding animation classes to elements
        $('.touch').addClass('animate__animated animate__bounce');
        $('nav').addClass('animate__animated animate__hinge');
        $('.menu').addClass('animate__animated animate__hinge');

        setTimeout(() => {
          $(this).addClass('animate__animated animate__hinge');

          setTimeout(() => {
            $(this).remove();
          }, 2000);
        }, 200);
      });
    });
  }, []);

  return (
    <section className='touchSection'>
      {/* Two buttons with different classes */}
      <button className={`${lowerCaseMode}ModeTouchButton ${lowerCaseMode}ModeElement touchButton dontTouch`}>
        Don't Touch this Button
      </button>
      <button className={`${lowerCaseMode}ModeTouchButton ${lowerCaseMode}ModeElement touchButton touch`}>
        Touch this Button
      </button>
    </section>
  );
}

export { Touch };