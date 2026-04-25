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

    getByUid(uid: string): Ship {
        console.log(
            `[${formatLocalTimestamp()}] Fetching ship with uid ${uid}`,
        );
        const row = db
            .prepare<
                [string],
                Record<string, any>
            >('SELECT * FROM ships WHERE uid = ?')
            .get(uid);
        if (!row) {
            throw new Error(`Ship not found: ${uid}`);
        }
        return mapRowsToCamel<Ship>([row])[0];
    },

    create(input: NewOrUpdatedShip): Ship {
        console.log(
            `[${formatLocalTimestamp()}] Creating ship: ${input.shipName}`,
        );
        const snake = mapToSnake(input);

        const stmt = db.prepare(`
            INSERT INTO ships (uid, ship_name, registry, ship_class)
            VALUES (@uid, @ship_name, @registry, @ship_class)
        `);

        stmt.run(snake);

        return input;
    },

    delete(input: string): string {
        console.log(`[${formatLocalTimestamp()}] Deleting ship: ${input}`);

        const stmt = db.prepare(`
            DELETE FROM ships
            WHERE uid = ?    
        `);

        const result = stmt.run(input);

        if (result.changes === 0) {
            throw new Error(`Ship not found: ${input}`);
        }
        return input;
    },
};
