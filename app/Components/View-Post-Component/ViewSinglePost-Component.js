import React, { useState, useEffect, useContext } from "react";
import Page from "../Page-Component/Page";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import LoadingComponent from "../Loading-Component/Loading";
import ReactMarkdown from "react-markdown";
import ReactTooltip from "react-tooltip";
import StateContext from "../../Context/StateContext-Provider";
import { useNavigate } from "react-router-dom";
import DispatchContext from "../../Context/DispatchContext-Provider";
function ViewSinglePostComponent() {
  const navigation = useNavigate();
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState();
  const ourRequest = axios.CancelToken.source();
  useEffect(() => {
    async function getPost() {
      try {
        const response = await axios.get(`/post/${id}`, {
          cancelToken: ourRequest.token
        });
        console.log(response.data);
        setIsLoading(false);
        setPost(response.data);
      } catch (e) {
        console.log("There was an error");
      }
    }
    getPost();
    return () => {
      ourRequest.cancel;
    };
  }, [id]);
  if (isLoading) {
    return (
      <Page title="...">
        <LoadingComponent />
      </Page>
    );
  }
  async function deleteHandler() {
    const areYouSure = window.confirm(
      "Are you sure you want to delete this post"
    );
    if (areYouSure) {
      try {
        const response = await axios.delete(`/post/${id}`, {
          data: { token: appState.user.token }
        });
        if (response.data == "Success") {
          appDispatch({
            type: "flashMessage",
            value: "Post Deleted Successfully"
          });
          navigation(`/profile/${appState.user.username}`);
        }
      } catch (e) {
        console.log("Error Happend while deleting");
      }
    }
  }

  const date = new Date(post.createdDate);
  const DateFormat = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;
  function isAuthor() {
    if (appState.user.username == post.author.username) {
      return true;
    }
    return false;
  }
  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isAuthor() && (
          <span className="pt-2">
            <Link
              to={`/post/${post._id}/edit`}
              data-tip="Edit"
              data-for="edit"
              className="text-primary mr-2"
            >
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" className="custom-tooltip" />{" "}
            <a
              onClick={deleteHandler}
              className="delete-post-button text-danger"
              data-tip="Delete"
              data-for="delete"
            >
              <i className="fas fa-trash"></i>
            </a>
            <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by{" "}
        <Link to={`/profile/${post.author.username}`}>
          {post.author.username}
        </Link>{" "}
        on {DateFormat}
      </p>

      <div className="body-content">
        <ReactMarkdown children={post.body} />
      </div>
    </Page>
  );
}
export default ViewSinglePostComponent;
