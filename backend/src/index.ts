import express, { Request, Response } from 'express';
import { z } from 'zod';
import { NewOrUpdatedShip, ResponseStructure, Ship } from './types';
import { shipRepository } from './repo/ships.repository';

const app = express();
app.use(express.json());
const PORT = 8000;

const NewOrUpdatedShipSchema = z.object({
    shipName: z.string(),
});

app.get('/api/ships', (_: Request, res: Response<ResponseStructure>) => {
    const ships = shipRepository.getAll();

    res.status(200).json({
        data: ships,
        error: null,
    });
});

app.post(
    '/api/ships',
    (
        req: Request<{}, {}, NewOrUpdatedShip>,
        res: Response<ResponseStructure>,
    ) => {
        const parsed = NewOrUpdatedShipSchema.safeParse(req.body);

        const { shipName } = req.body;

        if (!parsed.success) {
            console.log('zod error:' + parsed.error);

            return res.status(400).json({
                data: null,
                error: 'invalid data',
            });
        }

        try {
            const ship = shipRepository.create({ shipName });

            res.status(200).json({
                data: ship,
                error: null,
            });
        } catch (err) {
            console.log('error: ' + err);

            return res
                .status(500)
                .json({ data: null, error: 'something went wrong' });
        }
    },
);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
