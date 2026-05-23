import { Request, Response } from "express";
import prisma from "../prismaClient";

// GET /api/speakers - Ambil semua pembicara
export const getAllSpeakers = async (req: Request, res: Response) => {
  try {
    const speakers = await prisma.pembicara.findMany({
      include: { events: true },
      orderBy: { id: "asc" },
    });
    res.json({ success: true, data: speakers });
  } catch (error) {
    console.error("getAllSpeakers error:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil data pembicara" });
  }
};

// GET /api/speakers/:id - Ambil satu pembicara
export const getSpeakerById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "ID tidak valid" });
    }
    const speaker = await prisma.pembicara.findUnique({
      where: { id },
      include: { events: true },
    });
    if (!speaker) {
      return res.status(404).json({ success: false, message: "Pembicara tidak ditemukan" });
    }
    res.json({ success: true, data: speaker });
  } catch (error) {
    console.error("getSpeakerById error:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil data pembicara" });
  }
};

// POST /api/speakers - Tambah pembicara baru
export const createSpeaker = async (req: Request, res: Response) => {
  try {
    const { name, expertise, bio } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ success: false, message: "Nama pembicara wajib diisi" });
    }
    if (!expertise || expertise.trim() === "") {
      return res.status(400).json({ success: false, message: "Keahlian pembicara wajib diisi" });
    }
    if (!bio || bio.trim() === "") {
      return res.status(400).json({ success: false, message: "Bio pembicara wajib diisi" });
    }
    const speaker = await prisma.pembicara.create({
      data: {
        name: name.trim(),
        expertise: expertise.trim(),
        bio: bio.trim(),
      },
    });
    res.status(201).json({ success: true, data: speaker, message: "Pembicara berhasil ditambahkan" });
  } catch (error) {
    console.error("createSpeaker error:", error);
    res.status(500).json({ success: false, message: "Gagal menambahkan pembicara" });
  }
};

// PUT /api/speakers/:id - Update pembicara
export const updateSpeaker = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "ID tidak valid" });
    }
    const { name, expertise, bio } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ success: false, message: "Nama pembicara wajib diisi" });
    }
    if (!expertise || expertise.trim() === "") {
      return res.status(400).json({ success: false, message: "Keahlian pembicara wajib diisi" });
    }
    if (!bio || bio.trim() === "") {
      return res.status(400).json({ success: false, message: "Bio pembicara wajib diisi" });
    }
    const existing = await prisma.pembicara.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Pembicara tidak ditemukan" });
    }
    const speaker = await prisma.pembicara.update({
      where: { id },
      data: {
        name: name.trim(),
        expertise: expertise.trim(),
        bio: bio.trim(),
      },
    });
    res.json({ success: true, data: speaker, message: "Pembicara berhasil diupdate" });
  } catch (error) {
    console.error("updateSpeaker error:", error);
    res.status(500).json({ success: false, message: "Gagal mengupdate pembicara" });
  }
};

// DELETE /api/speakers/:id - Hapus pembicara
export const deleteSpeaker = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "ID tidak valid" });
    }
    const existing = await prisma.pembicara.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Pembicara tidak ditemukan" });
    }
    await prisma.pembicara.delete({ where: { id } });
    res.json({ success: true, message: "Pembicara berhasil dihapus" });
  } catch (error) {
    console.error("deleteSpeaker error:", error);
    res.status(500).json({ success: false, message: "Gagal menghapus pembicara" });
  }
};
