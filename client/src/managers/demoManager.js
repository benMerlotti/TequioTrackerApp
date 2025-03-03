const _apiUrlRace = "/api/Race"
const _apiUrlAgeGroup = "/api/AgeGroup"
const _apiUrlGender = "/api/Gender"
const _apiUrlLocation = "/api/Location"

export const getAgeGroups = () => {
    return fetch(`${_apiUrlAgeGroup}`).then((r) => r.json())
}

export const getRaces = () => {
    return fetch(`${_apiUrlRace}`).then((r) => r.json())
}

export const getGenders = () => {
    return fetch(`${_apiUrlGender}`).then((r) => r.json())
}

export const getLocations = () => {
    return fetch(`${_apiUrlLocation}`).then((r) => r.json())
}