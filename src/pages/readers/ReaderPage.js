import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router";
import ReaderDetails from "./ReaderDetails";
import { useProfileData, useSetProfileData } from "../../contexts/ProfileDataContext";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosReq } from "../../api/axiosDefaults";
import Asset from "../../components/Asset";

const ReaderPage = () => {
  const { id } = useParams();
  const [profileReviews, setProfileReviews] = useState({ results: [] });
  const [loading, setLoading] = useState(true);

  const currentUser = useCurrentUser();
  const { pageProfile } = useProfileData();
  const [profile] = pageProfile.results;
  const { setProfileData } = useSetProfileData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: pageProfile }, { data: profileReviews }] =
          await Promise.all([
            axiosReq.get(`/profiles/${id}/`),
            axiosReq.get(`/reviews/?owner__profile=${id}`),
          ]);
        setProfileData((prevState) => ({
          ...prevState,
          pageProfile: { results: [pageProfile] },
        }));
        setProfileReviews(profileReviews);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, setProfileData]);

  return (
    <Container>
      {loading ? (
        <Asset spinner/>
      ) : (
        <>
          <ReaderDetails profile={profile} currentUser={currentUser} />

          <Container>
            <hr />
            <p>{profile?.owner}'s reviews</p>
            <hr />
            {profileReviews.results.length ? (
              profileReviews.results.map((review) => (
                <div key={review.id}>
                  <p>{review.comment}</p>
                  <hr />
                </div>
              ))
            ) : (
              <p>{`${profile?.owner} hasn't reviewed anything yet.`}</p>
            )}
          </Container>
        </>
      )}
    </Container>
  );
};

export default ReaderPage;
