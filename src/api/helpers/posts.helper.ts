export function getPagination(size: string, page: string): { offset: number, limit: number } {
    const limit = size ? parseInt(size) : 3;
    const offset = page ? (parseInt(page) - 1) * parseInt(size) : 0;
    return { offset, limit };
}