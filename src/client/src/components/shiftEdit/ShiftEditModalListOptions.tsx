const ShiftEditModalListOptions = ({ list }: { list: string[] }) =>
    list.map((x) => (
        <option key={x} value={x}>
            {x}
        </option>
    ));

export default ShiftEditModalListOptions;
