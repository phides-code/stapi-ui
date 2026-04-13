export interface Ship {
    id: number;
    shipName: string;
}

export interface NewOrUpdatedShip {
    shipName: string;
}

export interface ResponseStructure {
    data: Ship | Ship[] | null;
    error: string | null;
}
