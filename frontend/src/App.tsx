import { useQuery } from '@tanstack/react-query';
import ShipSearch from './ShipSearch';
import ShipListItem from './ShipListItem';

export interface Ship {
    uid: string;
    shipName: string;
    registry: string;
    shipClass: string;
}

interface ShipsApiResponse {
    data: Ship[];
    error: string | null;
}

const App = () => {
    const { data, isLoading, isError } = useQuery<ShipsApiResponse>({
        queryKey: ['ships'],
        queryFn: async () => {
            const res = await fetch('/api/ships');

            return await res.json();
        },
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) {
        if (data?.error) {
            console.log('error: ' + data.error);
        }
        return <div>Error</div>;
    }

    const ships = data?.data;

    return (
        <div>
            <p>My ships:</p>
            {ships?.map((ship) => (
                <ShipListItem key={ship.uid} ship={ship} addable={false} />
            ))}
            <ShipSearch />
        </div>
    );
};

export default App;
