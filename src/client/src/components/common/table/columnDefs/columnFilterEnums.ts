import { overrunTypeEnum, typeEnum } from "../../../../../../shared/enums";

const columnFilterEnums: {
    [key: string]: string[];
} = {
    type: typeEnum,
    overrun_type: overrunTypeEnum,
};
export default columnFilterEnums;
