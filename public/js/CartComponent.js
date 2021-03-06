Vue.component( 'cart', {
    data() {
        return {
            showCart: false,
            cartItems: [],
        }
    },
    methods: {
        addProduct( product ) {
            let find = this.cartItems.find( el => el.id_product === product.id_product );
            if ( find ) {
                this.$parent.putJson( `/api/cart/${ product.id_product }/${ product.product_name }`, { quantity: 1 } )
                    .then( data => {
                        if ( data.result ) {
                            find.quantity++;
                        }
                    } )
            } else {
                let prod = Object.assign( { quantity: 1 }, product );
                this.$parent.postJson( `api/cart/${ product.id_product }/${ product.product_name }`, prod )
                    .then( data => {
                        if ( data.result ) {
                            this.cartItems.push( prod );
                        }
                    } )
            }
        },
        remove( product ) {
            if ( product.quantity > 1 ) {
                this.$parent.putJson( `/api/cart/${ product.id_product }/${ product.product_name }`, { quantity: -1 } )
                    .then( data => {
                        if ( data.result ) {
                            product.quantity--;
                        }
                    } )
            } else {
                this.$parent.deleteJson( `/api/cart/${ product.id_product }/${ product.product_name }`, product )
                    .then( data => {
                        if ( data.result ) {
                            this.cartItems.splice( this.cartItems.indexOf( product ), 1 );
                        } else {
                            console.log( 'error' );
                        }
                    } )
            }
        },
        sum() {
            let cartPrice = 0;
            let cart = this.cartItems;
            cart.forEach(el => cartPrice += el.quantity * el.price)
            return cartPrice;
        },
    },
    mounted() {
        this.$parent.getJson( `/api/cart` )
            .then( data => {
                for ( let el of data.contents ) {
                    this.cartItems.push( el )
                }
            } );
    },
    template: `<div>
<button class="btn-cart" type="button" @click='showCart = !showCart'><i class="fas fa-shopping-cart"></i></button>
<div class="cart-block" v-show="showCart">
                <p v-if="!cartItems.length">?? ?????????????? ?????? ??????????????</p>
                <cart-item 
                v-for="item of cartItems" 
                :key="item.id_product"
                :cart-item="item"
                :img="item.imgCart"
                @remove="remove"></cart-item>
                <p>??????????: {{sum()}} &#8381</p>
            </div>
            
</div>`
} );
Vue.component( 'cart-item', {
    props: [ 'cartItem' ],
    methods: {
        imgPath(product) {
            return `img/id${product.id_product}.jpg`
        } 
    },
    template: `<div class="cart-item">
                <div class="product-bio">
                    <img :src="imgPath(cartItem)" alt="Some image">
                    <div class="product-desc">
                        <p class="product-title">{{cartItem.product_name}}</p>
                        <p class="product-quantity">????????????????????: {{cartItem.quantity}}</p>
                        <p class="product-single-price">{{cartItem.price}} &#8381 ???? ????.</p>
                    </div>
                </div>
                <div class="right-block">
                    <p class="product-price">??????????: {{cartItem.quantity*cartItem.price}} &#8381.</p>
                    <button class="del-btn" @click="$emit('remove', cartItem)">&times;</button>
                </div>
            </div>`
} )