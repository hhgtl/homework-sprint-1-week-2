import {HttpStatuses} from "./http-statuses";
import {ResultStatus} from "./result-status";

type ExtensionType = {
    field: string | null;
    message: string;
};

export type Result<T = null> = {
    status: HttpStatuses | ResultStatus;
    errorMessage?: string;
    extensions: ExtensionType[];
    data: T;
};
