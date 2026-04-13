import { useQuery } from '@tanstack/react-query';

interface Ship {
    id: number;
    shipName: string;
}

interface ShipsApiResponse {
    data: Ship[];
    error: string | null;
}

const App = () => {
    const { data, isLoading, isError } = useQuery<ShipsApiResponse>({
        queryKey: ['ships'],
        queryFn: () => fetch('/api/ships').then((res) => res.json()),
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) {
        if (data?.error) {
            console.log('error: ' + data.error);
        }
        return <div>Error</div>;
    }

    console.log('data:');
    console.log(data);

    const ships = data?.data;

    return (
        <div>
            {ships?.map((ship) => (
                <div key={ship.id}>{ship.shipName}</div>
            ))}
        </div>
    );
};

export default App;
