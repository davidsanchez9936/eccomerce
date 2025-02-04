const User = require("../models/user.js")
const Product = require("../models/product.js")
const Cart = require("../models/cart.js")
const Coupon = require("../models/coupon.js")
const Order = require("../models/order.js")
const uniqueid = require("uniqueid")

exports.userCart = async (req, res) => {
    try {
        const {
            cart
        } = req.body;
        let products = [];

        const user = await User.findOne({
            email: req.user.email
        });
        if (!user) {
            return res.status(404).json({
                error: "Usuario no encontrado"
            });
        }

        let cartExistByThisUser = await Cart.findOne({
            orderdBy: user._id
        });
        if (cartExistByThisUser) {
            await cartExistByThisUser.deleteOne();
            console.log("Carrito anterior eliminado");
        }

        for (let i = 0; i < cart.length; i++) {
            let productFromDb = await Product.findById(cart[i]._id).select("price");

            if (!productFromDb) {
                console.log(`Producto no encontrado: ${cart[i]._id}`);
                continue; // Saltar este producto si no se encuentra
            }

            let object = {
                product: cart[i]._id,
                count: cart[i].count,
                color: cart[i].color,
                price: productFromDb.price
            };

            products.push(object);
        }

        let cartTotal = products.reduce((total, product) =>
            total + (product.price * product.count), 0);

        let newCart = await Cart.create({
            products,
            cartTotal,
            orderdBy: user._id
        });

        console.log("Nuevo carrito --> ", newCart);
        res.json({
            ok: true,
            cart: newCart
        });

    } catch (error) {
        console.error("Error al crear el carrito:", error);
        res.status(500).json({
            error: "No se pudo crear el carrito",
            details: error.message
        });
    }
};

exports.getUserCart = async (req, res) => {
    const user = await User.findOne({
        email: req.user.email
    });

    let cart = await Cart.findOne({
        orderdBy: user._id
    }).populate("products.product", "_id color title price totalAfterDiscount");

    if (!cart) {
        return res.json({
            products: [],
            cartTotal: 0,
            totalAfterDiscount: 0
        });
    }

    const {
        products,
        cartTotal,
        totalAfterDiscount
    } = cart;

    res.json({
        products,
        cartTotal,
        totalAfterDiscount
    });
};

exports.emptyCart = async (req, res) => {
    const user = await User.findOne({
        email: req.user.email
    })

    const cart = await Cart.findOneAndDelete({
        orderdBy: user._id
    })

    res.json(cart)
}

exports.saveAddress = async (req, res) => {
    const userAddress = await User.findOneAndUpdate({
        email: req.user.email
    }, {
        address: req.body.address
    })

    res.json({
        ok: true,
        userAddress,
    });

}

exports.applyCouponToUserCart = async (req, res) => {
    try {
        const {
            coupon
        } = req.body;
        console.log("COUPON", coupon);

        // Find valid coupon and handle if not found
        const validCoupon = await Coupon.findOne({
            name: coupon,
            expiry: {
                $gt: new Date()
            }
        });

        if (!validCoupon) {
            return res.json({
                err: "Invalid coupon or coupon has expired"
            });
        }

        console.log("VALID COUPON", validCoupon);

        // Find the user
        const user = await User.findOne({
            email: req.user.email
        });

        // Get user cart
        const cart = await Cart.findOne({
            orderdBy: user._id
        }).populate("products.product", "_id title price");

        if (!cart) {
            return res.json({
                err: "No cart found"
            });
        }

        const {
            cartTotal
        } = cart;
        console.log("cartTotal", cartTotal, "discount", validCoupon.discount);

        // Calculate total after discount
        const totalAfterDiscount = (
            cartTotal -
            (cartTotal * validCoupon.discount) / 100
        ).toFixed(2);

        // Update cart with new total
        await Cart.findOneAndUpdate({
            orderdBy: user._id
        }, {
            totalAfterDiscount
        }, {
            new: true
        });

        res.json(totalAfterDiscount);
    } catch (error) {
        console.error("Error applying coupon:", error);
        res.status(500).json({
            err: "Error applying coupon"
        });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const {
            paymentIntent
        } = req.body.stripeResponse;

        const user = await User.findOne({
            email: req.user.email
        });

        let {
            products
        } = await Cart.findOne({
            orderdBy: user._id
        });

        // Verificar si todos los productos existen antes de crear la orden
        const validProducts = await Promise.all(
            products.map(async (item) => {
                const product = await Product.findById(item.product._id);
                return product ? item : null;
            })
        );

        // Filtrar productos válidos
        const filteredProducts = validProducts.filter(product => product !== null);

        // Si no hay productos válidos, devolver un error
        if (filteredProducts.length === 0) {
            return res.status(400).json({
                ok: false,
                message: "No valid products found in the cart"
            });
        }

        let newOrder = await new Order({
            products: filteredProducts,
            paymentIntent,
            orderdBy: user._id
        }).save();

        // decrement quantity, increment sold
        let bulkOption = filteredProducts.map((item) => {
            return {
                updateOne: {
                    filter: {
                        _id: item.product._id
                    },
                    update: {
                        $inc: {
                            quantity: -item.count,
                            sold: +item.count
                        }
                    },
                },
            }
        });

        let updated = await Product.bulkWrite(bulkOption, {});
        console.log("PRODUCT QUANTITY DECREMENTED AND SOLD++", updated);
        console.log("NEW ORDER SAVED", newOrder);

        res.json({
            ok: true,
            order: newOrder
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            ok: false,
            message: "Error creating order",
            error: error.message
        });
    }
};

exports.orders = async (req, res) => {
    try {
        let user = await User.findOne({
            email: req.user.email
        });

        let userOrders = await Order.find({
            orderdBy: user._id
        }).populate({
            path: "products.product",
            match: {
                _id: {
                    $exists: true
                }
            } // Solo poblar productos existentes
        });

        // Filtrar órdenes con al menos un producto válido
        userOrders = userOrders.filter(order =>
            order.products.some(product => product.product !== null)
        );

        res.json(userOrders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({
            error: "Failed to fetch orders",
            message: error.message
        });
    }
};

// addToWishlist wishlist removeFromWishlist

exports.addToWishList = async (req, res) => {
    const {
        productId
    } = req.body
    console.log(productId)
    const user = await User.findOneAndUpdate({
        email: req.user.email
    }, {
        $addToSet: {
            wishlist: productId
        }
    })
    res.json({
        ok: true
    })
}

exports.wishlist = async (req, res) => {
    const list = await User.findOne({
        email: req.user.email
    }).select("wishlist").populate("wishlist")

    res.json({
        list
    })
}

/* exports.wishlist = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email })
            .select("wishlist")
            .populate("wishlist");

        res.json({
            wishlist: user.wishlist || []
        });
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        res.status(500).json({ error: "Failed to fetch wishlist" });
    }
}; */

exports.removeFromWishlist = async (req, res) => {
    const {
        productId
    } = req.params;

    const user = await User.findOneAndUpdate({
        email: req.user.email
    }, {
        $pull: {
            wishlist: productId
        }
    })

    res.json({
        ok: true,

    })
}

exports.createCashOrder = async (req, res) => {
    try {
        const {
            COD,
            couponApplied
        } = req.body;

        if (!COD) {
            return res.status(400).send("Create cash order failed");
        }

        const user = await User.findOne({
            email: req.user.email
        });
        let userCart = await Cart.findOne({
            orderdBy: user._id
        });

        if (!userCart || !userCart.products) {
            return res.status(400).json({
                ok: false,
                message: "No cart found"
            });
        }
        console.log(userCart)
        let finalAmount = 0

        if (couponApplied && userCart.totalAfterDiscount) {
            finalAmount = userCart.totalAfterDiscount * 100
        } else {
            finalAmount = userCart.cartTotal * 100
        }

        // Verificar productos existentes
        const validProducts = await Promise.all(
            userCart.products.map(async (item) => {
                const product = await Product.findById(item.product);
                return product ? item : null;
            })
        );

        const filteredProducts = validProducts.filter(p => p !== null);

        if (filteredProducts.length === 0) {
            return res.status(400).json({
                ok: false,
                message: "No valid products found in cart"
            });
        }



        let newOrder = await new Order({
            products: filteredProducts,
            paymentIntent: {
                id: uniqueid(),
                amount: finalAmount,
                currency: "usd",
                status: "Cash On Delivery",
                created: Date.now(),
                payment_method_types: ["cash"]
            },
            orderdBy: user._id,
            orderStatus: "Cash On Delivery"
        }).save();

        // Actualizar inventario
        let bulkOption = filteredProducts.map((item) => ({
            updateOne: {
                filter: {
                    _id: item.product
                },
                update: {
                    $inc: {
                        quantity: -item.count,
                        sold: +item.count
                    }
                },
            },
        }));

        await Product.bulkWrite(bulkOption, {});

        res.json({
            ok: true,
            order: newOrder
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            ok: false,
            message: "Error creating order",
            error: error.message
        });
    }
};