import {
    ConnectionOptions,
    createConnection,
    ResultSetHeader,
    RowDataPacket,
} from "mysql2/promise";
import { dbOptions, pool } from "../config/database";

const createDbConnection = async (options: Partial<ConnectionOptions> = {}) => {
    return await createConnection({ ...dbOptions, ...options });
};

const query = async (sql: string) => {
    return (await pool.query(sql))[0];
};

const executeReadByArray = async <T = RowDataPacket>(
    preparedStatement: string,
    variables: (string | number | null)[] = []
): Promise<T[]> => {
    return (await pool.execute(preparedStatement, variables))[0] as T[];
};
const executeWriteByArray = async (
    preparedStatement: string,
    variables: (string | number | null)[] = []
): Promise<ResultSetHeader> => {
    return (
        await pool.execute(preparedStatement, variables)
    )[0] as ResultSetHeader;
};
const executeReadByPlaceholders = async <T = RowDataPacket>(
    preparedStatement: string,
    variables: { [key: string]: string | number | null } = {}
): Promise<T[]> => {
    return (await pool.execute(preparedStatement, variables))[0] as T[];
};
const executeWriteByPlaceholders = async (
    preparedStatement: string,
    variables: { [key: string]: string | number | null } = {}
): Promise<ResultSetHeader> => {
    return (
        await pool.execute(preparedStatement, variables)
    )[0] as ResultSetHeader;
};

export {
    createDbConnection,
    query,
    executeReadByArray,
    executeWriteByArray,
    executeReadByPlaceholders,
    executeWriteByPlaceholders,
};
