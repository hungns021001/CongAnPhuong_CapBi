const formatDate = (date) => {
    const formatedDate = date.slice(0, 10).split("-").reverse().join("-");

    return formatedDate;
};

export default formatDate;
