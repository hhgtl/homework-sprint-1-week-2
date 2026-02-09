import {SortQueryFilterType} from "../../../common/types/sort-query-filter-type";
import {blogsCollection, usersCollection} from "../../../db/db";
import {ObjectId, WithId} from "mongodb";
import {UsersViewType} from "../types/users-view-type";
import {UsersDbType} from "../types/users-db-type";

export const usersRepositoriesQuery = {
    async getAllUsers({sortBy, sortDirection, pageNumber, pageSize, searchEmailTerm, searchLoginTerm}: SortQueryFilterType & {searchLoginTerm: string | null, searchEmailTerm: string | null}) {
        const filter: any = {};

        if (searchLoginTerm) {
            filter.login = { $regex: searchLoginTerm, $options: 'i' };
        }

        if (searchEmailTerm) {
            filter.email = { $regex: searchEmailTerm, $options: 'i' };
        }

        const countPromise = usersCollection.countDocuments(filter);

        const usersPromise = usersCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        const [totalCount, users] = await Promise.all([countPromise, usersPromise]);

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: users.map(user => this._getInUserView(user)),
        };
    },
    async findUserById(_id: ObjectId) {
        const user = await usersCollection.findOne({_id})

        if (user !== null) {
            return this._getInUserView(user);
        }

        return user
    },
    _getInUserView(user: WithId<UsersDbType>): UsersViewType {
        return {
            id: user._id.toString(),
            email: user.email,
            login: user.login,
            createdAt: user.createdAt.toISOString(),
        }
    }
}