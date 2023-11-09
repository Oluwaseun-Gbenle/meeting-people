export const handleDelete = (id,list,setList) => {
    const newList = list.filter(item => item.id !== id);
    setList(newList);
};