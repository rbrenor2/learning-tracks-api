import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "../constants/pagination.const"

export const buildPaginationOptions = ({ pageSize, pageNumber }: { pageSize: number, pageNumber: number }): { skip: number, take: number } => {
    const page = pageNumber ?? DEFAULT_PAGE
    const take = pageSize ?? DEFAULT_PAGE_SIZE
    const skip = page * take

    return {
        take,
        skip
    }
}