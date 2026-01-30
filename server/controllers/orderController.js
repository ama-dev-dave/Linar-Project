const pool = require("../config/database");

const orderController = {
  // POST /api/orders - Create a new customer order
  createOrder: async (req, res) => {
    const client = await pool.connect();

    try {
      const { customer_name, customer_phone, total_price, items } = req.body;

      await client.query("BEGIN");

      // Insert order
      const orderQuery = `
                INSERT INTO orders (customer_name, customer_phone, total_price)
                VALUES ($1, $2, $3)
                RETURNING id
            `;
      const orderResult = await client.query(orderQuery, [
        customer_name,
        customer_phone,
        total_price,
      ]);
      const orderId = orderResult.rows[0].id;

      // Insert order items
      for (const item of items) {
        const itemQuery = `
                    INSERT INTO order_items (order_id, menu_item_id, quantity, price)
                    VALUES ($1, $2, $3, $4)
                `;
        await client.query(itemQuery, [
          orderId,
          item.menu_item_id,
          item.quantity,
          item.price,
        ]);
      }

      await client.query("COMMIT");

      res.status(201).json({
        message: "Order created successfully",
        order_id: orderId,
      });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Failed to create order" });
    } finally {
      client.release();
    }
  },

  // GET /api/orders - Get all orders (Admin)
  getAllOrders: async (req, res) => {
    try {
      // Get all orders
      const ordersQuery = `
                SELECT * FROM orders 
                ORDER BY created_at DESC
            `;
      const ordersResult = await pool.query(ordersQuery);
      const orders = ordersResult.rows;

      // Get items for each order
      for (let order of orders) {
        const itemsQuery = `
                    SELECT oi.*, m.name as item_name
                    FROM order_items oi
                    LEFT JOIN menu_items m ON oi.menu_item_id = m.id
                    WHERE oi.order_id = $1
                `;
        const itemsResult = await pool.query(itemsQuery, [order.id]);
        order.items = itemsResult.rows;
      }

      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  },

  // GET /api/orders/:id - Retrieve details of a specific order (Admin)
  getOrderById: async (req, res) => {
    try {
      const { id } = req.params;

      // Get order details
      const orderQuery = `
                SELECT * FROM orders WHERE id = $1
            `;
      const orderResult = await pool.query(orderQuery, [id]);

      if (orderResult.rows.length === 0) {
        return res.status(404).json({ error: "Order not found" });
      }

      const order = orderResult.rows[0];

      // Get order items
      const itemsQuery = `
                SELECT oi.*, m.name as item_name
                FROM order_items oi
                LEFT JOIN menu_items m ON oi.menu_item_id = m.id
                WHERE oi.order_id = $1
            `;
      const itemsResult = await pool.query(itemsQuery, [id]);

      order.items = itemsResult.rows;

      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  },
};

module.exports = orderController;
