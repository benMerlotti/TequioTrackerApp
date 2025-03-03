const _apiUrl = "/api/Ambassador"

export const getEmployees = () => {
    return fetch(`${_apiUrl}`).then((r) => r.json())
}

export const getEmployeesWithRoles = () => {
    return fetch(`${_apiUrl}/withroles`).then((r) => r.json())
}

export const getEmployeeById = (id) => {
    return fetch(`${_apiUrl}/${id}`).then((r) => r.json())
}

export const getPendingActivations = () => {
    return fetch(`${_apiUrl}/pending-activations`).then((r) => r.json())

};


export const createEmployee = (newEmployee) => {
    return fetch(`${_apiUrl}`, {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newEmployee)
    }).then((res) => res.json());
}

export const editEmployee = (id, newEmployee) => {
    return fetch(`${_apiUrl}/${id}/edit`, {
        method: "PUT",
        headers:{
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newEmployee)
    });
}
export const toggleAmbassadorStatus = (id) => {
    return fetch(`${_apiUrl}/${id}/updateStatus`, {
        method: "PUT",
        headers:{
            "Content-Type": "application/json",
          }
    });
}

export const deleteEmployee = (id) => {
    return fetch(`${_apiUrl}/${id}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
    });

}