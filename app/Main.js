import React, { useState, useReducer, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { useImmerReducer } from "use-immer";

import StateContext from "./Context/StateContext-Provider";
import DispatchContext from "./Context/DispatchContext-Provider";
import Header from "./Components/Header-Component/Header";
import HomeGuest from "./Components/HomeGuest-Component/HomeGuest";
import HomeComponent from "./Components/Home-Component/Home-Component";
import Footer from "./Components/Footer-Component/Footer";
import About from "./Components/About-Component/About";
import Terms from "./Components/Terms-Component/Terms";
import CreatePostComponent from "./Components/Create-Post-Component/Create-Post-Component";
import ViewSinglePostComponent from "./Components/View-Post-Component/ViewSinglePost-Component";
import FlashMessageComponent from "./Components/FlashMessage-Components/FlashMessage-Components";
import ProfileComponent from "./Components/Profile-Component/ProfileComponent";
import EditPostComponent from "./Components/Edit-Post-Component/Edit-Post-Component";
import SearchComponent from "./Components/Search-Component/Search-Component";
import { CSSTransition } from "react-transition-group";
function Main() {
  const initialState = {
    loginIsReal: Boolean(localStorage.getItem("LoggedINToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("LoggedINToken"),
      username: localStorage.getItem("LoggedINUsername"),
      avatar: localStorage.getItem("LoggedINAvatar")
    },
    isSearchOpen: false
  };
  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loginIsReal = true;
        draft.user = action.data;
        return;
      case "logout":
        draft.loginIsReal = false;
        return;
      case "flashMessage":
        draft.flashMessages.push(action.value);
        return;
      case "searchOpen":
        draft.isSearchOpen = true;
        return;
      case "searchClose":
        draft.isSearchOpen = false;
        return;
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    if (state.loginIsReal) {
      localStorage.setItem("LoggedINToken", state.user.token);
      localStorage.setItem("LoggedINUsername", state.user.username);
      localStorage.setItem("LoggedINAvatar", state.user.avatar);
    } else {
      localStorage.removeItem("LoggedINToken");
      localStorage.removeItem("LoggedINUsername");
      localStorage.removeItem("LoggedINAvatar");
    }
  }, [state.loginIsReal]);

  axios.defaults.baseURL = "http://localhost:8080";
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessageComponent messages={state.flashMessages} />
          <Header />
          <Routes>
            <Route
              path="/"
              element={state.loginIsReal ? <HomeComponent /> : <HomeGuest />}
            />
            <Route path="/create-post" element={<CreatePostComponent />} />
            <Route path="/post/:id" element={<ViewSinglePostComponent />} />
            <Route path="/post/:id/edit" element={<EditPostComponent />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/profile/:username/*" element={<ProfileComponent />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
          <CSSTransition
            timeout={330}
            in={state.isSearchOpen}
            classNames="search-overlay"
            unmountOnExit
          >
            <SearchComponent />
          </CSSTransition>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<Main />);
if (module.hot) {
  module.hot.accept();
}
