const pad2 = (value: number): string => String(value).padStart(2, '0');

export const formatLocalTimestamp = (date: Date = new Date()): string => {
    const year = date.getFullYear();
    const month = pad2(date.getMonth() + 1);
    const day = pad2(date.getDate());
    const hours = pad2(date.getHours());
    const minutes = pad2(date.getMinutes());
    const seconds = pad2(date.getSeconds());

    return `${year}-${month}-${day} - ${hours}:${minutes}:${seconds}`;
};
