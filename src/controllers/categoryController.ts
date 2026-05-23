import { Request, Response } from "express";
import prisma from "../prismaClient";

// GET /api/categories - Ambil semua kategori
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.categoryEvent.findMany({
      include: { events: true },
      orderBy: { id: "asc" },
    });
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error("getAllCategories error:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil data kategori" });
  }
};

// GET /api/categories/:id - Ambil satu kategori
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "ID tidak valid" });
    }
    const category = await prisma.categoryEvent.findUnique({
      where: { id },
      include: { events: true },
    });
    if (!category) {
      return res.status(404).json({ success: false, message: "Kategori tidak ditemukan" });
    }
    res.json({ success: true, data: category });
  } catch (error) {
    console.error("getCategoryById error:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil data kategori" });
  }
};

// POST /api/categories - Tambah kategori baru
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ success: false, message: "Nama kategori wajib diisi" });
    }
    const existing = await prisma.categoryEvent.findUnique({
      where: { name: name.trim() },
    });
    if (existing) {
      return res.status(409).json({ success: false, message: "Nama kategori sudah ada" });
    }
    const category = await prisma.categoryEvent.create({
      data: { name: name.trim() },
    });
    res.status(201).json({ success: true, data: category, message: "Kategori berhasil ditambahkan" });
  } catch (error) {
    console.error("createCategory error:", error);
    res.status(500).json({ success: false, message: "Gagal menambahkan kategori" });
  }
};

// PUT /api/categories/:id - Update kategori
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "ID tidak valid" });
    }
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ success: false, message: "Nama kategori wajib diisi" });
    }
    const existing = await prisma.categoryEvent.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Kategori tidak ditemukan" });
    }
    const duplicate = await prisma.categoryEvent.findFirst({
      where: { name: name.trim(), NOT: { id } },
    });
    if (duplicate) {
      return res.status(409).json({ success: false, message: "Nama kategori sudah digunakan" });
    }
    const category = await prisma.categoryEvent.update({
      where: { id },
      data: { name: name.trim() },
    });
    res.json({ success: true, data: category, message: "Kategori berhasil diupdate" });
  } catch (error) {
    console.error("updateCategory error:", error);
    res.status(500).json({ success: false, message: "Gagal mengupdate kategori" });
  }
};

// DELETE /api/categories/:id - Hapus kategori
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "ID tidak valid" });
    }
    const existing = await prisma.categoryEvent.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Kategori tidak ditemukan" });
    }
    await prisma.categoryEvent.delete({ where: { id } });
    res.json({ success: true, message: "Kategori berhasil dihapus" });
  } catch (error) {
    console.error("deleteCategory error:", error);
    res.status(500).json({ success: false, message: "Gagal menghapus kategori" });
  }
};
