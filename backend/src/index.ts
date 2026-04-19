import express, { Request, Response } from 'express';
import { z } from 'zod';
import {
    NewOrUpdatedShip,
    ResponseStructure,
    Ship,
    ShipSearchPayload,
    StApiResponse,
} from './types';
import { shipRepository } from './repo/ships.repository';

const app = express();
app.use(express.json());
const PORT = 8000;

const NewOrUpdatedShipSchema = z.object({
    shipName: z.string(),
    registry: z.string(),
    shipClass: z.string(),
});

const ShipSearchPayloadSchema = z.object({
    name: z.string(),
});

const searchStApi = async (searchTerms: ShipSearchPayload): Promise<Ship[]> => {
    const url = 'https://stapi.co/api/v2/rest/spacecraft/search';

    const body = new URLSearchParams(
        searchTerms as unknown as Record<string, string>,
    );

    const rawResponse = await fetch(url, {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
    });

    if (!rawResponse.ok) {
        throw new Error(`StApi HTTP error: ${rawResponse.status}`);
    }

    const response = (await rawResponse.json()) as StApiResponse;

    return response.spacecrafts.map(
        (spacecraft) =>
            ({
                shipName: spacecraft.name ?? 'unknown',
                registry: spacecraft.registry ?? 'unknown',
                shipClass: spacecraft.spacecraftClass?.name ?? 'unknown',
            }) as Ship,
    );
};

app.post(
    '/api/shipSearch',
    async (
        req: Request<{}, {}, ShipSearchPayload>,
        res: Response<ResponseStructure>,
    ) => {
        const parsed = ShipSearchPayloadSchema.safeParse(req.body);

        if (!parsed.success) {
            console.log('zod error:' + parsed.error);

            return res.status(400).json({
                data: null,
                error: 'invalid data',
            });
        }

        try {
            const result = await searchStApi(req.body);

            return res.status(200).json({
                data: result,
                error: null,
            });
        } catch (err) {
            console.log('shipSearch caught error:' + err);
            return res.status(500).json({
                data: null,
                error: 'internal error: ' + err,
            });
        }
    },
);

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

        if (!parsed.success) {
            console.log('zod error:' + parsed.error);

            return res.status(400).json({
                data: null,
                error: 'invalid data',
            });
        }

        try {
            const ship = shipRepository.create(req.body);

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
