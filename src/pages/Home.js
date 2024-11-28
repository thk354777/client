import React, { useEffect, useState } from "react";
import { getDocs, collection, onSnapshot, addDoc } from "firebase/firestore"; // Add addDoc here
import { db, auth } from "../firebase-config";
import { Link } from "react-router-dom";
import DeletePost from './DeletePost';  // Import the DeletePost component

function Home({ isAuth }) {
  const [postLists, setPostList] = useState([]);
  const postsCollectionRef = collection(db, "posts");
  const [expandedPostId, setExpandedPostId] = useState(null);

  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(postsCollectionRef);
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getPosts();
  }, [postsCollectionRef]);

  const addComment = async (postId, comment) => {
    const commentsCollectionRef = collection(db, "posts", postId, "comments");
    await addDoc(commentsCollectionRef, { text: comment, timestamp: new Date() });
  };

  const toggleComments = (postId) => {
    setExpandedPostId((prevId) => (prevId === postId ? null : postId));
  };

  return (
    <div className="homePage">
      {postLists.map((post) => {
        return (
          <div className="post" key={post.id}>
            <div className="postHeader">
              <div className="title">
                <h1 onClick={() => toggleComments(post.id)} style={{ cursor: "pointer" }}>
                  {post.title}
                </h1>
              </div>
              <div className="deletePost">
                {post.auther.id === auth.currentUser?.uid && (
                  <DeletePost postId={post.id} authorId={post.auther.id} />
                )}
              </div>
              <div className="EditPost">
                {isAuth && (
                  <Link to={`/edit/${post.id}`}>
                    <button>Edit</button>
                  </Link>
                )}
              </div>
            </div>
            <div className="postTextContainer">{post.postText}</div>
            <h3>@{post.auther.name || "Unknown"}</h3>
            {expandedPostId === post.id && (
              <CommentSection postId={post.id} addComment={addComment} />
            )}
          </div>
        );
      })}
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
