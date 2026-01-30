const pool = require("../config/database");

const menuController = {
  // GET /api/menu - Fetch all menu items
  getAllMenuItems: async (req, res) => {
    try {
      const query = `
                SELECT m.*, c.name as category_name 
                FROM menu_items m
                LEFT JOIN categories c ON m.category_id = c.id
                ORDER BY c.name, m.name
            `;
      const result = await pool.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      res.status(500).json({ error: "Failed to fetch menu items" });
    }
  },

  // GET /api/menu/:id - Retrieve a single menu item by ID
  getMenuItemById: async (req, res) => {
    try {
      const { id } = req.params;
      const query = `
                SELECT m.*, c.name as category_name 
                FROM menu_items m
                LEFT JOIN categories c ON m.category_id = c.id
                WHERE m.id = $1
            `;
      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Menu item not found" });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error fetching menu item:", error);
      res.status(500).json({ error: "Failed to fetch menu item" });
    }
  },

  // GET /api/menu/category/:id - Fetch all menu items by category
  getMenuItemsByCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const query = `
                SELECT m.*, c.name as category_name 
                FROM menu_items m
                LEFT JOIN categories c ON m.category_id = c.id
                WHERE m.category_id = $1
                ORDER BY m.name
            `;
      const result = await pool.query(query, [id]);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching menu items by category:", error);
      res.status(500).json({ error: "Failed to fetch menu items" });
    }
  },

  // POST /api/menu - Add a new menu item (Admin)
  createMenuItem: async (req, res) => {
    try {
      const { category_id, name, description, price, image_url, is_available } =
        req.body;

      const query = `
                INSERT INTO menu_items (category_id, name, description, price, image_url, is_available)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
            `;
      const values = [
        category_id,
        name,
        description,
        price,
        image_url,
        is_available !== false,
      ];
      const result = await pool.query(query, values);

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error creating menu item:", error);
      res.status(500).json({ error: "Failed to create menu item" });
    }
  },

  // PUT /api/menu/:id - Update details of an existing menu item (Admin)
  updateMenuItem: async (req, res) => {
    try {
      const { id } = req.params;
      const { category_id, name, description, price, image_url, is_available } =
        req.body;

      const query = `
                UPDATE menu_items 
                SET category_id = $1, name = $2, description = $3, price = $4, 
                    image_url = $5, is_available = $6
                WHERE id = $7
                RETURNING *
            `;
      const values = [
        category_id,
        name,
        description,
        price,
        image_url,
        is_available,
        id,
      ];
      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Menu item not found" });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error updating menu item:", error);
      res.status(500).json({ error: "Failed to update menu item" });
    }
  },

  // DELETE /api/menu/:id - Delete a menu item (Admin)
  deleteMenuItem: async (req, res) => {
    try {
      const { id } = req.params;
      const query = "DELETE FROM menu_items WHERE id = $1 RETURNING id";
      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Menu item not found" });
      }

      res.json({
        message: "Menu item deleted successfully",
        id: result.rows[0].id,
      });
    } catch (error) {
      console.error("Error deleting menu item:", error);
      res.status(500).json({ error: "Failed to delete menu item" });
    }
  },
};

module.exports = menuController;
