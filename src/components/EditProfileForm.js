import React, { useState, useEffect, useRef } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import { axiosReq } from "../api/axiosDefaults";
import styles from "../styles/EditBookForm.module.css"

const EditProfileForm = ({ show, handleClose, profile, updateProfileData }) => {
  const [name, setName] = useState(profile.name);
  const [content, setContent] = useState(profile.content);
  const [image, setImage] = useState(profile.image);
  const [errors, setErrors] = useState({});
  const imageFile = useRef();

  useEffect(() => {
    setName(profile.name);
    setContent(profile.content);
    setImage(profile.image);
  }, [profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "image") {
      setImage(URL.createObjectURL(event.target.files[0]));
    } else {
      if (name === "name") {
        setName(value);
      } else {
        setContent(value);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("content", content);

    if (imageFile?.current?.files[0]) {
      formData.append("image", imageFile.current.files[0]);
    }

    try {
      const response = await axiosReq.put(`/profiles/${profile.id}/`, formData);
      updateProfileData(response.data);
      handleClose();
    } catch (error) {
      setErrors(error.response?.data);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header className={styles.closeBtn}>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mt-3">
            <Form.Label>Display Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={handleChange}
              name="name"
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Bio</Form.Label>
            <Form.Control
              as="textarea"
              value={content}
              onChange={handleChange}
              name="content"
              rows={5}
            />
          </Form.Group>
          <Form.Group className="mt-3 text-center">
            {image && (
              <figure>
                <Image className={styles.coverImagePreview} src={image} fluid />
              </figure>
            )}
            <div>
              <Form.Label htmlFor="image-upload" className={`${styles.uploadBtn} btn my-auto`}>
                Change Image
              </Form.Label>
            </div>
            <Form.File
              id="image-upload"
              ref={imageFile}
              accept="image/*"
              name="image"
              onChange={handleChange}
              className="d-none"
            />
          </Form.Group>
          
          <Button className={`w-100 mt-3 ${styles.saveBtn}`} type="submit">
            Save Changes
          </Button>
          {errors?.non_field_errors?.map((error, index) => (
            <Alert key={index} variant="danger">
              {error}
            </Alert>
          ))}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditProfileForm;
