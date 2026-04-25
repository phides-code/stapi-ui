import type { UseMutationResult } from '@tanstack/react-query';
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

    return (
        <div>
            {ships?.map((ship) => (
                <ShipListItem key={ship.uid} ship={ship} addable={true} />
            ))}
        </div>
    );
};

export default ShipSearchResults;
