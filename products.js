/**
 * Brew & Bites — Product Catalog Data
 * Contains comprehensive menu items, categories, and utility helpers.
 */

const PRODUCTS = [
    {
        id: 'c1',
        name: 'Spanish Latte',
        category: 'coffee',
        categoryName: 'Hot & Iced Coffee',
        price: 165,
        rating: 4.9,
        reviewsCount: 148,
        badge: 'Best Seller',
        image: 'assets/images/spanish-latte.jpg',
        description: 'Double espresso poured over creamy condensed milk and fresh steamed milk. Sweet, velvety, and delightfully balanced.',
        popular: true,
        dietary: 'Vegetarian',
        calories: '240 kcal'
    },
    {
        id: 'c2',
        name: 'Signature Cold Brew',
        category: 'coffee',
        categoryName: 'Hot & Iced Coffee',
        price: 150,
        rating: 4.8,
        reviewsCount: 96,
        badge: 'Staff Pick',
        image: 'assets/images/signature-coldbrew.jpg',
        description: 'Slow-steeped for 18 hours using single-origin Arabica beans. Ultra-smooth with distinct dark chocolate and caramel undertones.',
        popular: true,
        dietary: 'Vegan / Low Calorie',
        calories: '15 kcal'
    },
    {
        id: 'c3',
        name: 'Hot Cappuccino',
        category: 'coffee',
        categoryName: 'Hot & Iced Coffee',
        price: 140,
        rating: 4.7,
        reviewsCount: 82,
        badge: 'Classic',
        image: 'assets/images/hot-cappuccino.jpg',
        description: 'Bold espresso crowned with a thick, velvety dome of micro-foam milk and lightly dusted with rich Dutch cocoa powder.',
        popular: false,
        dietary: 'Vegetarian',
        calories: '120 kcal'
    },
    {
        id: 'c4',
        name: 'Caramel Macchiato',
        category: 'coffee',
        categoryName: 'Hot & Iced Coffee',
        price: 175,
        rating: 4.9,
        reviewsCount: 210,
        badge: 'Customer Fav',
        image: 'assets/images/caramel-macchiato.jpg',
        description: 'Steamed vanilla milk marked with intense espresso shots and finished with a buttery artisanal salted caramel crosshatch drizzle.',
        popular: true,
        dietary: 'Vegetarian',
        calories: '260 kcal'
    },
    {
        id: 't1',
        name: 'Ceremonial Matcha Latte',
        category: 'tea',
        categoryName: 'Teas & Refreshers',
        price: 170,
        rating: 4.8,
        reviewsCount: 115,
        badge: 'Staff Pick',
        image: 'assets/images/matcha-latte.jpg',
        description: 'Authentic stone-ground Japanese matcha whisked to perfection with silky milk. Earthy, vibrant, and packed with antioxidants.',
        popular: true,
        dietary: 'Vegetarian',
        calories: '190 kcal'
    },
    {
        id: 't2',
        name: 'Hibiscus Berry Iced Tea',
        category: 'tea',
        categoryName: 'Teas & Refreshers',
        price: 145,
        rating: 4.7,
        reviewsCount: 64,
        badge: 'Refreshing',
        image: 'assets/images/hibiscus-berry-tea.jpg',
        description: 'Wild ruby hibiscus steeped with mixed summer berries, mint sprigs, and clover honey over crystal ice cubes.',
        popular: false,
        dietary: 'Vegan / Caffeine-Free',
        calories: '95 kcal'
    },
    {
        id: 't3',
        name: 'Brown Sugar Boba Milk',
        category: 'tea',
        categoryName: 'Teas & Refreshers',
        price: 160,
        rating: 4.9,
        reviewsCount: 184,
        badge: 'Sweet Treat',
        image: 'assets/images/brown-sugar-boba.jpg',
        description: 'Chewy warm brown sugar tapioca boba coated in caramelized tiger syrup and topped with cold fresh milk and sea salt crema.',
        popular: true,
        dietary: 'Vegetarian',
        calories: '310 kcal'
    },
    {
        id: 't4',
        name: 'Yuzu Honey Sparkler',
        category: 'tea',
        categoryName: 'Teas & Refreshers',
        price: 155,
        rating: 4.6,
        reviewsCount: 52,
        badge: 'Cooler',
        image: 'assets/images/yuzu-sparkler.jpg',
        description: 'Zesty Japanese yuzu citrus paired with wild mountain honey and sparkling craft soda over crushed ice.',
        popular: false,
        dietary: 'Vegan / Low Calorie',
        calories: '85 kcal'
    },
    {
        id: 'p1',
        name: 'Golden Butter Croissant',
        category: 'pastries',
        categoryName: 'Bakery & Pastries',
        price: 120,
        rating: 4.9,
        reviewsCount: 132,
        badge: 'Fresh Daily',
        image: 'assets/images/butter-croissant.jpg',
        description: 'Hand-laminated flaky French pastry baked to a golden shine with Elle & Vire European butter. Crispy outside, tender honeycomb inside.',
        popular: true,
        dietary: 'Vegetarian',
        calories: '280 kcal'
    },
    {
        id: 'p2',
        name: 'Blueberry Cream Cheese Muffin',
        category: 'pastries',
        categoryName: 'Bakery & Pastries',
        price: 135,
        rating: 4.7,
        reviewsCount: 78,
        badge: 'Baker Choice',
        image: 'assets/images/blueberry-muffin.jpg',
        description: 'Moist vanilla batter bursting with plump wild blueberries and a rich cream cheese swirl center, finished with cinnamon streusel.',
        popular: false,
        dietary: 'Vegetarian',
        calories: '340 kcal'
    },
    {
        id: 'p3',
        name: 'Basque Burnt Cheesecake',
        category: 'pastries',
        categoryName: 'Bakery & Pastries',
        price: 195,
        rating: 5.0,
        reviewsCount: 240,
        badge: 'Best Seller',
        image: 'assets/images/burnt-cheesecake.jpg',
        description: 'Deeply caramelized exterior giving way to an irresistibly creamy, melt-in-your-mouth Spanish custard cheese center.',
        popular: true,
        dietary: 'Vegetarian',
        calories: '390 kcal'
    },
    {
        id: 'p4',
        name: 'Glazed Cinnamon Roll',
        category: 'pastries',
        categoryName: 'Bakery & Pastries',
        price: 140,
        rating: 4.8,
        reviewsCount: 89,
        badge: 'Comfort Pick',
        image: 'assets/images/cinnamon-roll.jpg',
        description: 'Soft warm brioche ribboned with dark brown sugar and Saigon cinnamon, generously frosted with cream cheese Madagascar vanilla glaze.',
        popular: false,
        dietary: 'Vegetarian',
        calories: '360 kcal'
    },
    {
        id: 's1',
        name: 'Brew & Bites Truffle Burger',
        category: 'sandwiches',
        categoryName: 'Burgers & Sandwiches',
        price: 285,
        rating: 4.9,
        reviewsCount: 195,
        badge: 'Chef Special',
        image: 'assets/images/truffle-burger.jpg',
        description: '100% Angus beef patty seared to perfection, balsamic caramelized onions, melted Swiss cheese, and black truffle garlic aioli in toasted brioche.',
        popular: true,
        dietary: 'Chef Recommendation',
        calories: '620 kcal'
    },
    {
        id: 's2',
        name: 'Crispy Chicken Katsu Sando',
        category: 'sandwiches',
        categoryName: 'Burgers & Sandwiches',
        price: 245,
        rating: 4.8,
        reviewsCount: 142,
        badge: 'Crispy Fav',
        image: 'assets/images/katsu-sandwich.jpg',
        description: 'Golden panko-crusted chicken thigh, crunchy shredded cabbage slaw, and savory Japanese Bulldog katsu sauce packed in thick shokupan milk bread.',
        popular: true,
        dietary: 'High Protein',
        calories: '540 kcal'
    },
    {
        id: 's3',
        name: 'Grilled Triple Cheese Panini',
        category: 'sandwiches',
        categoryName: 'Burgers & Sandwiches',
        price: 215,
        rating: 4.7,
        reviewsCount: 91,
        badge: 'Vegetarian',
        image: 'assets/images/cheese-panini.jpg',
        description: 'Gooey blend of sharp aged cheddar, smoked provolone, and melted mozzarella pressed crisp on herb buttered sourdough bread.',
        popular: false,
        dietary: 'Vegetarian',
        calories: '480 kcal'
    },
    {
        id: 's4',
        name: 'Sourdough Avocado & Poached Egg',
        category: 'sandwiches',
        categoryName: 'Burgers & Sandwiches',
        price: 230,
        rating: 4.8,
        reviewsCount: 110,
        badge: 'Brunch Fav',
        image: 'assets/images/avocado-egg-toast.jpg',
        description: 'Creamy smashed Hass avocado with lemon zest, crumbled Greek feta, chili pepper flakes, and a cage-free runny poached egg on toasted sourdough.',
        popular: false,
        dietary: 'Vegetarian',
        calories: '380 kcal'
    }
];

// Available categories definition
const CATEGORIES = [
    { id: 'all', name: 'All Items', icon: 'fas fa-utensils' },
    { id: 'coffee', name: 'Coffee', icon: 'fas fa-coffee' },
    { id: 'tea', name: 'Teas & Refreshers', icon: 'fas fa-leaf' },
    { id: 'pastries', name: 'Pastries & Bakery', icon: 'fas fa-bread-slice' },
    { id: 'sandwiches', name: 'Burgers & Sandwiches', icon: 'fas fa-hamburger' }
];

// Utility: Find product by id
function getProductById(id) {
    return PRODUCTS.find(p => p.id === id) || null;
}

// Utility: Filter products
function filterProducts(category = 'all', searchQuery = '') {
    return PRODUCTS.filter(product => {
        const matchesCategory = category === 'all' || product.category === category;
        const matchesSearch = !searchQuery || 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });
}
