import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Page from "../Page-Component/Page";
import axios from "axios";
import StateContext from "../../Context/StateContext-Provider";
import ProfilePosts from "../Profile-Post-Component/ProfilePosts";
function ProfileComponent() {
  const { username } = useParams();
  const appState = useContext(StateContext);
  const [profile, setProfile] = useState({
    profileUsername: "...",
    profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
    isFollowing: false,
    counts: { postCount: "", followerCount: "", followingCount: "" }
  });
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.post(`/profile/${username}`, {
          token: appState.user.token
        });
        console.log(response.data);
        setProfile(response.data);
      } catch (e) {
        console.log("there was an error fetching");
      }
    }
    fetchData();
  }, []);
  return (
    <Page>
      <h2>
        <img className="avatar-small" src={profile.profileAvatar} />{" "}
        {profile.profileUsername}
        <button className="btn btn-primary btn-sm ml-2">
          Follow <i className="fas fa-user-plus"></i>
        </button>
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <a href="#" className="active nav-item nav-link">
          Posts: {profile.counts.postCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Followers: {profile.counts.followerCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Following: {profile.counts.followingCount}
        </a>
      </div>
      <ProfilePosts />
    </Page>
  );
}

export default ProfileComponent;
