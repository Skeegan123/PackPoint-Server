const { json } = require("body-parser");

const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "api",
  password: "password",
  port: 5432,
});

const createUser = (request, response) => {
  const { email } = request.body;

  pool.query(
    "INSERT INTO users (email) VALUES ($1) RETURNING *",
    [email],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`User added with ID: ${results.rows[0].id}`);
    }
  );
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const updateUserPost = (request, response) => {
  const id = parseInt(request.params.id);
  const { postID } = request.body;

  pool.query(
    "UPDATE users SET posts = array_append(posts, $1) WHERE id = $2",
    [postID, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User modified with ID: ${id}`);
    }
  );
};

const updateUserLike = (request, response) => {
  const id = parseInt(request.params.id);
  const { postID } = request.body;

  pool.query(
    "UPDATE users SET likes = array_append(likes, $1) WHERE id = $2",
    [postID, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User modified with ID: ${id}`);
    }
  );
};

const createPost = (jsonFile) => {
  readFile = JSON.parse(jsonFile, null, 2);
  // console.log("" + jsonFile);
  const {
    userID,
    coordinates,
    description,
    noise,
    crowd,
    idreq,
    wifi,
    amenities,
    tags,
    title,
  } = readFile;

  pool.query(
    "INSERT INTO posts ( userID, coordinates, description, noise, crowd, idreq, wifi, amenities, tags, title) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
    [
      userID,
      coordinates,
      description,
      noise,
      crowd,
      idreq,
      wifi,
      amenities,
      tags,
      title,
    ],
    (error, results) => {
      if (error) {
        console.error(error);
        throw error;
      }
      //   response.status(201).send(`Post added with ID: ${results.rows[0].id}`)
    }
  );
};

function getPosts() {
  pool.query("SELECT * FROM posts ORDER BY postID ASC;", (error, results) => {
    if (error) {
      throw error;
    }
    //   response.status(200).json(results.rows)
    return results.rows;
  });
}

module.exports = {
  getUserById,
  createUser,
  updateUserPost,
  updateUserLike,
  createPost,
  getPosts,
};
