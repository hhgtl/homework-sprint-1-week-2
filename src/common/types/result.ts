import {HttpStatuses} from "./http-statuses";

type ExtensionType = {
    field: string | null;
    message: string;
};

export type Result<T = null> = {
    status: HttpStatuses;
    errorMessage?: string;
    extensions: ExtensionType[];
    data: T;
};
