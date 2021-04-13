export const removeItem = (array: any[], item: any) => {
    const index = array.indexOf(item);
    console.log("index: ", index);
    if (index > -1) {
        console.log("preSlplice: ", array);
        array.splice(index, 1);
        console.log("afterSlplice: ", array);
    }
    console.log("finalArray", array);
    return array;
};
