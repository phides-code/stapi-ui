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
        return (
            <p className="status-message status-error">
                ⚠ Sensor array malfunction — search failed
            </p>
        );
    }

    if (isPending) {
        return (
            <p className="status-message status-loading">
                Scanning subspace frequencies...
            </p>
        );
    }

    const ships = data?.data as Ship[];

    if (ships?.length === 0) {
        return (
            <p className="status-message status-empty">
                No vessels found matching query parameters
            </p>
        );
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
            <div className="search-results-divider"></div>
            <h3 className="section-heading">
                <span className="heading-accent"></span>
                Search Results
            </h3>
            <div className="ship-list">
                {filteredShips?.map((ship) => (
                    <ShipListItem key={ship.uid} ship={ship} addable={true} />
                ))}
            </div>
        </div>
    );
};

export default ShipSearchResults;
