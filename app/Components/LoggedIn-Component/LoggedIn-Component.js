import React from "react";
import { Link } from "react-router-dom";
import ParentContext from "../../Context/ContextParent";
import { useContext } from "react";
import DispatchContext from "../../Context/DispatchContext-Provider";
import StateContext from "../../Context/StateContext-Provider";
import { useNavigate } from "react-router-dom";
function LoggedInComponent(props) {
  const navigate = useNavigate();
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  function handleLogout() {
    appDispatch({ type: "logout" });
    appDispatch({
      type: "flashMessage",
      value: "You have been logged out"
    });
    navigate("/");
  }
  function searchOpener(e) {
    e.preventDefault();
    appDispatch({ type: "searchOpen" });
  }
  return (
    <div className="flex-row my-3 my-md-0">
      <Link
        to={`/profile/${appState.user.username}`}
        className="btn btn-sm text-white mr-2"
        href="/create-post"
      >
        Hey {appState.user.username} !!
      </Link>
      <a
        href="#"
        onClick={searchOpener}
        className="text-white mr-2 header-search-icon"
      >
        <i className="fas fa-search"></i>
      </a>
      <span className="mr-2 header-chat-icon text-white">
        <i className="fas fa-comment"></i>
        <span className="chat-count-badge text-white"> </span>
      </span>
      <Link to={`/profile/${appState.user.username}`} className="mr-2">
        <img className="small-header-avatar" src={appState.user.avatar} />
      </Link>
      <Link className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>
      <button onClick={handleLogout} className="btn btn-sm btn-secondary">
        Sign Out
      </button>
    </div>
  );
}

export default LoggedInComponent;
