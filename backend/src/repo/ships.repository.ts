import { db } from '../sqlite';
import { NewOrUpdatedShip } from '../types';
import { Ship } from '../types';
import { mapRowsToCamel, mapToSnake } from '../utils/case';
import { formatLocalTimestamp } from '../utils/time';

export const shipRepository = {
    getAll(): Ship[] {
        console.log(`[${formatLocalTimestamp()}] Fetching all ships`);
        const rows = db
            .prepare<[], Record<string, any>>('SELECT * FROM ships')
            .all();
        return mapRowsToCamel<Ship>(rows);
    },

    create(input: NewOrUpdatedShip): Ship {
        console.log(
            `[${formatLocalTimestamp()}] Creating ship: ${input.shipName}`,
        );
        const snake = mapToSnake(input);

        const stmt = db.prepare(`
            INSERT INTO ships (ship_name, registry, ship_class)
            VALUES (@ship_name, @registry, @ship_class)
        `);

        const result = stmt.run(snake);

        return {
            id: Number(result.lastInsertRowid),
            ...input,
        };
    },
};
