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
        <div className="search-panel">
            <h2 className="section-heading">
                <span className="heading-accent"></span>
                Search Starfleet Registry
            </h2>
            <form onSubmit={handleSubmit}>
                <fieldset disabled={searchResults.isPending}>
                    <div className="search-form-grid">
                        <div className="form-group">
                            <label className="form-label" htmlFor='shipName'>
                                Ship Name
                            </label>
                            <input
                                className="form-input"
                                type='text'
                                id='shipName'
                                name='shipName'
                                placeholder='e.g. Enterprise'
                                value={shipSearchTerms.name}
                                onChange={(e) => {
                                    handleChange(e, 'name');
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor='shipRegistry'>
                                Registry
                            </label>
                            <input
                                className="form-input"
                                type='text'
                                id='shipRegistry'
                                name='shipRegistry'
                                placeholder='e.g. NCC-1701'
                                value={shipSearchTerms.registry}
                                onChange={(e) => {
                                    handleChange(e, 'registry');
                                }}
                            />
                        </div>
                    </div>
                    <div className="search-actions">
                        <button
                            className="btn btn-primary"
                            type='submit'
                            disabled={buttonsDisabled}
                        >
                            Search Ships
                        </button>
                        <button
                            className="btn btn-secondary"
                            type='reset'
                            disabled={buttonsDisabled}
                            onClick={handleReset}
                        >
                            Reset
                        </button>
                    </div>
                </fieldset>
            </form>

            <div className="search-results">
                <ShipSearchResults searchResults={searchResults} />
            </div>
        </div>
    );
};

export default ShipSearch;
