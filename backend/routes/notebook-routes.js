const express = require("express");
const router = express.Router();
const notebookController = require("../controller/notebook-controller");
const authenticateToken = require("../functions/authenticateToken.js");

// /api/notebook
router.route("/").post(authenticateToken, notebookController.createNotebook);

// /api/notebook/author
router
  .route("/author")
  .get(authenticateToken, notebookController.getNotebookByAuthorEmail);

// /api/notebook/shared
router
  .route("/shared")
  .get(authenticateToken, notebookController.getNotebookBySharedWithEmail);

// /api/notebook/shared/:id
router
  .route("/shared/:id")
  .patch(authenticateToken, notebookController.shareNotebook);

// /api/notebook/recent
router
  .route("/recent")
  .get(authenticateToken, notebookController.getNotebookByLastOpened);

// /api/notebook/clone/:notebookId
router
  .route("/clone/:notebookId")
  .post(authenticateToken, notebookController.cloneNotebook);

// /api/notebook/:id
router
  .route("/:id")
  .get(authenticateToken, notebookController.getNotebookByNotebookId);

// /api/notebook/:id
router
  .route("/:id")
  .patch(authenticateToken, notebookController.updateNotebook);

// /api/notebook/:id
router
  .route("/:id")
  .delete(authenticateToken, notebookController.deleteNotebook);

module.exports = router;
