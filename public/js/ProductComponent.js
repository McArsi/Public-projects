Vue.component('products', {
   data(){
       return {
           catalogUrl: '/catalogData.json',
           filtered: [],
           products: [],
       }
   },
    mounted(){
        this.$parent.getJson(`/api/products`)
            .then(data => {
                for (let item of data){
                    this.$data.products.push(item);
                    this.$data.filtered.push(item);
                }
            });
    },
    methods: {
        filter(userSearch){
            let regexp = new RegExp(userSearch, 'i');
            this.filtered = this.products.filter(el => regexp.test(el.product_name));
        }
    },
   template: `<div class="products">
                <product v-for="item of filtered" 
                :key="item.id_product" 
                :product="item"
                @add-product="$parent.$refs.cart.addProduct"></product>
               </div>`
});
Vue.component('product', {
    props: ['product'],
    methods: {
        imgPath(product) {
            return `img/id${product.id_product}.jpg`
        } 
    },
    template: `
            <div class="product-item">
                <img src="img/vinyl.png" alt="album">
                <img :src="imgPath(product)" alt="album">
                <div class="desc">
                    <h3>{{product.product_name}}</h3>
                    <p>{{product.product_album}}</p>
                    <p>{{product.price}}&#8381;</p>
                    <button class="buy-btn" @click="$emit('add-product', product)">Купить</button>
                </div>
            </div>
    `
})