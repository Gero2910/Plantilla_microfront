import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import plantilla from "./Modulo/SubProcesos/formato.jsx";
const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: plantilla,
  errorBoundary(err, info, props) {
    // Customize the root error boundary for your microfrontend here.
    return null;
  },
});

export const { bootstrap, mount, unmount } = lifecycles;
