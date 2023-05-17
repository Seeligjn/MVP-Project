import express from "express";
import pg from "pg";
import dotenv from "dotenv";

const server = express();
const PORT = 4000;

dotenv.config();

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

//get request to return all contacts
server.use(express.static("public"));
server.get("/api/contacts", (req, res) => {
  db.query("SELECT * FROM contacts ORDER BY first_name", []).then((error,result) => {
    if (error) {
      throw error;
    }
    res.send(result.rows);
  });
});
//get contact by id
server.get("/api/contacts/:id", (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.sendStatus(422);
    return;
  }
  db.query("SELECT * FROM contacts WHERE id = $1", [id]).then((result) => {
    if (result.rows.length === 0) {
      res.sendStatus(404);
    } else {
      res.send(result.rows[0]);
    }
  });
});

//create a new contact using post request
server.use(express.json());
server.post("/api/contacts", (req, res) => {
  const { first_name, last_name, phone_number, address } = req.body;
  if (phone_number && phone_number.length > 10) {
    res.status(422).send("Please choose enter a valid Phone Number.");
    return;
  }

  if (!first_name && !last_name && !phone_number && !address) {
    res.status(422).send("Please provide values for at least one field.");
    return;
  }

  db.query(
    "INSERT INTO contacts (first_name , last_name , phone_number , address) VALUES ($1,$2,$3,$4) RETURNING *",
    [first_name, last_name, phone_number, address]
  ).then((result) => {
    res.send(result.rows);
  });
});

//
server.patch("/api/contacts/:id", (req, res) => {
  const id = Number(req.params.id);
  const { first_name, last_name, phone_number, address } = req.body;
  if (Number.isNaN(id)) {
    res.sendStatus(422);
    return;
  }
  db.query(
    "UPDATE contacts SET first_name = COALESCE($1, first_name), last_name = COALESCE($2, last_name), phone_number = COALESCE($3, phone_number) , address = COALESCE($4 , address) WHERE id = $5 RETURNING *",
    [first_name, last_name, phone_number, address, id]
  ).then((result) => {
    if (result.rows.length === 0) {
      res.sendStatus(404);
    } else {
      res.send(result.rows[0]);
    }
  });
});

server.delete("/api/contacts/:id", (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.sendStatus(422);
    return;
  }
  db.query("DELETE FROM contacts WHERE id = $1 RETURNING *", [id]).then(
    (result) => {
      if (result.rows.length === 0) {
        res.sendStatus(404);
      } else {
        res.send(result.rows[0]);
      }
    }
  );
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
