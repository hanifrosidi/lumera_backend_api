import express from "express";
import DatabaseError from "../error/DatabaseError.js";
import AuthError from "../error/AuthError.js";
import ClientError from "../error/ClientError.js";
import ValidationError from "../error/ValidationError.js";
import {
  body,
  validationResult,
} from "express-validator";

import { GoogleGenAI } from "@google/genai";

const chatbotRouter = express.Router();

chatbotRouter.post(
  "/",
  [
    body("question")
      .notEmpty()
      .withMessage("Tidak ada pertanyaan"),
  ],
  async function (req, res) {
    try {
      const error = validationResult(req);

      if (!error.isEmpty()) {
        throw new ValidationError(
          error.errors[0].msg
        );
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
      });

      const response =
        await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: req.body.question,
        });

      res.send(response.text);
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({
          status: "fail",
          message: err.message,
        });
      } else if (err instanceof ClientError) {
        return res.status(404).json({
          status: "fail",
          message: err.message,
        });
      } else if (err instanceof AuthError) {
        return res.status(401).json({
          status: "fail",
          message: err.message,
        });
      } else if (err instanceof DatabaseError) {
        return res.status(503).json({
          status: "fail",
          message: err.message,
        });
      } else {
        return res.status(500).json({
          status: "fail",
          message: err.message,
        });
      }
    }
  }
);

export default chatbotRouter;
