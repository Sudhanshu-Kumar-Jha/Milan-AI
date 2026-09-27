import { Request, Response } from 'express';
import { City } from '../models/City';

const DEFAULT_CITIES = [
  'Bengaluru',
  'Mumbai',
  'Delhi NCR',
  'Pune',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
  'Chandigarh',
  'Jaipur',
];

// Helper: Seed default cities if table empty
async function ensureCitiesSeeded() {
  const count = await City.countDocuments();
  if (count === 0) {
    const docs = DEFAULT_CITIES.map((name, index) => ({
      name,
      isActive: true,
      order: index + 1,
    }));
    await City.insertMany(docs);
  }
}

export const configController = {
  // GET /api/config/cities - List all operational cities
  async getCities(_req: Request, res: Response) {
    try {
      await ensureCitiesSeeded();
      const cities = await City.find({ isActive: true }).sort({ order: 1, name: 1 });
      const cityNames = cities.map((c) => c.name);

      res.json({
        success: true,
        data: cityNames,
        meta: {
          total: cityNames.length,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.json({
        success: true,
        data: DEFAULT_CITIES,
        meta: { total: DEFAULT_CITIES.length, fallback: true },
        timestamp: new Date().toISOString(),
      });
    }
  },

  // POST /api/config/cities - Add or modify a city
  async addOrUpdateCity(req: Request, res: Response) {
    try {
      const { name, state } = req.body;
      if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: 'City name is required' });
      }

      const trimmedName = name.trim();
      const existing = await City.findOne({ name: { $regex: new RegExp(`^${trimmedName}$`, 'i') } });

      if (existing) {
        existing.isActive = true;
        if (state) existing.state = state;
        await existing.save();
        return res.json({ success: true, data: existing, message: `City '${trimmedName}' updated` });
      }

      const count = await City.countDocuments();
      const newCity = await City.create({
        name: trimmedName,
        state: state || '',
        isActive: true,
        order: count + 1,
      });

      res.json({
        success: true,
        data: newCity,
        message: `City '${trimmedName}' created successfully`,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // DELETE /api/config/cities/:name - Deactivate/Delete city
  async deleteCity(req: Request, res: Response) {
    try {
      const { name } = req.params;
      await City.findOneAndDelete({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

      res.json({
        success: true,
        message: `City '${name}' removed successfully`,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};
