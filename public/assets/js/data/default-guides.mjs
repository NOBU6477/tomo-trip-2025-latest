// Default guide data - centralized to prevent duplication with unified image paths
export const defaultGuideData = [
    {
        id: 1,
        name: "田中健太",
        location: "tokyo",
        rating: 4.8,
        price: 8000,
        image: "/assets/img/guides/default-1.svg",
        languages: ["ja", "en"],
        specialties: ["history", "culture"],
        genres: ['history_culture', 'first_time'],
        registrationLanguage: "ja"
    },
    {
        id: 2,
        name: "佐藤美咲",
        location: "osaka", 
        rating: 4.9,
        price: 7500,
        image: "/assets/img/guides/default-2.svg",
        languages: ["ja", "en", "zh"],
        specialties: ["food", "local"],
        genres: ['local_gourmet', 'cafe_sweets'],
        registrationLanguage: "ja"
    },
    {
        id: 3,
        name: "鈴木一郎",
        location: "kyoto",
        rating: 4.7,
        price: 9000,
        image: "/assets/img/guides/default-3.svg",
        languages: ["ja", "en"],
        specialties: ["temples", "traditional"],
        genres: ['history_culture', 'nature_trek'],
        registrationLanguage: "ja"
    },
    {
        id: 4,
        name: "山田花子",
        location: "osaka",
        rating: 4.6,
        price: 7000,
        image: "/assets/img/guides/default-4.svg",
        languages: ["ja", "en"],
        specialties: ["shopping", "food"],
        genres: ['market_walk', 'local_gourmet'],
        registrationLanguage: "ja"
    },
    {
        id: 5,
        name: "Johnson Mike",
        location: "tokyo",
        rating: 4.8,
        price: 8500,
        image: "/assets/img/guides/default-5.svg",
        languages: ["en", "ja"],
        specialties: ["business", "modern"],
        genres: ['workation', 'nightlife'],
        registrationLanguage: "en"
    },
    {
        id: 6,
        name: "李美麗",
        location: "kyoto",
        rating: 4.9,
        price: 8800,
        image: "attached_assets/image_1754399234136.png",
        languages: ["zh", "ja", "en"],
        specialties: ["culture", "temples"],
        genres: ['history_culture', 'traditional_music'],
        registrationLanguage: "ja"
    },
    {
        id: 7,
        name: "高橋翔太",
        location: "hokkaido",
        rating: 4.7,
        price: 9500,
        image: "attached_assets/image_1754399234136.png",
        languages: ["ja", "en"],
        specialties: ["nature", "skiing"],
        genres: ['nature_trek', 'drive_photo'],
        registrationLanguage: "ja"
    },
    {
        id: 8,
        name: "Anderson Sarah",
        location: "tokyo",
        rating: 4.8,
        price: 8200,
        image: "attached_assets/image_1754399234136.png",
        languages: ["en", "ja"],
        specialties: ["fashion", "youth"],
        genres: ['cafe_sweets', 'photo_support'],
        registrationLanguage: "en"
    },
    {
        id: 9,
        name: "中村由美",
        location: "fukuoka",
        rating: 4.6,
        price: 7300,
        image: "attached_assets/image_1754399234136.png",
        languages: ["ja", "ko"],
        specialties: ["food", "local"],
        genres: ['local_gourmet', 'market_walk'],
        registrationLanguage: "ja"
    },
    {
        id: 10,
        name: "Garcia Carlos",
        location: "osaka",
        rating: 4.7,
        price: 7800,
        image: "attached_assets/image_1754399234136.png",
        languages: ["es", "en", "ja"],
        specialties: ["nightlife", "entertainment"],
        genres: ['nightlife', 'deep_local'],
        registrationLanguage: "en"
    },
    {
        id: 11,
        name: "伊藤真理",
        location: "hiroshima",
        rating: 4.8,
        price: 8600,
        image: "attached_assets/image_1754399234136.png",
        languages: ["ja", "en"],
        specialties: ["history", "peace"],
        genres: ['history_culture', 'first_time'],
        registrationLanguage: "ja"
    },
    {
        id: 12,
        name: "Smith Robert",
        location: "kyoto",
        rating: 4.9,
        price: 9200,
        image: "attached_assets/image_1754399234136.png",
        languages: ["en", "ja"],
        specialties: ["zen", "meditation"],
        genres: ['nature_trek', 'photo_support'],
        registrationLanguage: "en"
    }
];

console.log('%cDefault Guides Loaded:', 'color: #28a745;', defaultGuideData.length, 'guides available');