export interface SmallRecipe {
    "id": number,
    "title": string,
    "imageType": string,
    "image": string
}

export interface SmallRecipesResponse {
    "results": SmallRecipe[]
}
