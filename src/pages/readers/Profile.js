import React from "react";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import FollowButton from "../../components/FollowButton";

const Profile = ({ profile }) => {

  return (
    <div className="my-3 d-flex align-items-center">
      <Link className="align-self-center" to={`/readers/${profile.id}`}>
        <Avatar src={profile.image} height={55} />
      </Link>
      <div className="mx-2">
        <strong>{profile.owner}</strong>
      </div>
      <div className="ml-auto">
        <FollowButton profile={profile} />
      </div>
    </div>
  );
};

export default Profile;
