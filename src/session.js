const loginUser = async()=>{
    const response = await fetch("https://peaceful-inlet-99002.herokuapp.com/login",{
        method: 'POST',
        //mode: 'no-cors',
        body: JSON.stringify({
            "username": "name",
            "password": "123456"
        }),
        headers:{
            "Content-Type": "application/json"
        }
    });
    console.log(response);
    // const userData = await response.json();
    // console.log(userData);
}