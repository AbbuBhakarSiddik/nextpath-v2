import React, { useState, useEffect } from "react";
import { Card, Button, Form, Container, Row, Col, Spinner } from "react-bootstrap";
import api from "../api";

const TechNews = () => {
  const [news, setNews] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch today's news from backend
  const fetchTodayNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/technews/today");
      setNews(res.data);
    } catch (err) {
      console.error("Failed to fetch news:", err);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to fetch news ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  // Search news by keyword
  const searchNews = async () => {
    if (!query.trim()) return fetchTodayNews();

    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/technews/search?query=${encodeURIComponent(query)}`);
      setNews(res.data);
    } catch (err) {
      console.error("Failed to search news:", err);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to search news ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  // Refresh news (get latest from backend)
  const refreshNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/technews/refresh");
      setNews(res.data);
    } catch (err) {
      console.error("Failed to refresh news:", err);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to refresh news ❌"
      );
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
          <Button
            variant="success"
            onClick={searchNews}
            className="me-2"
            disabled={loading}
          >
            Search
          </Button>
          <Button variant="primary" onClick={refreshNews} disabled={loading}>
            Refresh
          </Button>
        </Form>

        {/* Error */}
        {error && (
          <div className="alert alert-danger text-center mb-4">{error}</div>
        )}

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
                  <Card.Title style={{ color: "#28a745" }}>
                    {article.title}
                  </Card.Title>
                  <Card.Text style={{ color: "#000000" }}>
                    {article.description}
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-between align-items-center">
                  <small>{article.source}</small>
                  <small>
                    {article.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString()
                      : ""}
                  </small>
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
