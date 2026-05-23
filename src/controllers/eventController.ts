import { Request, Response } from "express";
import prisma from "../prismaClient";

// GET /api/events - Ambil semua event
export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        category: true,
        pembicara: true,
      },
      orderBy: { date: "asc" },
    });
    res.json({ success: true, data: events });
  } catch (error) {
    console.error("getAllEvents error:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil data event" });
  }
};

// GET /api/events/:id - Ambil satu event
export const getEventById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "ID tidak valid" });
    }
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        category: true,
        pembicara: true,
      },
    });
    if (!event) {
      return res.status(404).json({ success: false, message: "Event tidak ditemukan" });
    }
    res.json({ success: true, data: event });
  } catch (error) {
    console.error("getEventById error:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil data event" });
  }
};

// POST /api/events - Tambah event baru
export const createEvent = async (req: Request, res: Response) => {
  try {
    const { title, description, date, location, categoryId, pembicaraId } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ success: false, message: "Judul event wajib diisi" });
    }
    if (!description || description.trim() === "") {
      return res.status(400).json({ success: false, message: "Deskripsi event wajib diisi" });
    }
    if (!date) {
      return res.status(400).json({ success: false, message: "Tanggal event wajib diisi" });
    }
    if (!location || location.trim() === "") {
      return res.status(400).json({ success: false, message: "Lokasi event wajib diisi" });
    }
    if (!categoryId) {
      return res.status(400).json({ success: false, message: "Kategori event wajib dipilih" });
    }
    if (!pembicaraId) {
      return res.status(400).json({ success: false, message: "Pembicara event wajib dipilih" });
    }

    const catId = parseInt(categoryId);
    const spkId = parseInt(pembicaraId);

    const categoryExists = await prisma.categoryEvent.findUnique({ where: { id: catId } });
    if (!categoryExists) {
      return res.status(400).json({ success: false, message: "Kategori tidak ditemukan" });
    }

    const speakerExists = await prisma.pembicara.findUnique({ where: { id: spkId } });
    if (!speakerExists) {
      return res.status(400).json({ success: false, message: "Pembicara tidak ditemukan" });
    }

    const event = await prisma.event.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        date: new Date(date),
        location: location.trim(),
        categoryId: catId,
        pembicaraId: spkId,
      },
      include: {
        category: true,
        pembicara: true,
      },
    });

    res.status(201).json({ success: true, data: event, message: "Event berhasil ditambahkan" });
  } catch (error) {
    console.error("createEvent error:", error);
    res.status(500).json({ success: false, message: "Gagal menambahkan event" });
  }
};

// PUT /api/events/:id - Update event
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "ID tidak valid" });
    }

    const { title, description, date, location, categoryId, pembicaraId } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ success: false, message: "Judul event wajib diisi" });
    }
    if (!description || description.trim() === "") {
      return res.status(400).json({ success: false, message: "Deskripsi event wajib diisi" });
    }
    if (!date) {
      return res.status(400).json({ success: false, message: "Tanggal event wajib diisi" });
    }
    if (!location || location.trim() === "") {
      return res.status(400).json({ success: false, message: "Lokasi event wajib diisi" });
    }
    if (!categoryId) {
      return res.status(400).json({ success: false, message: "Kategori event wajib dipilih" });
    }
    if (!pembicaraId) {
      return res.status(400).json({ success: false, message: "Pembicara event wajib dipilih" });
    }

    const catId = parseInt(categoryId);
    const spkId = parseInt(pembicaraId);

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Event tidak ditemukan" });
    }

    const categoryExists = await prisma.categoryEvent.findUnique({ where: { id: catId } });
    if (!categoryExists) {
      return res.status(400).json({ success: false, message: "Kategori tidak ditemukan" });
    }

    const speakerExists = await prisma.pembicara.findUnique({ where: { id: spkId } });
    if (!speakerExists) {
      return res.status(400).json({ success: false, message: "Pembicara tidak ditemukan" });
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        title: title.trim(),
        description: description.trim(),
        date: new Date(date),
        location: location.trim(),
        categoryId: catId,
        pembicaraId: spkId,
      },
      include: {
        category: true,
        pembicara: true,
      },
    });

    res.json({ success: true, data: event, message: "Event berhasil diupdate" });
  } catch (error) {
    console.error("updateEvent error:", error);
    res.status(500).json({ success: false, message: "Gagal mengupdate event" });
  }
};

// DELETE /api/events/:id - Hapus event
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "ID tidak valid" });
    }
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Event tidak ditemukan" });
    }
    await prisma.event.delete({ where: { id } });
    res.json({ success: true, message: "Event berhasil dihapus" });
  } catch (error) {
    console.error("deleteEvent error:", error);
    res.status(500).json({ success: false, message: "Gagal menghapus event" });
  }
};
