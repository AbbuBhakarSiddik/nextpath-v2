import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Form, Container, Row, Col, Spinner } from "react-bootstrap";

const TechNews = () => {
  const [news, setNews] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Loading state

  const BASE_URL = "http://localhost:5000/api/technews"; // Full backend URL

  // Fetch today's news from backend
  const fetchTodayNews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/today`);
      setNews(res.data);
    } catch (err) {
      console.error("Failed to fetch news:", err);
    } finally {
      setLoading(false);
    }
  };

  // Search news by keyword
  const searchNews = async () => {
    if (!query) return fetchTodayNews();
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/search?query=${query}`);
      setNews(res.data);
    } catch (err) {
      console.error("Failed to search news:", err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh news (get latest from backend)
  const refreshNews = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/refresh`);
      setNews(res.data);
    } catch (err) {
      console.error("Failed to refresh news:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load news on component mount
  useEffect(() => {
    fetchTodayNews();
  }, []);

  return (
    <div className="bg-dark min-vh-100 text-light">
      <Container className="py-5">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-4" style={{ color: "#00FF7F" }}>
            Daily Tech News
          </h1>
          <p className="lead" style={{ color: "#FFFFFF" }}>
            "Stay updated with the latest in technology, AI, and innovation."
          </p>
        </div>

        {/* Search Bar */}
        <Form className="d-flex justify-content-center mb-4">
          <Form.Control
            type="text"
            placeholder="Search tech news..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="me-2"
            style={{ maxWidth: "400px" }}
          />
          <Button variant="success" onClick={searchNews} className="me-2" disabled={loading}>
            Search
          </Button>
          <Button variant="primary" onClick={refreshNews} disabled={loading}>
            Refresh
          </Button>
        </Form>

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center mb-4">
            <Spinner animation="border" variant="success" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}

        {/* News Cards */}
        <Row className="g-4">
          {news.map((article, index) => (
            <Col md={4} key={index}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title style={{ color: "#28a745" }}>{article.title}</Card.Title>
                  <Card.Text style={{ color: "#000000" }}>{article.description}</Card.Text>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-between align-items-center">
                  <small>{article.source}</small>
                  <small>{new Date(article.publishedAt).toLocaleDateString()}</small>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline-primary btn-sm"
                  >
                    Read More
                  </a>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default TechNews;
