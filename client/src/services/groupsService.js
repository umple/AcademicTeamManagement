import axios from "axios"
const groupsService = {
    get: async () => {
        return await axios.get("/api/groups").then((response) => { 
            return response.json() 
        }).then((data) => {
            return data;
        }).catch((error) => { return error });
    },
    post: async (values) => {
        try {
            const response = await fetch("api/group", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            });

            if (response.ok) {
                return response.status;
            } else {
                throw new Error(`Request failed with status: ${response.status}`);
            }
        } catch (error) {
            console.error(error);
        }
    }

}

export default groupsService;