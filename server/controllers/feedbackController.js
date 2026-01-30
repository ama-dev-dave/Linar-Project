const pool = require("../config/database");

const feedbackController = {
  // POST /api/feedback - Submit customer feedback
  submitFeedback: async (req, res) => {
    try {
      const { customer_name, rating, comment } = req.body;

      const query = `
                INSERT INTO feedbacks (customer_name, rating, comment)
                VALUES ($1, $2, $3)
                RETURNING *
            `;
      const result = await pool.query(query, [customer_name, rating, comment]);

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      res.status(500).json({ error: "Failed to submit feedback" });
    }
  },

  // GET /api/feedback - Fetch all submitted feedback (Admin)
  getAllFeedback: async (req, res) => {
    try {
      const query = `
                SELECT * FROM feedbacks 
                ORDER BY created_at DESC
            `;
      const result = await pool.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      res.status(500).json({ error: "Failed to fetch feedback" });
    }
  },
};

module.exports = feedbackController;
