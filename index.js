const express = require("express");
const Product = require("./models/product");
const mongoose = require("mongoose");
const Cart = require("./models/cart");

const app = express();
const swaggerJSDoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

mongoose.connect("mongodb://localhost:27017/shopping", {
  useNewUrlParser: true,
});

app.use(express.json());
const option ={
  definition:{
    openapi:"3.0.0",
  info:{
    title:"Shopping",
    version:"1.0.0"
  },
  servers:[
    {
      url:"http://localhost:3000"
    }
  ]
  
  },
  apis :["./index.js"]
  

}
const swaggerSpec =swaggerJSDoc(option)
app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerSpec))

/**
 * @swagger
 * /:
 *  get:
 *      summary: This api used to check if get method is working
 *      description: This api used to check if get method is working
 *      responses:
 *        "200":
 *          description: To test Get method
 */
app.get("/", (req, res) => {
  res.json({
    message: "Hello!",
  });
});
/**
 * @swagger
 *  components:
 *    schemas:
 *      book:
 *          type: object
 *          properties:
 *            _id:
 *              type: string
 *            name:
 *              type: string
 *            author:
 *              type: string
 *            price:
 *              type: integer
 */




/**
 * @swagger
 * /products:
 *  get:
 *      summary: To get all products
 *      description: This api is used to fetch data from mongodb
 *      responses:
 *        "200":
 *          description: This api is used to fetch data from mongodb
 *          content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#components/schemas/book'
 */




// Product API's
app.get("/products", async (req, res) => {
  const products = await Product.find({});

  res.status(200).json({
    count: products.length,
    products,
  });
});


/**
 * @swagger
 * /product/create/{id}:
 *  post:
 *      summary: used to insert data to mongodb
 *      description: This api is used to fetch data from mongodb
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: id required
 *          schema: 
 *            type: string
 *      requestbody:
 *            required: true
 *            content:
 *              application/json:
 *                schema:
 *                   $ref: '#components/schemas/book'
 *      responses:
 *        "200":
 *          description: Product created successfully
 */

app.post("/product/create/:id", async (req, res) => {
  const { name, author, price } = req.body;

  const product = await Product.create({
    name,
    author,
    price,
  });

  res.status(201).json({
    message: "Product created successfully",
    product,
  });
});

/**
 * @swagger
 * /cart/create/{id}:
 *  get:
 *      summary: To send the products to cart
 *      description: This api is used to fetch data from mongodb
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: id required
 *          schema: 
 *            type: string
 *      responses:
 *        "201":
 *          description: This api is used to fetch data from mongodb
 *          content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#components/schemas/book'
 */

// Cart API's
app.get("/cart/create/:id", async (req, res) => {
  const cart = await Cart.create({});

  res.status(201).json({
    message: "Cart created successfully",
    cart,
  });
});

/**
 * @swagger
 * /cart/add:
 *  post:
 *      summary: used to insert data to mongodb
 *      description: This api is used to fetch data from mongodb
 *      requestbody:
 *            required: true
 *            content:
 *              application/json:
 *                schema:
 *                   $ref: '#components/schemas/book'
 *      responses:
 *        "200":
 *          description: Product added to cart successfully
 */

app.post("/cart/add", async (req, res) => {
  const { cartId, productId } = req.body;

  await Cart.findByIdAndUpdate(cartId, {
    $push: {
      products: productId,
    },
  });


  res.status(200).json({
    message: "Product added to cart successfully",
  });
});

/**
 * @swagger
 * /cart/remove:
 *  delete:
 *      summary: To delete products
 *      description: This api is used to fetch data from mongodb
 *      responses:
 *        "200":
 *          description: Data is deleted         
 */


app.delete("/cart/remove", async (req, res) => {
  const { cartId, productId } = req.body;

  await Cart.findByIdAndUpdate(cartId, {
    $pull: {
      products: productId,
    },
  });

  res.status(200).json({
    message: "Product removed from cart successfully",
  });
});

/**
 * @swagger
 * /cartitems:
 *  post:
 *      summary: used to see the items in the cart
 *      description: This api is used to fetch data from mongodb
 *      requestbody:
 *            required: true
 *            content:
 *              application/json:
 *                schema:
 *                   $ref: '#components/schemas/book'
 *      responses:
 *        "200":
 *          description: updated successfully
 */

app.post("/cartitems", async (req, res) => {
  const { cartId } = req.body;

  const cartItems = await Cart.findById(cartId);

  res.status(200).json({
    cartItems,
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
