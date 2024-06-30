import React from "react";
import styles from "../styles/FollowButton.module.css";
import { useSetProfileData } from "../contexts/ProfileDataContext";

const FollowButton = ({ profile }) => {
  const { handleFollow, handleUnfollow } = useSetProfileData();

  const following = profile ? !!profile.following_id : false;

  const handleButtonClick = async () => {
    try {
      if (following) {
        await handleUnfollow({ following_id: profile.following_id });
      } else {
        await handleFollow(profile);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  if (!profile) {
    return null;
  }

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
