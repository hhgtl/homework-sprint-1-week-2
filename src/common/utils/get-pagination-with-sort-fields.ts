import {SortQueryFilterType} from "../types/sort-query-filter-type";
import {SortQueryFieldsType} from "../types/sort-query-fields-type";

export const getPaginationWithSortFields = (query: SortQueryFieldsType): SortQueryFilterType => {
    const pageNumber = !isNaN(Number(query.pageNumber))
        ? Number(query.pageNumber)
        : 1;
    const pageSize = !isNaN(Number(query.pageSize))
        ? Number(query.pageSize)
        : 10;
    const sortBy = query.sortBy ? query.sortBy : "createdAt";
    const sortDirection: 1 | -1 = query.sortDirection === "asc" ? 1 : -1;
    return {
        pageNumber,
        pageSize,
        sortDirection,
        sortBy,
    };
}