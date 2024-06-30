import React, { useState, useEffect } from "react";
import { Col, Card } from "react-bootstrap";
import Avatar from "../../components/Avatar";
import EditProfileForm from "../../components/EditProfileForm";
import { axiosReq } from "../../api/axiosDefaults";
import styles from "../../styles/ReaderDetails.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useSetProfileData } from "../../contexts/ProfileDataContext";

const ReaderDetails = ({ profile }) => {
  const [showEditProfileForm, setShowEditProfileForm] = useState(false);
  const currentUser = useCurrentUser();
  const [profileData, setProfileData] = useState(profile);
  const { handleFollow, handleUnfollow } = useSetProfileData();

  useEffect(() => {
    setProfileData(profile);
  }, [profile]);

  const updateProfileData = (updatedProfile) => {
    setProfileData(updatedProfile);
  };

  const handleShowEditProfileForm = () => {
    setShowEditProfileForm(true);
  };

  const handleCloseEditProfileForm = () => {
    setShowEditProfileForm(false);
  };

  const handleEditProfile = async (formData) => {
    try {
      const response = await axiosReq.put(`/profiles/${profile.id}/`, formData);
      console.log("Profile updated:", response.data);
      updateProfileData(response.data);
      handleCloseEditProfileForm();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const isOwner = currentUser?.username === profile.owner

  return (
    <Col md={7} className={`${styles.mainContainer}`}>
      <div className="d-flex justify-content-between">
        <div className="d-none d-sm-block">
          <Avatar src={profile.image} height={130} />
        </div>
        <div>
          <h1 className="text-center">{profile.owner}</h1>
          <div className="d-flex justify-content-around">
            <p className="px-2 py-0 my-0 text-muted small">Followers</p>
            <p className="px-2 py-0 my-0 text-muted small">Following</p>
            <p className="px-2 py-0 my-0 text-muted small">Reviews</p>
          </div>
          <div className="d-flex justify-content-around">
            <p className="px-2 py-0 my-0">{profile.followers_count}</p>
            <p className="px-2 py-0 my-0">{profile.following_count}</p>
            <p className="px-2 py-0 my-0">{profile.reviews_count}</p>
          </div>
        </div>
        <div>
        {currentUser && !isOwner && (
  profile?.following_id ? (
    <span
      className={styles.followedUser}
      onClick={() => handleUnfollow(profile)}
    >
      <i className="fa-solid fa-heart-circle-check" />
    </span>
  ) : (
    <span
      className={styles.unfollowedUser}
      onClick={() => handleFollow(profile)}
    >
      <i className="fa-solid fa-heart-circle-xmark" />
    </span>
  )
)}

{currentUser && isOwner && (
  <span onClick={handleShowEditProfileForm}>
    <i className="fa-solid fa-bars small"></i>
  </span>
)}
        </div>
      </div>
      <hr />
      <Card>
        <Card.Body>
          <Card.Text>{profileData.content}</Card.Text>
        </Card.Body>
      </Card>
      <EditProfileForm
        show={showEditProfileForm}
        handleClose={handleCloseEditProfileForm}
        profile={profile}
        handleSubmit={handleEditProfile}
        updateProfileData={updateProfileData}
      />
    </Col>
  );
};

export default ReaderDetails;