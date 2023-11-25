// PostView.js
import React, { useState, useEffect } from 'react';
import { getPatientBlogPosts, getComments } from '../../apiService';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Offcanvas from 'react-bootstrap/Offcanvas';

const PostView = () => {
  const [patientData, setPatientData] = useState([]);
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
      const blogPosts = await getPatientBlogPosts();
      setPatientData(blogPosts);
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
                <Button variant="outline-secondary" onClick={() => handleShowComments(post.id)}>
                  Show Comments
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

export default PostView;
