const _apiUrl = "/api/Purchase"

export const getPurchases = () => {
    return fetch(`${_apiUrl}`).then((r) => r.json())
}

export const getPurchaseById = (id) => {
    return fetch(`${_apiUrl}/${id}`).then((r) => r.json())
}

export const createPurchase = (newPurchase) => {
    return fetch(`${_apiUrl}`, {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPurchase)
    }).then((res) => res.json());
}

export const editPurchase = (id, updatedPurchase) => {
    return fetch(`${_apiUrl}/${id}/edit`, {
        method: "PUT",
        headers:{
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPurchase)
    });
}

export const deletePurchase = (id) => {
    return fetch(`${_apiUrl}/${id}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
    });
}