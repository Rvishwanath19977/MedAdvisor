// PatientPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { getPatientBlogPosts, createComment, getPatientSymptoms, getComments } from '../../apiService';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Offcanvas from 'react-bootstrap/Offcanvas';
const PatientPage = () => {
  const { user } = useAuth();
  const [patientData, setPatientData] = useState([]);
  const [commentContents, setCommentContents] = useState({});
  const [selectedBlogPostId, setSelectedBlogPostId] = useState(null);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    fetchPatientData();
  }, [user.id]);

  useEffect(() => {
    if (selectedBlogPostId) {
      fetchComments(selectedBlogPostId);
    }
  }, [selectedBlogPostId]);

  const fetchPatientData = async () => {
    try {
      const blogPosts = await getPatientBlogPosts(user.id);
      const symptomsData = await getPatientSymptoms(user.id);
  
      console.log('Blog Posts:', blogPosts);
      console.log('Symptoms Data:', symptomsData);
  
      const mergedData = blogPosts
        .filter((post) => post.author === user.id)
        .map((post, index) => {
          const correspondingSymptom = symptomsData[index];
  
          return {
            ...post,
            symptoms: correspondingSymptom ? correspondingSymptom.symptoms : null,
            age: correspondingSymptom ? correspondingSymptom.age : null,
            country: correspondingSymptom ? correspondingSymptom.country : null,
            gender: correspondingSymptom ? correspondingSymptom.gender : null,
            disorders_diagnosed: correspondingSymptom ? correspondingSymptom.disorders_diagnosed : null,
            prediction: correspondingSymptom ? correspondingSymptom.prediction : null,
          };
        });
  
      console.log('Merged Data:', mergedData);
  
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
  
  
  

  const handleComment = async (postId, patientUserId) => {
    try {
      const content = commentContents[postId];
      await createComment({
        content,
        author: user.id,
        blog_post: postId,
        commenter_role: 'patient',
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
    fetchComments(postId);
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
                <Card.Text><strong>Disorders Diagnosed:</strong> {post.disorders_diagnosed}</Card.Text>
                <Card.Text><strong>Stress %:</strong> {post.prediction}</Card.Text>
                {post.predictions && (
                  <Card.Text className="mt-3"><strong>ML Predictions:</strong> {post.predictions}</Card.Text>
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

export default PatientPage;