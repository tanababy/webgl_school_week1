import 'core-js/stable';
import 'regenerator-runtime/runtime';

// import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
// gsap.registerPlugin(ScrollToPlugin);

import BrowserCheck from './utility/browserCheck';
import Layout from './modules/layout';
import Scene from './modules/scene';
// import picturefill from 'picturefill';

const APP = window.APP || {};
const initApp = (): void => {
  window.APP = APP;
  APP.Layout = new Layout();
  APP.Scene = new Scene();

  BrowserCheck();
};

if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.scroll)) {
  initApp();
} else {
  document.addEventListener('DOMContentLoaded', initApp);
}
