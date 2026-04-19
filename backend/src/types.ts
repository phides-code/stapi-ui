export interface Ship {
    id?: number;
    shipName: string;
    registry: string;
    shipClass: string;
}

export interface NewOrUpdatedShip {
    shipName: string;
    registry: string;
    shipClass: string;
}

export interface ResponseStructure {
    data: Ship | Ship[] | null;
    error: string | null;
}

export interface ShipSearchPayload {
    name: string;
}

export interface StApiResponse {
    page: Page;
    spacecrafts: Spacecraft[];
}

export interface Page {
    pageNumber: number;
    pageSize: number;
    numberOfElements: number;
    totalElements: number;
    totalPages: number;
    firstPage: boolean;
    lastPage: boolean;
}

export interface Spacecraft {
    uid: string;
    name: string;
    registry: string;
    status: string;
    dateStatus: string;
    spacecraftClass: SpacecraftClass;
    owner: string | null;
    operator: string | null;
    affiliation: string | null;
}

export interface SpacecraftClass {
    uid: string;
    name: string;
}
