import { overrunTypeList, typeList } from "../../../../../../shared/lists";

const columnFilterLists: {
    [key: string]: string[];
} = {
    type: typeList,
    overrun_type: overrunTypeList,
};
export default columnFilterLists;
