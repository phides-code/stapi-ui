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
import { formatLocalTimestamp } from './utils/time';

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
    registry: z.string(),
});

const searchStApi = async (searchTerms: ShipSearchPayload): Promise<Ship[]> => {
    const url = 'https://stapi.co/api/v2/rest/spacecraft/search?pageNumber=';
    console.log(
        `[${formatLocalTimestamp()}] Starting StAPI search for name="${searchTerms.name}" registry="${searchTerms.registry}"`,
    );

    const results: Ship[] = [];

    for (let i = 0; true; i++) {
        console.log(`[${formatLocalTimestamp()}] Fetching StAPI page ${i}`);

        const body = new URLSearchParams({
            ...searchTerms,
        });

        const rawResponse = await fetch(`${url}${i}`, {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body.toString(),
        });

        if (!rawResponse.ok) {
            console.error(
                `[${formatLocalTimestamp()}] StAPI request failed on page ${i}: HTTP ${rawResponse.status}`,
            );
            throw new Error(`StApi HTTP error: ${rawResponse.status}`);
        }

        const response = (await rawResponse.json()) as StApiResponse;

        results.push(
            ...response.spacecrafts.map(
                (spacecraft) =>
                    ({
                        shipName: spacecraft.name ?? 'unknown',
                        registry: spacecraft.registry ?? 'unknown',
                        shipClass:
                            spacecraft.spacecraftClass?.name ?? 'unknown',
                    }) as Ship,
            ),
        );

        if (response.page.lastPage) {
            console.log(
                `[${formatLocalTimestamp()}] Reached final StAPI page ${i}`,
            );
            break;
        }
    }

    console.log(
        `[${formatLocalTimestamp()}] Completed StAPI search with ${results.length} ships`,
    );

    return results;
};

app.post(
    '/api/shipSearch',
    async (
        req: Request<{}, {}, ShipSearchPayload>,
        res: Response<ResponseStructure>,
    ) => {
        console.log(
            `[${formatLocalTimestamp()}] POST /api/shipSearch request received`,
        );
        const parsed = ShipSearchPayloadSchema.safeParse(req.body);

        if (!parsed.success) {
            console.error(
                `[${formatLocalTimestamp()}] Validation error on /api/shipSearch:`,
                parsed.error.issues,
            );

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
            console.error(
                `[${formatLocalTimestamp()}] shipSearch failed:`,
                err,
            );
            return res.status(500).json({
                data: null,
                error: 'internal error: ' + err,
            });
        }
    },
);

app.get('/api/ships', (_: Request, res: Response<ResponseStructure>) => {
    console.log(`[${formatLocalTimestamp()}] GET /api/ships request received`);
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
        console.log(
            `[${formatLocalTimestamp()}] POST /api/ships request received`,
        );
        const parsed = NewOrUpdatedShipSchema.safeParse(req.body);

        if (!parsed.success) {
            console.error(
                `[${formatLocalTimestamp()}] Validation error on /api/ships:`,
                parsed.error.issues,
            );

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
            console.error(
                `[${formatLocalTimestamp()}] Failed to create ship:`,
                err,
            );

            return res
                .status(500)
                .json({ data: null, error: 'something went wrong' });
        }
    },
);

app.listen(PORT, () => {
    console.log(
        `[${formatLocalTimestamp()}] Server running at http://localhost:${PORT}`,
    );
});
