import "../styles/Touch.scss";
import React, { useEffect } from "react";
import $ from "jquery";
import "animate.css/animate.min.css";
import { Mode } from "../types";

interface TouchProps {
  mode: Mode;
}

function Touch({ mode }: TouchProps) {
  const lowerCaseMode = mode.toLowerCase();

  useEffect(() => {
    $(document).ready(function () {
      $(".touch").mouseenter(function () {
        $(this).css("translate", "200px");
        $(this).text("Too Slow!");
        setTimeout(() => {
          $(this).remove();
        }, 100);
      });

      $(".dontTouch").mouseenter(function () {
        $(this).text("Don't!");
      });

      $(".dontTouch").mouseleave(function () {
        $(this).text("Don't Touch this Button");
      });

      $(".dontTouch").click(function () {
        $(".touch").addClass("animate__animated animate__bounce");
        $("nav").addClass("animate__animated animate__hinge");
        $(".menu").addClass("animate__animated animate__hinge");

        setTimeout(() => {
          $(this).addClass("animate__animated animate__hinge");

          setTimeout(() => {
            $(this).remove();
          }, 2000);
        }, 200);
      });
    });
  }, []);

  return (
    <section className="touchSection">
      <button
        className={`${lowerCaseMode}ModeTouchButton ${lowerCaseMode}ModeElement touchButton dontTouch`}
      >
        Don't Touch this Button
      </button>
      <button
        className={`${lowerCaseMode}ModeTouchButton ${lowerCaseMode}ModeElement touchButton touch`}
      >
        Touch this Button
      </button>
    </section>
  );
}

export { Touch };
