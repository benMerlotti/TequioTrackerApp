const _apiUrl = "/api/Customer"

export const getCustomers = () => {
    return fetch(`${_apiUrl}`).then((r) => r.json())
}

export const getCustomerById = (id) => {
    return fetch(`${_apiUrl}/${id}`).then((r) => r.json())
}

export const createCustomer = (newCustomer) => {
    return fetch(`${_apiUrl}`, {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCustomer)
    }).then((res) => res.json());
}

export const editCustomer = (id, newCustomer) => {
    return fetch(`${_apiUrl}/${id}/edit`, {
        method: "PUT",
        headers:{
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCustomer)
    });
}

export const deleteCustomer = (id) => {
    return fetch(`${_apiUrl}/${id}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
    });
}