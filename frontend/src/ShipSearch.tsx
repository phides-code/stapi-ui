import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import type { Ship } from './App';
import ShipSearchResults from './ShipSearchResults';

export interface ShipSearchPayload {
    name: string;
    registry: string;
}

export interface ShipSearchResponse {
    data: Ship[] | null;
    error: string | null;
}

const ShipSearch = () => {
    const [shipSearchTerms, setShipSearchTerms] = useState<ShipSearchPayload>({
        name: '',
        registry: '',
    });

    const searchResults = useMutation<
        ShipSearchResponse, // success data
        Error, // thrown/network error type
        ShipSearchPayload // variables passed to mutate()
    >({
        mutationFn: async (payload) => {
            const response = await fetch('/api/shipSearch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status} ship search failed`);
            }

            return (await response.json()) as ShipSearchResponse;
        },
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: keyof ShipSearchPayload,
    ) => {
        setShipSearchTerms((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        searchResults.mutate(shipSearchTerms);
    };

    const handleReset = () => {
        setShipSearchTerms({
            name: '',
            registry: '',
        });

        searchResults.reset();
    };

    const buttonsDisabled: boolean =
        shipSearchTerms.name === '' && shipSearchTerms.registry === '';

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <fieldset disabled={searchResults.isPending}>
                    <p>Search for a ship</p>
                    <div>
                        <label htmlFor='shipName'>Ship name:</label>
                        <input
                            type='text'
                            id='shipName'
                            name='shipName'
                            value={shipSearchTerms.name}
                            onChange={(e) => {
                                handleChange(e, 'name');
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor='shipRegistry'>Ship registry:</label>
                        <input
                            type='text'
                            id='shipRegistry'
                            name='shipRegistry'
                            value={shipSearchTerms.registry}
                            onChange={(e) => {
                                handleChange(e, 'registry');
                            }}
                        />
                    </div>
                    <button type='submit' disabled={buttonsDisabled}>
                        Search Ships
                    </button>
                    <button
                        type='reset'
                        disabled={buttonsDisabled}
                        onClick={handleReset}
                    >
                        Reset
                    </button>
                </fieldset>
            </form>

            <div>
                <ShipSearchResults searchResults={searchResults} />
            </div>
        </div>
    );
};

export default ShipSearch;
