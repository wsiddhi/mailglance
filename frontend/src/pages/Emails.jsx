import React, { useEffect, useState, useCallback } from "react";
import "../App.css";
import filterIcon from '../components/filter.png';

const Emails = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedDateFilter, setSelectedDateFilter] = useState('');
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState('short');
  const [searchQuery, setSearchQuery] = useState("");

  // Use an environment variable for the API base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const filteredEmails = emails.filter((email) => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const searchMatch =
      normalizedQuery === "" ||
      (email.subject && email.subject.toLowerCase().includes(normalizedQuery)) ||
      (email.from && email.from.toLowerCase().includes(normalizedQuery)) ||
      (email.summary && email.summary.toLowerCase().includes(normalizedQuery));

    let dateMatch = true;
    if (selectedDateFilter) {
      const emailDate = new Date(email.date);
      const now = new Date();
      if (selectedDateFilter === "Today") {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        dateMatch = emailDate >= startOfDay;
      } else if (selectedDateFilter === "This Week") {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        dateMatch = emailDate >= weekAgo;
      } else if (selectedDateFilter === "This Month") {
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        dateMatch = emailDate >= monthAgo;
      }
    }

    const labelMatch = selectedLabels.length === 0 || 
      (email.labels && selectedLabels.some(label => email.labels.includes(label)));

    return searchMatch && dateMatch && labelMatch;
  });

  const fetchEmails = useCallback(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/emails?detail=${selectedDetail}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setEmails(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching emails:", err);
        setLoading(false);
      });
  }, [selectedDetail, API_BASE_URL]);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  return (
    <div className="App">
      {/* ... rest of your JSX remains the same ... */}
      {/* Ensure you keep the same structure you already had */}
      <div className="sticky-toolbar">
        <div className="controls-row">
          <input
            type="text"
            placeholder="Search emails..."
            className="search-bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {/* ... */}
        </div>
      </div>
      {/* ... */}
    </div>
  );
};

export default Emails;
