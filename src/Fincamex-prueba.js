import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import Root from "./root.component";
import plantilla from "./Pruebas/Plantilla/plantilla"
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