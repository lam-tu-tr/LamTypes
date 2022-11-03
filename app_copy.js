const loadQuotes = async () => {
    try{
        const res = await axios.get("https://type.fit/api/quotes");
        console.log(res.data);
    } catch(e){
        console.log("ERROR", e);
    }
};

loadQuotes();