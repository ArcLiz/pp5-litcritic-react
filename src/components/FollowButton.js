import React, { useState } from "react";
import { useSetProfileData } from "../contexts/ProfileDataContext";
import styles from "../styles/FollowButton.module.css"

const FollowButton = ({ profile }) => {
  const { handleFollow, handleUnfollow } = useSetProfileData();
  const [following, setFollowing] = useState(profile.following_id ? true : false);

  const handleButtonClick = async () => {
    try {
      if (following) {
        await handleUnfollow(profile);
        setFollowing(false);
      } else {
        await handleFollow(profile);
        setFollowing(true);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  return (
    <>
      {following ? (
        <span
          className={`text-success me-2 ${styles.followedUser}`}
          onClick={handleButtonClick}
        >
          <i className="fa-solid fa-heart-circle-check" />
        </span>
      ) : (
        <span
          className={`text-primary me-2 ${styles.unfollowedUser}`}
          onClick={handleButtonClick}
        >
          <i className="fa-solid fa-heart-circle-xmark" />
        </span>
      )}
    </>
  );
};

export default FollowButton;
