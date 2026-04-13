import { db } from '../sqlite';
import { NewOrUpdatedShip } from '../types';
import { Ship } from '../types';
import { mapRowsToCamel, mapToSnake } from '../utils/case';

export const shipRepository = {
    getAll(): Ship[] {
        const rows = db
            .prepare<[], Record<string, any>>('SELECT * FROM ships')
            .all();
        return mapRowsToCamel<Ship>(rows);
    },

    create(input: NewOrUpdatedShip): Ship {
        const snake = mapToSnake(input);

        const stmt = db.prepare(`
      INSERT INTO ships (ship_name)
      VALUES (@ship_name)
    `);

        const result = stmt.run(snake);

        return {
            id: Number(result.lastInsertRowid),
            ...input,
        };
    },
};
