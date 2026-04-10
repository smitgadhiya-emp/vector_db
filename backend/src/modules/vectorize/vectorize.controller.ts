import { NextFunction, Request, Response } from "express";
import { sendError, sendSuccess } from "../../utils/response.util";
import { PDF_QUEUE_NAME, publishToQueue } from "../../config/rabbitMQ";
import { findPdfQueryResults } from "./vectorize.service";

export const createPdfEmbeddingController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pdfBuffer = req.file?.buffer;

        if (!pdfBuffer || !req.file) {
            return sendError(res, "PDF file is required", 400);
        }

        if (req.file.mimetype !== "application/pdf") {
            return sendError(res, "Only PDF files are supported", 400);
        }

        await publishToQueue(PDF_QUEUE_NAME, pdfBuffer);

        return sendSuccess(res, { message: "Pdf embedding started successfully" });

    } catch (error) {
        sendError(res, error as Error || 'Internal Server Error', 500);
    }

}

export const getQueryPdf = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { query, documentId } = req.query;
        if (typeof query !== "string") {
            return sendError(res, "Query parameter is required and must be a string", 400);
        }

        const queryResult = await findPdfQueryResults(
            query,
            typeof documentId === "string" ? documentId : undefined,
        );

        return sendSuccess(res, { message: "PDF query results found", data: queryResult });
    } catch (error) {
        console.error("Error in getQueryPdf:", error);
        sendError(res, error as Error || "Internal Server Error", 500);
    }
};