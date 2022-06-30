import React, { useState } from "react";
import Page from "../Page-Component/Page";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import DispatchContext from "../../Context/DispatchContext-Provider";
import StateContext from "../../Context/StateContext-Provider";
function CreatePostComponent(props) {
  const [title, setTitle] = useState();
  const [body, setBody] = useState();
  const addDispatchContext = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post("/create-post", {
        title,
        body,
        token: appState.user.token
      });
      addDispatchContext({
        type: "flashMessage",
        value: "You have been logged out"
      });
      navigate(`/post/${response.data}`);
      console.log("Post created successfully");
    } catch (e) {
      console.log("Error creating");
    }
  }
  return (
    <Page title="Create Post">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            onChange={e => setTitle(e.target.value)}
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            onChange={e => setBody(e.target.value)}
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
          ></textarea>
        </div>

        <button className="btn btn-primary">Save New Post</button>
      </form>
    </Page>
  );
}

export default CreatePostComponent;
