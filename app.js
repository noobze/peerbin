const upload = async (data) => {
    try{
        const headers = new Headers();
        headers.set("Authorization" , "Basic N2FkYTZkYzUtYjQyNC00MjMwLWFhODctOWM1MmY0MjliZTZiOnNUNEdUaDFNQkFiaUxMYlk1OVhqMlJkZVgxZzV2dnVrN0Z4c0ZxMk0=");
        headers.set("Content-Type" , "application/json");
        const response = await fetch("https://rpc.particle.network/ipfs/upload_json" , {
            method : "POST",
            headers : headers,
            body : JSON.stringify(data)
        });
        return {status : true , response : await response.json()}
    }catch(e){
        console.log(e);
    }
    return {status : false , response : {}}
}

const download = async (id) => {
    try{
        const response = await fetch(`https://ipfs.particle.network/${id}`);
        return {status : true , response : await response.json()}
    }catch(e){
        console.log(e);
    }
    return {status : false , response : {}}
}

const parseIfJson = (data) => {
    try{
        return JSON.parse(data);
    }catch(e){
        return data;
    }
}

const isJson = (data) => {
    try{
        let _ = JSON.parse(`"${data}"`);
        return true;
    }catch(e){
        return false;
    }
}

window.onload = async (e) =>{
    
    const newButton = document.getElementById("create-new");
    const publishButton = document.getElementById("publish");

    const query = new Proxy(new URLSearchParams(window.location.search) , {
        get : (_ , prop) => _.get(prop),
    })

    let id = query.id;

    if(id){
        const {status , response} = await download(id);
        if(status){
            publishButton.setAttribute("disabled" , true);
            let editor = document.getElementById("editor");
            editor.setAttribute("readonly" , true);
            editor.value = isJson(response.content) ?  JSON.stringify(response.content , null , 5) : response.content ;
        }
    }

    newButton.addEventListener("click" , (e)=>{
        window.location.search = "";
    });

    publishButton.addEventListener("click" , async (e)=>{
        let editor = document.getElementById("editor");

        if(!editor.value){
            return;
        }

        publishButton.setAttribute("disabled" , true);
        let rocket = document.getElementById("rocket-icon");
        rocket.classList = ["loading"];
        const {status , response} = await upload({version : "Peerbin-0.0.1" , content : parseIfJson(editor.value)});
        if(status){
            let params = new URLSearchParams();
            params.append("id" , response.cid);
            window.location.search = params.toString();
        }else{
            console.log("Something went wrong");
        }
    })
};