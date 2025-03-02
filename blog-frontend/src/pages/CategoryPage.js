import React from "react";
import { useParams } from "react-router-dom";

const CategoryPage = () => {
  const { category } = useParams();
  return (
    <div>
      <h1>{category} Posts</h1>
      <p>Displaying posts related to {category}.</p>
    </div>
  );
};

export default CategoryPage;
