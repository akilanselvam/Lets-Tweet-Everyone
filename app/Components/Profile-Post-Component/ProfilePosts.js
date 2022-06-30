import React, { useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import LoadingComponent from "../Loading-Component/Loading";
function ProfilePosts() {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    async function getPosts() {
      try {
        const response = await axios.get(`/profile/${username}/posts`);
        console.log(response.data);
        setIsLoading(false);
        setPosts(response.data);
      } catch (e) {
        console.log("There was an error");
      }
    }
    getPosts();
  }, []);
  if (isLoading) {
    return (
      <div>
        <LoadingComponent />
      </div>
    );
  }
  return (
    <div className="list-group">
      {posts.map(post => {
        const date = new Date(post.createdDate);
        const DateFormat = `${
          date.getMonth() + 1
        }/${date.getDate()}/${date.getFullYear()}`;
        return (
          <Link
            key={post._id}
            to={`/post/${post._id}`}
            className="list-group-item list-group-item-action"
          >
            <img className="avatar-tiny" src={post.author.avatar} />{" "}
            <strong>{post.title}</strong>{" "}
            <span className="text-muted small">on {DateFormat} </span>
          </Link>
        );
      })}
    </div>
  );
}

export default ProfilePosts;
