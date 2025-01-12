import express, { Request, Response } from "express";
import { ResourceModel } from "../models/ResourceModel";

const router = express.Router();

// Define types for the filters in query params
interface ResourceFilters {
  name?: string;
  description?: string;
}

// Create resource
router.post("/", (req: Request, res: Response) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: "Name and description are required" });
  }

  const newResource = { name, description };
  ResourceModel.create(newResource, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error creating resource", error: err });
    }
    res.status(201).json({ message: "Resource created", resourceId: result.lastID });
  });
});

// Get all resources with filters
router.get("/", (req: Request<{}, {}, {}, ResourceFilters>, res: Response) => {
  const { name, description } = req.query;

  // Ensure filters are strings or undefined
  const filters: ResourceFilters = {
    name: name ? (name as string) : undefined,
    description: description ? (description as string) : undefined,
  };

  ResourceModel.getAll(filters, (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching resources", error: err });
    }
    res.json(rows);
  });
});

// Get resource by ID
router.get("/:id", (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  const resourceId = parseInt(id);
  if (isNaN(resourceId)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  ResourceModel.getById(resourceId, (err, row) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching resource", error: err });
    }
    if (!row) {
      return res.status(404).json({ message: "Resource not found" });
    }
    res.json(row);
  });
});

// Update resource by ID
router.put("/:id", (req: Request<{ id: string }, {}, { name: string; description: string }>, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const resourceId = parseInt(id);
  if (isNaN(resourceId)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  if (!name || !description) {
    return res.status(400).json({ message: "Name and description are required" });
  }

  const updatedResource = { name, description };
  ResourceModel.update(resourceId, updatedResource, (err) => {
    if (err) {
      return res.status(500).json({ message: "Error updating resource", error: err });
    }
    res.json({ message: "Resource updated" });
  });
});

// Delete resource by ID
router.delete("/:id", (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  const resourceId = parseInt(id);
  if (isNaN(resourceId)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  ResourceModel.delete(resourceId, (err) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting resource", error: err });
   
