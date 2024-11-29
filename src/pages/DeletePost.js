import React from 'react';
import { deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase-config";

const DeletePost = ({ postId, authorId }) => {
  const deletePost = async () => {
    if (authorId === auth.currentUser?.uid) {
      const postDoc = doc(db, "posts", postId);
      await deleteDoc(postDoc);
    } else {
      alert("You can only delete your own posts.");
    }
  };

  return (
    <button onClick={deletePost}>
      🗑️
    </button>
  );
};

export default DeletePost;