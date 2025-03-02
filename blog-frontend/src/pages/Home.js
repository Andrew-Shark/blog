import React, { useEffect, useState } from "react";

const Home = () => {
  const [posts, setPosts] = useState([]); 
  const [featuredPosts, setFeaturedPosts] = useState([]); 
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const [filteredPosts, setFilteredPosts] = useState([]); 
  const [visiblePosts, setVisiblePosts] = useState(10);


  // Завантаження всіх постів
  useEffect(() => {
    fetch("http://localhost:5002/api/articles/recent")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
      })
      .catch((err) => console.error("Помилка завантаження статей:", err));

    fetch("http://localhost:5002/api/articles/featured")
      .then((res) => res.json())
      .then((data) => {
        setFeaturedPosts(data);
      })
      .catch((err) => console.error("Помилка завантаження Featured статей:", err));
  }, []);

  const handleCategorySelect = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null); 
      setFilteredPosts([]); 
    } else {
      setSelectedCategory(category);
      setVisiblePosts(10); 
  
      fetch(`http://localhost:5003/api/articles/category/${category}`)

        .then((res) => res.json())
        .then((data) => {
          setFilteredPosts(data);
        })
        .catch((err) => console.error("Помилка завантаження категорії:", err));
    }
  };
  

  // Завантаження додаткових статей
  const loadMorePosts = () => {
    setVisiblePosts((prev) => prev + 20);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Let's do it together.</h1>
          <p>We travel the world in search of stories. Come along for the ride.</p>
          <button onClick={() => setSelectedPost(posts[0])}>View Latest Posts</button>
        </div>
      </section>

      {/* Categories */}
      <nav className="categories">
        {["Nature", "Photography", "Relaxation", "Vacation", "Travel", "Adventure"].map((category) => (
          <button
            key={category}
            className={selectedCategory === category ? "active-category" : ""}
            onClick={() => handleCategorySelect(category)}
          >
            {category}
          </button>
        ))}
      </nav>

      {/* Featured & Recent Posts (приховані при виборі категорії) */}
      {!selectedCategory && (
        <>
          <section className="featured-posts">
            <h2 className="section-title">Featured Posts</h2>
            <div className="post-list">
              {featuredPosts.map((post) => (
                <article key={post._id} className="post-card" onClick={() => setSelectedPost(post)}>
                  <img src={post.image ? `http://localhost:5001/uploads/${post.image}` : "/default-post.jpg"} alt={post.title} className="post-image" />
                  <h3>{post.title}</h3>
                  <p>{post.content.slice(0, 100)}...</p>
                  <hr />
                  <div className="post-footer">
                    <img src={post.author?.profileImage ? `http://localhost:5001/uploads/${post.author.profileImage}` : "/default-avatar.jpg"} alt="Author" className="author-image" />
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="most-recent">
            <h2 className="section-title">Most Recent</h2>
            <div className="post-list">
              {posts.slice(0, visiblePosts).map((post) => (
                <article key={post._id} className="post-card" onClick={() => setSelectedPost(post)}>
                  <img src={post.image ? `http://localhost:5001/uploads/${post.image}` : "/default-post.jpg"} alt={post.title} className="post-image" />
                  <h3>{post.title}</h3>
                  <p>{post.content.slice(0, 100)}...</p>
                  <hr />
                  <div className="post-footer">
                    <img src={post.author?.profileImage ? `http://localhost:5001/uploads/${post.author.profileImage}` : "/default-avatar.jpg"} alt="Author" className="author-image" />
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </article>
              ))}
            </div>
            {visiblePosts < posts.length && (
              <button className="load-more-btn" onClick={loadMorePosts}>Load More</button>
            )}
          </section>
        </>
      )}

      {/* Фільтровані статті (при виборі категорії) */}
      {selectedCategory && (
        <section className="filtered-posts">
          <h2 className="section-title">{selectedCategory} Posts</h2>
          <div className="post-list">
            {filteredPosts.slice(0, visiblePosts).map((post) => (
              <article key={post._id} className="post-card" onClick={() => setSelectedPost(post)}>
                <img src={post.image ? `http://localhost:5001/uploads/${post.image}` : "/default-post.jpg"} alt={post.title} className="post-image" />
                <h3>{post.title}</h3>
                <p>{post.content.slice(0, 100)}...</p>
                <hr />
                <div className="post-footer">
                  <img src={post.author?.profileImage ? `http://localhost:5001/uploads/${post.author.profileImage}` : "/default-avatar.jpg"} alt="Author" className="author-image" />
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </article>
            ))}
          </div>
          {visiblePosts < filteredPosts.length && (
            <button className="load-more-btn" onClick={loadMorePosts}>Load More</button>
          )}
        </section>
      )}

      {/*Вікно для перегляду статті */}
      {selectedPost && (
        <div className="modal-overlay" onClick={() => setSelectedPost(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedPost(null)}>✖</button>
            <img src={selectedPost.image ? `http://localhost:5001/uploads/${selectedPost.image}` : "/default-post.jpg"} alt={selectedPost.title} className="modal-image" />
            <h2>{selectedPost.title}</h2>
            <p>{selectedPost.content}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
