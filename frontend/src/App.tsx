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

    if (isLoading)
        return (
            <div className="app-container">
                <header className="app-header">
                    <h1 className="app-title">STAPI</h1>
                    <p className="app-subtitle">Starship Database Interface</p>
                </header>
                <p className="status-message status-loading">
                    Accessing Starfleet Database...
                </p>
            </div>
        );
    if (isError) {
        if (data?.error) {
            console.log('error: ' + data.error);
        }
        return (
            <div className="app-container">
                <header className="app-header">
                    <h1 className="app-title">STAPI</h1>
                    <p className="app-subtitle">Starship Database Interface</p>
                </header>
                <p className="status-message status-error">
                    ⚠ Communications failure — unable to reach Starfleet Command
                </p>
            </div>
        );
    }

    const ships = data?.data;

    return (
        <div className="app-container">
            <header className="app-header">
                <h1 className="app-title">STAPI</h1>
                <p className="app-subtitle">Starship Database Interface</p>
            </header>

            <h2 className="section-heading">
                <span className="heading-accent"></span>
                My Ships
            </h2>
            <div className="ship-list">
                {ships?.map((ship) => (
                    <ShipListItem key={ship.uid} ship={ship} addable={false} />
                ))}
            </div>

            <ShipSearch />
        </div>
    );
};

export default App;
