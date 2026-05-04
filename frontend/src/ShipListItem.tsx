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
        <div className="ship-card">
            <div className="ship-card-image">
                <img src={`${classPrefix}.png`} alt={ship.shipClass} />
            </div>
            <div className="ship-card-info">
                <div className="ship-name">{ship.shipName}</div>
                <div className="ship-registry">{ship.registry}</div>
                <div className="ship-class">{ship.shipClass}</div>
            </div>
            <div className="ship-card-actions">
                {addable ? (
                    <button
                        className="btn btn-add"
                        disabled={addedShip.isPending}
                        onClick={(ev) => addShip(ev)}
                    >
                        Add to Fleet
                    </button>
                ) : (
                    <button
                        className="btn btn-danger"
                        disabled={removedShip.isPending}
                        onClick={(ev) => removeShip(ev)}
                    >
                        Remove
                    </button>
                )}
            </div>
            {addedShip.isError && (
                <p className="inline-error">⚠ Failed to add vessel</p>
            )}
        </div>
    );
};

export default ShipListItem;
