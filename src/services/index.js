const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const createForm = async (formTitle,sections) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/createForm/${localStorage.getItem("userId")}`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({title:formTitle,sections})
        })
        if(response.ok){
            return response.json()
        }
    } catch (error) {
        throw new Error(error.message)
    }
}

export const getForms = async (userId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/getForms/${localStorage.getItem("userId")}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        return response.json();
      } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Something went wrong");
      }
    } catch (error) {
      throw new Error(error.message || "An unexpected error occurred");
    }
  };

  export const deleteForm = async (formId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/deleteForm/${formId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        return response.json();
      } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Something went wrong");
      }
    } catch (error) {
      throw new Error(error.message || "An unexpected error occurred");
    }
  };
  