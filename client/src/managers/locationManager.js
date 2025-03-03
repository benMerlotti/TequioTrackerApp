const _apiUrl = "/api/Location"

export const getTopLocations = () => {
    return fetch(`${_apiUrl}/top-locations`).then((r) => r.json())
}