
<template>
    <div class="container mx-auto px-4 py-8" dir="rtl">

       

        <!-- Categories -->
        <div class="flex gap-2 overflow-x-auto pb-3 mb-5 duration-300 transition-all">

            <button
                v-for="category in categories"
                :key="category.id"
                @click="activeCategory = category.id"
                class="btn btn-sm whitespace-nowrap"
                :class="activeCategory === category.id
                    ? 'btn-primary'
                    : 'btn-ghost bg-base-200'"
            >
                {{ category.title }}
            </button>

        </div>

        <!-- Results Header -->
        <div class="flex justify-between items-center mb-5">

            <span class="text-sm text-base-content/60">
                {{ filteredProducts.length }} محصول
            </span>

            <div class="flex items-center gap-2">

                <button
                    @click="columns = 2"
                    class="btn btn-sm btn-square"
                    :class="columns === 2 ? 'btn-primary' : 'btn-ghost'"
                >
                    <span>▦</span>
                </button>

                <button
                    @click="columns = 3"
                    class="btn btn-sm btn-square hidden sm:inline-flex"
                    :class="columns === 3 ? 'btn-primary' : 'btn-ghost'"
                >
                    <span>▤</span>
                </button>

                <button
                    @click="columns = 4"
                    class="btn btn-sm btn-square hidden sm:inline-flex"
                    :class="columns === 4 ? 'btn-primary' : 'btn-ghost'"
                >
                    <span>▥</span>
                </button>

            </div>

        </div>

        <!-- Products -->
        <div
            v-if="paginatedProducts.length"
            class="grid grid-cols-2 gap-4 duration-300"
            :class="{
                'sm:grid-cols-2': columns === 2,
                'sm:grid-cols-3': columns === 3,
                'sm:grid-cols-4': columns === 4
            }"
        >

            <article
                v-for="product in paginatedProducts"
                :key="product.id"
                class="card bg-base-100 border border-base-200
                    hover:shadow-lg transition-shadow duration-300"
            >

                <!-- Image -->
                <figure class="relative bg-base-200 aspect-square">

                    <img
                        :src="product.image"
                        :alt="product.title"
                        class="w-full h-full object-cover"
                        loading="lazy"
                    />

                    <span
                        v-if="product.discount"
                        class="badge badge-error absolute top-3 right-3"
                    >
                        {{ product.discount }}٪ تخفیف
                    </span>

                    <button
                        @click="toggleFavorite(product)"
                        class="btn btn-circle btn-sm absolute top-3 left-3"
                        :class="product.favorite
                            ? 'btn-error text-white'
                            : 'btn-base'"
                        aria-label="علاقه‌مندی"
                    >
                        ♥
                    </button>

                </figure>

                <!-- Content -->
                <div class="card-body p-3 sm:p-4 gap-2 justify-between">

                    <div class="text-xs text-base-content/50">
                        {{ product.category }}
                    </div>

                    <h2 class="font-bold text-sm sm:text-base line-clamp-2">
                        {{ product.title }}
                    </h2>

                    <!-- Rating -->
                    <div class="flex items-center gap-1 text-xs">
                        <span class="text-warning">★</span>
                        <span>{{ product.rating }}</span>
                        <span class="text-base-content/40">
                            ({{ product.reviews }})
                        </span>
                    </div>

                    <!-- Price -->
                    <div class="mt-2">

                        <div
                            v-if="product.discount"
                            class="text-xs text-base-content/40 line-through"
                        >
                            {{ formatPrice(product.oldPrice) }}
                        </div>

                        <div class="font-bold text-primary">
                            {{ formatPrice(product.price) }}
                            <span class="text-xs font-normal">تومان</span>
                        </div>

                    </div>

                    <!-- Add to cart -->
                    <button
                        class="btn btn-primary btn-sm mt-2"
                        :disabled="!product.stock"
                        @click="addToCart(product)"
                    >
                        {{ product.stock ? 'افزودن به سبد خرید' : 'ناموجود' }}
                    </button>

                </div>

            </article>

        </div>

        <!-- Empty -->
        <div
            v-else
            class="flex flex-col items-center justify-center py-20"
        >
            <div class="text-5xl mb-4 opacity-30">⌕</div>

            <h3 class="font-bold text-lg">
                محصولی پیدا نشد
            </h3>

            <p class="text-sm text-base-content/50 mt-2">
                عبارت جستجو یا دسته‌بندی را تغییر بده
            </p>

            <button
                @click="resetFilters"
                class="btn btn-primary btn-sm mt-5"
            >
                حذف فیلترها
            </button>
        </div>

        <!-- Pagination -->
        <div
            v-if="totalPages > 1"
            class="flex justify-center mt-10"
        >
            <div class="join">

                <button
                    class="join-item btn"
                    :disabled="page === 1"
                    @click="page--"
                >
                    ❯
                </button>

                <button
                    v-for="p in totalPages"
                    :key="p"
                    class="join-item btn"
                    :class="page === p ? 'btn-primary' : ''"
                    @click="page = p"
                >
                    {{ p }}
                </button>

                <button
                    class="join-item btn"
                    :disabled="page === totalPages"
                    @click="page++"
                >
                    ❮
                </button>

            </div>
        </div>

    </div>
</template>

<script>
export default {
    name: 'ProductsView',

    emits: ['add-to-cart', 'product-click'],

    data() {
        return {
            search: '',
            sort: 'newest',
            activeCategory: 'all',
            columns: 4,
            page: 1,
            perPage: 12,

            categories: [
                { id: 'all', title: 'همه محصولات' },
                { id: 'digital', title: 'کالای دیجیتال' },
                { id: 'mobile', title: 'موبایل' },
                { id: 'computer', title: 'کامپیوتر' },
                { id: 'accessory', title: 'لوازم جانبی' }
            ],

            products: [
                {
                    id: 1,
                    title: 'هدفون بی‌سیم مدل Pro',
                    category: 'digital',
                    price: 2500000,
                    oldPrice: 2900000,
                    discount: 14,
                    rating: 4.8,
                    reviews: 125,
                    stock: true,
                    favorite: false,
                    image: window.location.origin+'/images/headphone.png',
                    createdAt: 10
                },
                {
                    id: 2,
                    title: 'ساعت هوشمند مدل Ultra',
                    category: 'accessory',
                    price: 3800000,
                    oldPrice: 4200000,
                    discount: 10,
                    rating: 4.6,
                    reviews: 85,
                    stock: true,
                    favorite: false,
                    image: window.location.origin+'/images/shoes.png',
                    createdAt: 9
                },
                {
                    id: 3,
                    title: 'ماوس بی‌سیم ارگونومیک',
                    category: 'computer',
                    price: 950000,
                    oldPrice: null,
                    discount: 0,
                    rating: 4.5,
                    reviews: 42,
                    stock: true,
                    favorite: false,
                    image: window.location.origin+'/images/mouse.png',
                    createdAt: 8
                },
                {
                    id: 4,
                    title: 'کیبورد مکانیکی RGB',
                    category: 'computer',
                    price: 2100000,
                    oldPrice: null,
                    discount: 0,
                    rating: 4.7,
                    reviews: 67,
                    stock: true,
                    favorite: false,
                    image: window.location.origin+'/images/keyboard.png',
                    createdAt: 7
                },
                {
                    id: 5,
                    title: 'دوربین عکاسی دیجیتال',
                    category: 'digital',
                    price: 12500000,
                    oldPrice: 14000000,
                    discount: 11,
                    rating: 4.9,
                    reviews: 93,
                    stock: false,
                    favorite: false,
                    image: window.location.origin+'/images/camera.png',
                    createdAt: 6
                },
                {
                    id: 6,
                    title: 'گوشی موبایل مدل جدید',
                    category: 'mobile',
                    price: 18000000,
                    oldPrice: null,
                    discount: 0,
                    rating: 4.8,
                    reviews: 150,
                    stock: true,
                    favorite: false,
                    image: window.location.origin+'/images/phone.png',
                    createdAt: 5
                }
            ]
        }
    },

    computed: {
        filteredProducts() {
            let result = [...this.products];

            // Search
            if (this.search.trim()) {
                const query = this.search.trim().toLowerCase();

                result = result.filter(product =>
                    product.title.toLowerCase().includes(query)
                );
            }

            // Category
            if (this.activeCategory !== 'all') {
                result = result.filter(product =>
                    product.category === this.activeCategory
                );
            }

            // Sort
            switch (this.sort) {
                case 'price-asc':
                    result.sort((a, b) => a.price - b.price);
                    break;

                case 'price-desc':
                    result.sort((a, b) => b.price - a.price);
                    break;

                case 'discount':
                    result.sort((a, b) => b.discount - a.discount);
                    break;

                default:
                    result.sort((a, b) => b.createdAt - a.createdAt);
            }

            return result;
        },

        totalPages() {
            return Math.ceil(
                this.filteredProducts.length / this.perPage
            );
        },

        paginatedProducts() {
            const start = (this.page - 1) * this.perPage;

            return this.filteredProducts.slice(
                start,
                start + this.perPage
            );
        }
    },

    watch: {
        search() {
            this.page = 1;
        },

        activeCategory() {
            this.page = 1;
        },

        sort() {
            this.page = 1;
        }
    },

    methods: {
        formatPrice(price) {
            return new Intl.NumberFormat('fa-IR').format(price);
        },

        toggleFavorite(product) {
            product.favorite = !product.favorite;
        },

        addToCart(product) {
            this.$emit('add-to-cart', product);
        },

        resetFilters() {
            this.search = '';
            this.sort = 'newest';
            this.activeCategory = 'all';
            this.page = 1;
        }
    }
}
</script>
