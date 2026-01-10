type OutputType<T> = Omit<T, '_id'> & { id: string }

export const stripMongoDBId = <T extends { _id: unknown }>(data: T | T[]): OutputType<T> | OutputType<T>[] => {
    if (Array.isArray(data)) {
        return data.map((item) => {
            const { _id, ...rest } = item
            return {
                id: (_id as any).toString(),
                ...rest
            } as OutputType<T>
        })
    }

    const { _id, ...rest } = data as T
    return {
        id: (_id as any).toString(),
        ...rest
    } as OutputType<T>
}