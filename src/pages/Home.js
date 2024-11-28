import React, { useEffect, useState } from "react";
import { getDocs, collection, deleteDoc, doc, addDoc, onSnapshot} from "firebase/firestore";
import { db } from "../firebase-config";
import {Link} from "react-router-dom";

function Home( {isAuth} ) {
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

    const deletePost = async (id) => {
        const postDoc = doc(db, "posts", id)
        await deleteDoc(postDoc)
    }

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
                <div className="post">
                    <div className="postHeader">
                        <div className="title">
                            {/* <h1> {post.title} </h1> */}
                            <h1 onClick={() => toggleComments(post.id)} style={{ cursor: "pointer" }}>
                                {post.title}
                            </h1>
                        </div>
                        <div className="deletePost">
                            <button onClick={() => {
                                deletePost(post.id);
                            }}>🗑️</button>
                        </div>
                        <div className="EditPost">
                            {/* <Link to={`/edit/${post.id}`}>
                                <button>Edit</button>
                            </Link> */}
                            {isAuth && (
                                <Link to={`/edit/${post.id}`}>
                                <button>Edit</button>
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="postTextContainer">
                        {post.postText}
                    </div>
                    <h3>@{post.author?.name || "Unknown"}</h3>
                    {/* <h3>@{post.author.name}</h3> */}
                    {/* <CommentSection postId={post.id} addComment={addComment} /> */}
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
      return () => unsubscribe(); // Clean up listener
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

export default Home