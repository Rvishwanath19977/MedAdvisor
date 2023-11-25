// DoctorPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { getPatientBlogPosts, replyToPreMedicalForm, createComment, getPatientSymptoms, getComments } from '../../apiService';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Offcanvas from 'react-bootstrap/Offcanvas';

const DoctorPage = () => {
  const { user } = useAuth();
  // eslint-disable-next-line
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [patientData, setPatientData] = useState([]);
  const [commentContents, setCommentContents] = useState({});
  const [selectedBlogPostId, setSelectedBlogPostId] = useState(null);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    fetchPatientData();
  }, []);

  useEffect(() => {
    if (selectedBlogPostId) {
      fetchComments(selectedBlogPostId);
    }
  }, [selectedBlogPostId]);

  const fetchPatientData = async () => {
    try {
      const [blogPosts, symptomsData] = await Promise.all([getPatientBlogPosts(), getPatientSymptoms()]);
      const mergedData = blogPosts.map((post, index) => ({
        ...post,
        symptoms: symptomsData[index] ? symptomsData[index].symptoms : null,
        age: symptomsData[index] ? symptomsData[index].age : null,
        country: symptomsData[index] ? symptomsData[index].country : null,
        gender: symptomsData[index] ? symptomsData[index].gender : null,
        disorders_diagnosed: symptomsData[index] ? symptomsData[index].disorders_diagnosed : null,
        prediction: symptomsData[index] ? symptomsData[index].prediction : null,
      }));
  
      setPatientData(mergedData);
      const initialCommentContents = {};
      mergedData.forEach((post) => {
        initialCommentContents[post.id] = '';
      });
      setCommentContents(initialCommentContents);
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleReply = async (postId, doctorUserId) => {
    try {
      await replyToPreMedicalForm(postId);
      setSelectedDoctorId(doctorUserId);
      setSelectedBlogPostId(postId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleComment = async (postId, patientUserId) => {
    try {
      const content = commentContents[postId];
      await createComment({
        content,
        author: user.id,
        blog_post: postId,
        commenter_role: 'doctor',
        receiver: patientUserId,
      });

      setCommentContents((prevContents) => ({
        ...prevContents,
        [postId]: '',
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchComments = async (blogPostId) => {
    try {
      const commentsData = await getComments(blogPostId);
      setComments(commentsData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowComments = (postId) => {
    setSelectedBlogPostId(postId);
    setShowComments(true);
  };

  const handleCloseComments = () => {
    setSelectedBlogPostId(null);
    setShowComments(false);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Patient Posts</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {patientData.map((post) => (
          <Col key={post.id} className="mb-4">
            <Card bg="light" text="dark">
              <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Text><strong>Patient Symptoms:</strong> {post.symptoms}</Card.Text>
                <Card.Text><strong>Post Content:</strong> {post.content}</Card.Text>
                <Card.Text><strong>Age:</strong> {post.age}</Card.Text>
                <Card.Text><strong>Country:</strong> {post.country}</Card.Text>
                <Card.Text><strong>Gender:</strong> {post.gender}</Card.Text>
                <Card.Text><strong>Disorders Diagnosed</strong> {post.disorders_diagnosed}</Card.Text>
                <Card.Text><strong>Stress %:</strong> {post.prediction}</Card.Text>
                {!post.form_filled_by_doctor && (
                  <Button variant="outline-primary" onClick={() => handleReply(post.id, post.patient)}>
                    Mark as Read
                  </Button>
                )}
                <Button variant="outline-secondary" onClick={() => handleShowComments(post.id)}>
                  Show Comments
                </Button>
                <textarea
                  className="form-control mt-3"
                  placeholder="Type your comment"
                  value={commentContents[post.id]}
                  onChange={(e) => setCommentContents((prevContents) => ({
                    ...prevContents,
                    [post.id]: e.target.value,
                  }))}
                />
                <Button variant="outline-success" className="mt-3" onClick={() => handleComment(post.id, post.patient)}>
                  Comment
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Offcanvas show={showComments} onHide={handleCloseComments} style={{ backgroundColor: '#fff', color: '#000', width: '25rem' }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="text-dark"><h3>Comments</h3></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {selectedBlogPostId && (
            <div>
              <ul className="list-unstyled">
                {comments.map((comment) => (
                  <li key={comment.id} className="mb-3">
                    <div className={`p-3 border rounded ${comment.commenter_role === 'doctor' ? 'bg-light' : 'bg-info'} text-dark`}>
                      <strong>{comment.commenter_role === 'doctor' ? 'Doctor' : 'Patient'}</strong>: {comment.content}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default DoctorPage;
