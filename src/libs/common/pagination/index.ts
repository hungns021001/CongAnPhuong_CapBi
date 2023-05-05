export const paginationHandle = function (
    pages,
    data
) {
    try {
        const page = pages || 1
        const pageSize = 10
        const startIndex = (page - 1) * pageSize
        const endIndex = startIndex + pageSize
        const pagnationList = data.slice(startIndex, endIndex);

        return pagnationList
    } catch (err: any) {
        console.log('Get data pagination error.');
        return false;
    }
};
export const totalPage = function (
    length
){
    try{
        const pageSize = 10
        return length < pageSize ? 1 : Math.ceil(length / pageSize);
    }
    catch (err: any){
        console.log('Get data totalPage error.');
        return false;
    }
}
export const searchByText = function (
    text, data
){
        console.log("data",data);
         
        const filteredWords = data.filter(word => word.Receiver.match(text));
        return filteredWords;
    // try{
    //     console.log("data",data);
        
    //     const filteredWords = data.filter(word => word.Receiver.match(text));
    //     return filteredWords;
    // }
    // catch (err: any){
    //     console.log('Get data error.');
    //     return false;
    // }
}

export const deleyeById = function (
    id, data
){
    try{
        const filteredWords = data.filter(word => word.Id !== id);
        return filteredWords
    }                           
    catch (err: any){
        console.log('Get data error.');
        return false;
    }
}

export const updateById = function (
    id, dataUpdate, data
){
    try {
      let items = [];
      const filteredWords = data.filter((word) => word.Id !== id);
      console.log("filteredWords",filteredWords);
      
      return items.concat(dataUpdate, filteredWords);
    } catch (err: any) {
      console.log("Get data error.");
      return false;
    }
}

export const getData = function (data) {
  try {
    const filteredWords = data.filter((word) => word);
    const last_data_id = filteredWords[filteredWords.length - 1];
    return Object.values(last_data_id)[0];
  } catch (err: any) {
    console.log("Get data error.");
    return false;
  }
};

export const sortData = function (data) {
  try {
    const filteredWords = data.filter((word) => word !== undefined);
    return filteredWords.sort((a, b) => a.Id - b.Id);
  } catch (err: any) {
    console.log("Get data error.");
    return false;
  }
};

export const formatDay = function (date) {
  try {
    const dateArr = date.split("-");
    dateArr.reverse();
    const newDateStr = dateArr.join('-');
    return newDateStr;
  } catch (err: any) {
    console.log("Get data error.");
    return false;
  }
};
export const getTimeDate = function(){
  try {
    const date = new Date();
    const timeDate = date.toLocaleTimeString('en-US') +" - "+ date.toLocaleDateString();
    return timeDate.toString();
  } catch (err :any) {
    console.log("Get data error.");
    return "Error occurred while getting date";
  }
}

export const checkDay = function (date) {
  try {
    const currentDate = new Date();
    const dateToCheck = new Date(date || '')
    const isOneDayAgo = currentDate.getDay() - dateToCheck.getDay() >= 1;
    return isOneDayAgo;
  } catch (err: any) {
    console.log("Get data error.");
    return false;
  }
}