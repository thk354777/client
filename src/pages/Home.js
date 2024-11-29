import React, { useEffect, useState } from "react";
import { getDocs, collection, deleteDoc, doc, addDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase-config";
import { Link } from "react-router-dom";
import { FaComment } from "react-icons/fa";
import logo from '../blue-archive-tendou-aris.gif';

function Home({ isAuth, currentUser }) {
  const [postLists, setPostList] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search input
  const postsCollectionRef = collection(db, "posts");
  const [expandedPostId, setExpandedPostId] = useState(null);

  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(postsCollectionRef);
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getPosts();
  }, [postsCollectionRef]);

  const deletePost = async (id) => {
    const postDoc = doc(db, "posts", id);
    await deleteDoc(postDoc);
  };

  const addComment = async (postId, comment) => {
    const commentsCollectionRef = collection(db, "posts", postId, "comments");
    await addDoc(commentsCollectionRef, { text: comment, timestamp: new Date() });
  };

  const toggleComments = (postId) => {
    setExpandedPostId((prevId) => (prevId === postId ? null : postId));
  };

  // Filter posts based on search term
  const filteredPosts = postLists.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  return (
    <div className="homePage">
      <div className="search">
        <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: "20px", padding: "10px", width: "100%" }}
        /></div>
    

    
      {filteredPosts.map((post) => (
        <div className="post" key={post.id}>
          <img className="image" src={logo} alt="loading..." />
          <div className="postHeader">
            <div className="title">
              <h1 onClick={() => toggleComments(post.id)} style={{ cursor: "pointer" }}>
                {post.title}
              </h1>
            </div>
            {isAuth && currentUser?.uid === post.authorId && (
              <>
                <div className="deletePost">
                  <button onClick={() => deletePost(post.id)}>🗑️</button>
                </div>
                <div className="EditPost">
                  <Link to={`/edit/${post.id}`}>
                    <button>Edit</button>
                  </Link>
                </div>
              </>
            )}
          </div>
          <div className="postTextContainer">{post.postText}</div>
          <h5>@{post.author?.name || "Unknown"}</h5>
          <FaComment
            onClick={() => toggleComments(post.id)}
            style={{ cursor: "pointer", color: "#007BFF" }}
          />
          <span style={{ color: "#007BFF" }}> 1</span>
          {expandedPostId === post.id && (
            <CommentSection postId={post.id} addComment={addComment} />
          )}
        </div>
      ))}
    </div>
  );
}

function CommentSection({ postId, addComment }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const commentsCollectionRef = collection(db, "posts", postId, "comments");
    const unsubscribe = onSnapshot(commentsCollectionRef, (snapshot) => {
      setComments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [postId]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(postId, newComment);
      setNewComment("");
    }
  };

  return (
    <div className="commentsSection">
      <div className="commentsList">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <p>{comment.text}</p>
            <small>{new Date(comment.timestamp?.toDate()).toLocaleString()}</small>
          </div>
        ))}
      </div>
      <div className="addComment">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button onClick={handleAddComment}>Post</button>
      </div>
    </div>
  );
}

export default Home;
