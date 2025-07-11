import { Router } from "express";
import * as noteService from "./note.service.js";
import { verifyToken } from "../../utils/verifyToken.js";

const router = Router();
router.post("/", verifyToken, noteService.createNote);
router.put("/replace/:noteId", verifyToken, noteService.replaceNote);
router.patch("/all", verifyToken, noteService.updateAllNotes);
router.get("/paginate-sort", verifyToken, noteService.listMyNotes);
router.get("/note-with-user", verifyToken, noteService.getDetailsWithNote);
router.get("/note-by-content", verifyToken, noteService.getNoteByContent);
router.get("/aggregate", verifyToken, noteService.getNotesUsingAggregation);
router.get("/:noteId", verifyToken, noteService.getNoteById);
router.patch("/:noteId", verifyToken, noteService.updateNote);
router.delete("/", verifyToken, noteService.deleteAllUserNotes);
router.delete("/:noteId", verifyToken, noteService.deleteNote);
export default router;
