import React, { useState, useEffect } from 'react';
import {
  deleteUser,
  deleteBlogPost,
  deletePreMedicalForm,
  deleteComment,
  getAllUsers,
  getPatientBlogPosts,
  getPatientSymptoms,
  getAdminComments,
} from '../../apiService';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [comments, setComments] = useState([]);

  const fetchData = async () => {
    try {
      const usersData = await getAllUsers();
      const blogPostsData = await getPatientBlogPosts();
      const symptomsData = await getPatientSymptoms();
      const commentsData = await getAdminComments(blogPostsData.map((post) => post.id));

      setUsers(usersData);
      setBlogPosts(blogPostsData);
      setSymptoms(symptomsData);
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleDeleteBlogPost = async (blogPostId) => {
    try {
      await deleteBlogPost(blogPostId);
      fetchData();
    } catch (error) {
      console.error('Error deleting blog post:', error);
    }
  };

  const handleDeletePreMedicalForm = async (formId) => {
    try {
      await deletePreMedicalForm(formId);
      fetchData();
    } catch (error) {
      console.error('Error deleting pre-medical form:', error);
    }
  };

  const handleDeleteComment = async (commentId, blogPostId) => {
    try {
      await deleteComment(commentId);
      fetchData();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="admin-dashboard-container mt-5">
      <h2 className="text-center mb-4">Admin Dashboard</h2>
      <Button className="btn btn-primary mb-4" onClick={fetchData}>
        Refresh Data
      </Button>

      <div className="user-cards-container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
        {users.map((user) => (
          <Card key={user.id} className="user-card mb-4" style={{ width: '300px', margin: '15px 0', backgroundColor: '#f8f9fa', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', transition: 'transform 0.3s', display: 'flex', flexDirection: 'column' }}>
            <Card.Header style={{ padding: '10px', backgroundColor: '#343a40', color: '#ffffff', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
              <h3>{user.username}</h3>
              <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user.id)}>
                Delete User
              </Button>
            </Card.Header>
            <Card.Body style={{ padding: '15px', flexGrow: '1' }}>
              <Card.Text>
                <h4>Blog Posts:</h4>
                <ul>
                  {blogPosts
                    .filter((post) => post.author === user.id)
                    .map((post) => (
                      <li key={post.id} className="mb-3">
                        {post.title} -{' '}
                        <Button variant="danger" size="sm" onClick={() => handleDeleteBlogPost(post.id)}>
                          Delete Blog Post
                        </Button>
                        <h5 className="mt-2">Comments:</h5>
                        <ul>
                          {comments
                            .filter((comment) => comment.blog_post === post.id)
                            .map((comment) => (
                              <li key={comment.id} className="mb-2">
                                {comment.content} -{' '}
                                <Button variant="danger" size="sm" onClick={() => handleDeleteComment(comment.id, post.id)}>
                                  Delete Comment
                                </Button>
                              </li>
                            ))}
                        </ul>
                      </li>
                    ))}
                </ul>

                <h4 className="mt-3">Pre-Medical Forms:</h4>
                <ul>
                  {symptoms
                    .filter((symptom) => symptom.patient === user.id)
                    .map((symptom) => (
                      <li key={symptom.id} className="mb-2">
                        {symptom.symptoms} -{' '}
                        <Button variant="danger" size="sm" onClick={() => handleDeletePreMedicalForm(symptom.id)}>
                          Delete Pre-Medical Form
                        </Button>
                      </li>
                    ))}
                </ul>
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
