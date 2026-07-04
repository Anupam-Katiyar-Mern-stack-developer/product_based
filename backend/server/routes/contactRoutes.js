const express=require("express");
const router = express.Router();
const {
  addContact,
  getContacts,
  getSingleContact,
  deleteContact,
} = require("../controllers/contactController");

router.post("/add", addContact);

router.get("/", getContacts);

router.get("/:id", getSingleContact);

router.delete("/delete/:id", deleteContact);

module.exports = router;
