import mongoose from "mongoose";
import { NoteModel } from "../../db/models/Note.model.js";
import { UserModel } from "../../db/models/User.Model.js";
import { paginate } from "../../utils/paginate.js";
export const createNote = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { title, content } = req.body;
    const note = await NoteModel.create([{ title, content, userId }]);
    return res.status(201).json({ message: "Done", data: note });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
      info: error.message,
    });
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const { userId } = req.user;
    const { title, content } = req.body;
    const updatedFields = {};
    if (title) {
      updatedFields.title = title;
    }
    if (content) {
      updatedFields.content = content;
    }
    const checkNote = await NoteModel.findById(noteId);
    if (!checkNote) {
      return res.status(404).json({ message: "in-valid note id" });
    }
    if (checkNote.userId.toString() !== userId) {
      return res.status(401).json({ message: "not authorized to update note" });
    }
    const note = await NoteModel.findByIdAndUpdate(noteId, { ...updatedFields, $inc: { __v: 1 } }, { new: true });
    return res.json({ message: "Done", data: note });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
      info: error.message,
    });
  }
};

export const replaceNote = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { title, content, userId: newUserId } = req.body;
    const { noteId } = req.params;
    const checkNote = await NoteModel.findById(noteId);
    if (!checkNote) {
      return res.status(404).json({ message: "in-valid note id" });
    }
    if (checkNote.userId.toString() !== userId) {
      return res.status(401).json({ message: "not authorized to update note" });
    }
    const checkUser = await UserModel.findById(newUserId);
    if (!checkUser) {
      return res.status(404).json({ message: "in-valid User Id" });
    }
    const note = await NoteModel.findOneAndReplace(noteId, { title, content, userId: newUserId }, { new: true });
    if (note == null) {
      return res.status(404).json({ message: "in-valid note Id" });
    }
    return res.json({ message: "note replaced successfully", data: note });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
      info: error.message,
    });
  }
};

export const updateAllNotes = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { title } = req.body;
    await NoteModel.updateMany({ userId }, { $set: { title } });
    return res.json({ message: "All your notes are updated" });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
      info: error.message,
    });
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { noteId } = req.params;
    const note = await NoteModel.findById(noteId);
    if (!note) {
      return res.json({ message: "in-valid note id" });
    }
    if (note.userId.toString() !== userId) {
      return res.status(401).json({ message: "you cant do this action" });
    }
    const result = await NoteModel.findByIdAndDelete(noteId);
    return res.json({ message: "note deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
      info: error.message,
    });
  }
};

export const listMyNotes = async (req, res, next) => {
  try {
    const { currentPage, limit, offset } = paginate(req.query);
    const { userId } = req.user;
    const totalNotes = await NoteModel.countDocuments({ userId });
    const myNotes = await NoteModel.find({ userId }).skip(offset).limit(limit).sort({ createdAt: -1 });

    const totalPages = Math.ceil(totalNotes / limit);

    return res.status(200).json({
      message: "Success",
      data: {
        currentPage,
        totalPages,
        totalNotes,
        notes: myNotes,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
      info: error.message,
    });
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { noteId } = req.params;
    const note = await NoteModel.findById(noteId);
    if (!note) {
      return res.json({ message: "in-valid note id" });
    }
    if (note.userId.toString() !== userId) {
      return res.status(401).json({ message: "you are not the owner" });
    }

    return res.json({ message: "Success", data: note });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
      info: error.message,
    });
  }
};

export const getNoteByContent = async (req, res, next) => {
  try {
    const content = req.query.content || ".";
    const { userId } = req.user;
    const notes = await NoteModel.find({ userId, content: { $regex: content, $options: "i" } });
    return res.json({ message: "Success", data: notes });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
      info: error.message,
    });
  }
};

export const getDetailsWithNote = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const notes = await NoteModel.find({ userId })
      .select(["title", "createdAt", "userId"])
      .populate([{ path: "userId", select: ["email", "-_id"] }]);
    return res.json({ message: "Success", data: notes });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
      info: error.message,
    });
  }
};

export const deleteAllUserNotes = async (req, res, next) => {
  try {
    const { userId } = req.user;
    await NoteModel.deleteMany({ userId });
    return res.json({ message: "deleted all successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
      info: error.message,
    });
  }
};

export const getNotesUsingAggregation = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const title = req.query.title || ".";
    const notes = await NoteModel.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId.createFromHexString(userId),
          title: {
            $regex: title,
            $options: "i",
          },
        },
      },
      {
        $lookup: {
          localField: "userId",
          foreignField: "_id",
          from: "users",
          as: "user",
        },
      },
      {
        $project: {
          _id: 0,
          title: 1,
          userId: 1,
          createdAt: 1,
          "user.name": 1,
          "user.email": 1,
        },
      },
    ]);
    return res.json({ message: "Success", data: notes });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
      info: error.message,
    });
  }
};
