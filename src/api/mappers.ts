import type { ApiAd } from "./items";


export const mapCategory = (category: ApiAd["category"]) => {
    switch (category) {
        case "electronics":
            return "Электроника";
        case "auto":
            return "Авто";
        case "real_estate":
            return "Недвижимость";
    }
};

export const mapApiToAd = (item: ApiAd) => {
    return {
        id: item.id,
        category: mapCategory(item.category),
        title: item.title,
        price: `${item.price} ₽`,
        createdAt: "",
        updatedAt: "",
        needsFix: item.needsRevision,
        description: item.description,
        params: item.params || {},
    };
};