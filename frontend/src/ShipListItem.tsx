import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Ship } from './App';

interface ShipListItemProps {
    ship: Ship;
    addable: boolean;
}

export interface MutationResponse {
    data: Ship | null;
    error: string | null;
}

const ShipListItem = ({ ship, addable }: ShipListItemProps) => {
    const queryClient = useQueryClient();

    const addedShip = useMutation<MutationResponse, Error, Ship>({
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

            return (await response.json()) as MutationResponse;
        },
    });

    const removedShip = useMutation<MutationResponse, Error, string>({
        mutationFn: async (uid) => {
            const response = await fetch(`/api/ships/${uid}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status} ship search failed`);
            }

            queryClient.invalidateQueries({ queryKey: ['ships'] });

            return (await response.json()) as MutationResponse;
        },
    });

    const addShip = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        ev.preventDefault();

        addedShip.mutate(ship);
    };

    const removeShip = (
        ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        ev.preventDefault();

        removedShip.mutate(ship.uid);
    };

    const classPrefix =
        [
            'ambassador',
            'defiant',
            'galaxy',
            'intrepid',
            'nebula',
            'constitution',
            'excelsior',
            'miranda',
            'sovereign',
        ].find((c) => ship.shipClass.toLowerCase().includes(c)) ?? 'generic';

    return (
        <div>
            <div>{`${ship.shipName} - ${ship.registry}`}</div>
            <div>{ship.shipClass}</div>
            <div>
                <img height='100px' src={`${classPrefix}.png`} />
            </div>
            {addable ? (
                <button
                    disabled={addedShip.isPending}
                    onClick={(ev) => addShip(ev)}
                >
                    Add to my ships
                </button>
            ) : (
                <button
                    disabled={removedShip.isPending}
                    onClick={(ev) => removeShip(ev)}
                >
                    Remove
                </button>
            )}
            {addedShip.isError && <p>Something went wrong</p>}
            <div>---</div>
        </div>
    );
};

export default ShipListItem;
