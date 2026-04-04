export type Ad = {
    id: number;
    category: "Электроника" | "Авто" | "Недвижимость";
    title: string;
    price: string;
    createdAt: string;
    updatedAt: string;
    needsFix: boolean;
    description?: string;
    params?: {
        type?: string;
        brand?: string;
        model?: string;
        color?: string;
        condition?: string;
    };
};

export const ads: Ad[] = [
    {
        id: 1,
        category: "Электроника",
        title: "MacBook Pro 16”",
        price: "64000 ₽",
        createdAt: "10 марта 22:39",
        updatedAt: "10 марта 23:12",
        needsFix: true,
        description: 'Продаю свой MacBook Pro 16" (2021) на чипе M1 Pro. Состояние отличное, работал бережно. Мощности хватает на всё: от сложного монтажа до кода, при этом ноутбук почти не греется.',
        params: {
            type: "Ноутбук",
            brand: "Apple",
            model: "M1 Pro",
            // color: "Серый",
            // condition: "Б/У",
        },
    },
    {
        id: 2,
        category: "Электроника",
        title: "iPhone 14 Pro",
        price: "85000 ₽",
        createdAt: "9 марта 12:10",
        updatedAt: "9 марта 13:00",
        needsFix: false,
        description: "Почти новый iPhone, без царапин.",
        params: {
            type: "Смартфон",
            brand: "Apple",
            model: "14 Pro",
            color: "Чёрный",
            condition: "Б/У",
        },
    },
    {
        id: 3,
        category: "Электроника",
        title: "Наушники Sony",
        price: "2990 ₽",
        createdAt: "8 марта 12:20",
        updatedAt: "8 марта 13:00",
        needsFix: false,
        description: "Отличные беспроводные наушники.",
        params: {
            type: "Аудио",
            brand: "Sony",
            model: "WH-1000XM4",
        },
    },
    {
        id: 4,
        category: "Авто",
        title: "Volkswagen Polo",
        price: "1100000 ₽",
        createdAt: "7 марта 10:10",
        updatedAt: "7 марта 11:00",
        needsFix: true,
        description: "Надёжный городской автомобиль.",
        params: {
            brand: "Volkswagen",
            model: "Polo",
        },
    },
    {
        id: 5,
        category: "Авто",
        title: "Toyota Camry",
        price: "3900000 ₽",
        createdAt: "6 марта 15:30",
        updatedAt: "6 марта 16:00",
        needsFix: false,
        description: "Комфортный бизнес-седан.",
        params: {
            brand: "Toyota",
            model: "Camry",
        },
    },
    {
        id: 6,
        category: "Авто",
        title: "Omoda C5",
        price: "2900000 ₽",
        createdAt: "5 марта 11:00",
        updatedAt: "5 марта 11:30",
        needsFix: false,
        description: "Современный кроссовер.",
    },
    {
        id: 7,
        category: "Недвижимость",
        title: "Студия 25м²",
        price: "15000000 ₽",
        createdAt: "4 марта 09:00",
        updatedAt: "4 марта 09:30",
        needsFix: false,
        description: "Уютная квартира-студия.",
    },
    {
        id: 8,
        category: "Недвижимость",
        title: "1-к квартира 44м²",
        price: "19000000 ₽",
        createdAt: "3 марта 14:00",
        updatedAt: "3 марта 14:20",
        needsFix: true,
        description: "Просторная однушка.",
    },
    {
        id: 9,
        category: "Недвижимость",
        title: "Дом 120м²",
        price: "35000000 ₽",
        createdAt: "2 марта 12:00",
        updatedAt: "2 марта 12:40",
        needsFix: false,
        description: "Загородный дом.",
    },
    {
        id: 10,
        category: "Электроника",
        title: "iPad Air",
        price: "37000 ₽",
        createdAt: "1 марта 18:00",
        updatedAt: "1 марта 18:30",
        needsFix: false,
        description: "Планшет Apple.",
        params: {
            type: "Планшет",
            brand: "Apple",
            model: "Air",
        },
    },
    {
        id: 11,
        category: "Электроника",
        title: "Marshall Major IV",
        price: "20000 ₽",
        createdAt: "28 февраля 17:00",
        updatedAt: "28 февраля 17:20",
        needsFix: false,
        description: "Стильные наушники Marshall.",
    },
    {
        id: 12,
        category: "Авто",
        title: "BMW 5 Series",
        price: "4500000 ₽",
        createdAt: "27 февраля 13:00",
        updatedAt: "27 февраля 13:30",
        needsFix: true,
        description: "Премиум авто в отличном состоянии.",
    },
];