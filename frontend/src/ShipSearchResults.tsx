import { useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import type { ShipSearchPayload, ShipSearchResponse } from './ShipSearch';
import type { Ship } from './App';
import ShipListItem from './ShipListItem';

interface ShipSearchResultsProps {
    searchResults: UseMutationResult<
        ShipSearchResponse,
        Error,
        ShipSearchPayload,
        unknown
    >;
}

const ShipSearchResults = ({ searchResults }: ShipSearchResultsProps) => {
    const { data, isPending, isError } = searchResults;

    if (isError || data?.error) {
        return <p>Something went wrong</p>;
    }

    if (isPending) {
        return <p>...</p>;
    }

    const ships = data?.data as Ship[];

    if (ships?.length === 0) {
        return <div>No results</div>;
    }

    const queryClient = useQueryClient();
    const myShipsResponse = queryClient.getQueryData<{
        data: Ship[];
        error: string | null;
    }>(['ships']);
    const myShips = myShipsResponse?.data ?? [];
    const myShipIds = new Set(myShips.map((s) => s.uid));
    const filteredShips = (ships ?? []).filter(
        (ship) => !myShipIds.has(ship.uid),
    );

    return (
        <div>
            {filteredShips?.map((ship) => (
                <ShipListItem key={ship.uid} ship={ship} addable={true} />
            ))}
        </div>
    );
};

export default ShipSearchResults;
