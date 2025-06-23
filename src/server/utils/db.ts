import {
    ConnectionOptions,
    createConnection,
    RowDataPacket,
} from "mysql2/promise";
import { dbOptions, pool } from "../config/database";

const createDbConnection = async (options: Partial<ConnectionOptions> = {}) => {
    return await createConnection({ ...dbOptions, ...options });
};

const query = async (sql: string) => {
    return (await pool.query(sql))[0];
};

const executeByArray = async <T = RowDataPacket>(
    preparedStatement: string,
    variables: (string | number | null)[] = []
): Promise<T[]> => {
    return (await pool.execute(preparedStatement, variables))[0] as T[];
};
const executeByPlaceholders = async <T = RowDataPacket>(
    preparedStatement: string,
    variables: { [key: string]: string | number | null } = {}
): Promise<T[]> => {
    return (await pool.execute(preparedStatement, variables))[0] as T[];
};

export { createDbConnection, query, executeByArray, executeByPlaceholders };
