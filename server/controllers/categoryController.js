const pool = require("../config/database");

const categoryController = {
  // GET /api/categories - Fetch all categories
  getAllCategories: async (req, res) => {
    try {
      const query = "SELECT * FROM categories ORDER BY name";
      const result = await pool.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  },

  // POST /api/categories - Create a new category
  createCategory: async (req, res) => {
    try {
      const { name } = req.body;

      const query = "INSERT INTO categories (name) VALUES ($1) RETURNING *";
      const result = await pool.query(query, [name]);

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error creating category:", error);
      if (error.code === "23505") {
        // Unique violation
        res.status(400).json({ error: "Category name already exists" });
      } else {
        res.status(500).json({ error: "Failed to create category" });
      }
    }
  },

  // PUT /api/categories/:id - Update a category
  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const query = "UPDATE categories SET name = $1 WHERE id = $2 RETURNING *";
      const result = await pool.query(query, [name, id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Category not found" });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error updating category:", error);
      if (error.code === "23505") {
        res.status(400).json({ error: "Category name already exists" });
      } else {
        res.status(500).json({ error: "Failed to update category" });
      }
    }
  },

  // DELETE /api/categories/:id - Delete a category
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const query = "DELETE FROM categories WHERE id = $1 RETURNING id";
      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Category not found" });
      }

      res.json({
        message: "Category deleted successfully",
        id: result.rows[0].id,
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ error: "Failed to delete category" });
    }
  },
};

module.exports = categoryController;
