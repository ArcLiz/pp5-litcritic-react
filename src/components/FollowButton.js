import React from "react";
import { useSetProfileData } from "../contexts/ProfileDataContext";
import styles from "../styles/FollowButton.module.css";

const FollowButton = ({ profile }) => {
  const { handleFollow, handleUnfollow } = useSetProfileData();
  const { following_id } = profile;

  const handleFollowClick = () => {
    if (handleFollow) {
      handleFollow(profile);
    }
  };

  const handleUnfollowClick = () => {
    if (handleUnfollow) {
      handleUnfollow(profile);
    }
  };

  return (
    <>
      {following_id ? (
        <span className="text-success me-2" onClick={handleUnfollowClick}>
          <i className={`fa-solid fa-heart-circle-check ${styles.followedUser}`} />
        </span>
      ) : (
        <span className="text-primary me-2" onClick={handleFollowClick}>
          <i className={`fa-solid fa-heart-circle-xmark ${styles.unfollowedUser}`} />
        </span>
      )}
    </>
  );
};

export default FollowButton;
