import express from "express";
import { addBooks, issueBook, returnBook, updateBookStatus, getActiveIssues, searchBookByName } from "./library.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/addBooks",
  protect,
  allowRoles("librarian", "admin"),
  addBooks
);

router.post(
  "/issue",
  protect,
  allowRoles("librarian", "admin"),
  issueBook
);

router.post(
  "/return",
  protect,
  allowRoles("librarian", "admin"),
  returnBook
);

router.post(
  "/updateBookStatus",
  protect,
  allowRoles("librarian", "admin"),
  updateBookStatus
);

router.get(
  "/issues/active",
  protect,
  allowRoles("librarian", "admin"),
  getActiveIssues
);

router.get(
  "/search",
  protect,
  allowRoles("librarian", "admin"),
  searchBookByName
);





export default router;
