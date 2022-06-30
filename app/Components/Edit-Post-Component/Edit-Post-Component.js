import React, { useState, useEffect, useContext } from "react";
import Page from "../Page-Component/Page";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import LoadingComponent from "../Loading-Component/Loading";
import { useImmerReducer } from "use-immer";
import StateContext from "../../Context/StateContext-Provider";
import DispatchContext from "../../Context/DispatchContext-Provider";
import { useNavigate } from "react-router-dom";
function EditPostComponent() {
  const navigate = useNavigate();
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const originalState = {
    title: {
      value: "",
      hasError: false,
      message: ""
    },
    body: {
      value: "",
      hasError: false,
      message: ""
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0
  };
  function ourReducer(draft, action) {
    switch (action.type) {
      case "fetchComplete":
        draft.title.value = action.value.title;
        draft.body.value = action.value.body;
        draft.isFetching = false;
        return;
      case "titleChange":
        draft.title.hasErrors = false;
        draft.title.value = action.value;
        return;
      case "bodyChange":
        draft.body.hasErrors = false;
        draft.body.value = action.value;
        return;
      case "submitRequest":
        if (!draft.title.hasErrors && !draft.body.hasErrors) {
          draft.sendCount++;
        }
        return;
      case "saveRequestStarted":
        draft.isSaving = true;
        return;
      case "saveRequestFinished":
        draft.isSaving = false;
        return;
      case "titleRules":
        if (!action.value.trim()) {
          draft.title.hasErrors = true;
          draft.title.message = "You must provide a title.";
        }
        return;
      case "bodyRules":
        if (!action.value.trim()) {
          draft.body.hasErrors = true;
          draft.body.message = "You must provide body content.";
        }
        return;
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, originalState);
  function submitHandler(e) {
    e.preventDefault();
    dispatch({ type: "titleRules", value: state.title.value });
    dispatch({ type: "bodyRules", value: state.body.value });
    dispatch({ type: "submitRequest" });
  }
  useEffect(() => {
    const ourRequest = axios.CancelToken.source();
    async function getPost() {
      try {
        const response = await axios.get(`/post/${state.id}`, {
          cancelToken: ourRequest.token
        });
        dispatch({ type: "fetchComplete", value: response.data });
      } catch (e) {
        console.log("There was an error");
      }
    }
    getPost();
    return () => {
      ourRequest.cancel();
    };
  }, []);

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "saveRequestStarted" });
      const ourRequest = axios.CancelToken.source();
      async function getPost() {
        try {
          const response = await axios.post(
            `/post/${state.id}/edit`,
            {
              title: state.title.value,
              body: state.body.value,
              token: appState.user.token
            },
            {
              cancelToken: ourRequest.token
            }
          );

          appDispatch({ type: "flashMessage", value: "Post was updated." });
          dispatch({ type: "saveRequestFinished" });
          navigate(`/post/${state.id}`);
        } catch (e) {
          console.log("There was an error");
        }
      }
      getPost();
      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.sendCount]);

  if (state.isFetching) {
    return (
      <Page title="...">
        <LoadingComponent />
      </Page>
    );
  }

  return (
    <Page title="Edit Post">
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            onChange={e =>
              dispatch({ type: "titleChange", value: e.target.value })
            }
            onBlur={e =>
              dispatch({ type: "titleRules", value: e.target.value })
            }
            value={state.title.value}
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
          />
          {state.title.hasErrors && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.title.message}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            onChange={e =>
              dispatch({ type: "bodyChange", value: e.target.value })
            }
            onBlur={e => dispatch({ type: "bodyRules", value: e.target.value })}
            value={state.body.value}
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
          ></textarea>
          {state.body.hasErrors && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.body.message}
            </div>
          )}
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>
          Save Updates
        </button>
      </form>
    </Page>
  );
}
export default EditPostComponent;
