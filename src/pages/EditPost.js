import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';


export default function EditPost() {
    const { id } = useParams(); // Get post ID from URL
    const navigate = useNavigate(); // For redirecting
    const [title, setTitle] = useState('');
    const [postText, setPostText] = useState('');
  
    useEffect(() => {
      const fetchPost = async () => {
        const postDoc = doc(db, 'posts', id);
        const docSnap = await getDoc(postDoc);
        if (docSnap.exists()) {
          const postData = docSnap.data();
          setTitle(postData.title);
          setPostText(postData.postText);
        } else {
          console.log('No such document!');
        }
      };
      fetchPost();
    }, [id]);
  
    const updatePost = async () => {
      const postDoc = doc(db, 'posts', id);
      await updateDoc(postDoc, { title, postText });
      navigate('/'); // Redirect to Home after update
    };
  
    return (
      <div className="createPostPage">
        <div className="cpContainer">
          <h1>Edit Post</h1>
          <div className="inputGp">
            <label>Title:</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title..."
            />
          </div>
          <div className="inputGp">
            <label>Post:</label>
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Post..."
            />
          </div>
          <button onClick={updatePost}>Update Post</button>
        </div>
      </div>
    );
  }
  