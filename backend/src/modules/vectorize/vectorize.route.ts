import { Router } from "express";
import multer from "multer";
import { createPdfEmbeddingController, getQueryPdf } from "./vectorize.controller";

const router = Router();
const upload = multer();

router.post('/pdf', upload.single("pdf"), createPdfEmbeddingController);
router.get('/query', getQueryPdf);

export default router;