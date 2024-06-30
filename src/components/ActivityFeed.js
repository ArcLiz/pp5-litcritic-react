import React, { useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import styles from "../styles/ActivityFeed.module.css";
import { axiosReq } from "../api/axiosDefaults";
import { useProfileData } from "../contexts/ProfileDataContext";
import Asset from "../components/Asset";
import { Link } from "react-router-dom";

const ActivityFeed = () => {
  const { pageProfile } = useProfileData();
  const [latestActivity, setLatestActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (pageProfile.results.length > 0) {
          const [{ data: reviewsData }, { data: followersData }] = await Promise.all([
            axiosReq.get(`/reviews/?owner=${pageProfile.results[0]?.id}`),
            axiosReq.get(`/followers/?owner=${pageProfile.results[0]?.id}`),
          ]);

          const username = pageProfile.results[0].owner;

          const combinedActivity = [
            ...reviewsData.results.map((review) => ({ ...review, type: "review" })),
            ...followersData.results
              .filter((follower) => follower.owner === username) // in case the api url filter doesn't work
              .map((follower) => ({ ...follower, type: "follower" })),
          ];

          const sortedActivity = combinedActivity.sort((a, b) => {
            const dateA = new Date(b.updated_at || b.created_at);
            const dateB = new Date(a.updated_at || a.created_at);
            return dateA - dateB;
          });

          const latestActivityData = sortedActivity.slice(0, 5);

          setLatestActivity(latestActivityData);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        // console.error("Error fetching activity:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [pageProfile]);

  return (
    <Card className={styles.mainContainer}>
      <Card.Body className="small">
        <Card.Title>Recent Activities</Card.Title>
        <hr />
        {loading && <Asset spinner />}
        {!loading && latestActivity.length === 0 && (
          <p className={styles.noActivity}>No recent activity</p>
        )}
        {!loading && latestActivity.length > 0 && (
          <ListGroup variant="flush">
            {latestActivity.map((item, index) => (
              <ListGroup.Item key={`activity-${index}`}>
                {item.type === "review" && (
                  <>
                    <Link className={styles.logLink} to={`/books/${item.book_detail.id}`}>
                      <i className="fa-solid fa-feather-pointed"></i> {item.book_detail.title}
                    </Link>
                  </>
                )}
                {item.type === "follower" && (
                  <>
                    <Link className={styles.logLink} to={`/readers/${item.followed}`}>
                      <i className="fa-solid fa-heart-circle-check" /> @{item.followed_name}
                    </Link>
                  </>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
};

export default ActivityFeed;
