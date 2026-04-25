import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Ship } from './App';

interface ShipListItemProps {
    ship: Ship;
    addable: boolean;
}

export interface AddShipResponse {
    data: Ship | null;
    error: string | null;
}

const ShipListItem = ({ ship, addable }: ShipListItemProps) => {
    const addShip = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        ev.preventDefault();

        addedShip.mutate(ship);
    };

    const queryClient = useQueryClient();

    const addedShip = useMutation<AddShipResponse, Error, Ship>({
        mutationFn: async (payload) => {
            const response = await fetch('/api/ships', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status} ship search failed`);
            }

            queryClient.invalidateQueries({ queryKey: ['ships'] });

            return (await response.json()) as AddShipResponse;
        },
    });

    return (
        <div>
            <div>{`${ship.shipName} - ${ship.registry}`}</div>
            <div>{ship.shipClass}</div>
            {addable && (
                <button
                    disabled={addedShip.isPending}
                    onClick={(ev) => addShip(ev)}
                >
                    Add to my ships
                </button>
            )}
            {addedShip.isError && <p>Something went wrong</p>}
            <div>---</div>
        </div>
    );
};

export default ShipListItem;
