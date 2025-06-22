import { ConnectionOptions, createConnection } from "mysql2/promise";
import { dbOptions, pool } from "../config/database";

const createDbConnection = async (options: Partial<ConnectionOptions> = {}) => {
    return await createConnection({ ...dbOptions, ...options });
};

const query = async (sql: string) => {
    return (await pool.query(sql))[0];
};

const executeByArray = async (
    preparedStatement: string,
    variables: (string | number | null)[] = []
) => {
    return (await pool.execute(preparedStatement, variables))[0];
};
const executeByPlaceholders = async (
    preparedStatement: string,
    variables: { [key: string]: string | number | null } = {}
) => {
    return (await pool.execute(preparedStatement, variables))[0];
};

export { createDbConnection, query, executeByArray, executeByPlaceholders };
