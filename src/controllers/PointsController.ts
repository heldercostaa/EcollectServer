import { Request, Response, response } from 'express';
import knex from '../database/connection';

class PointsController {
  async show(req: Request, res: Response) {
    const { id } = req.params;

    const point = await knex('points').where('id', id).first();

    if (!point) return res.status(400).json({ message: 'Point not found' });

    return res.json(point);
  }

  async create(req: Request, res: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items
    } = req.body;
    
    const trx = await knex.transaction();
  
    const point = {
      image: 'image-fake',
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf
    };

    const insertedIds = await trx('points').insert(point);
  
    const point_id = insertedIds[0];
  
    const pointItems = items.map((item_id: number) => {
      return {
        point_id,
        item_id
      }
    });
  
    await trx('point_items').insert(pointItems);
  
    return res.json({
      id: point_id,
      ...point
    });
  }
};

export default new PointsController();