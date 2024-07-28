import { useState, useEffect } from 'react';

const useEditableTable = (initialData: any) => {
    const [data, setData] = useState(initialData);

    useEffect(() => {
        setData((prevData: any) => {
            const newItems = initialData.filter((newItem: any) =>
                !prevData.some((existingItem: any) => existingItem.key === newItem.key)
            )
            return [...prevData, ...newItems]
        });

    }, [initialData]);

    const handleValueChange = (key: any, field: any, value: any) => {
        const newData = data.map((item: any) => {
            if (item.key === key) {
                return { ...item, [field]: value };
            }
            return item;
        });
        setData(newData);
    };

    return [data, handleValueChange];
};

export default useEditableTable;
