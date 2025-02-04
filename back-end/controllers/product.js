const Product = require("../models/product.js")
const slugify = require("slugify")
const User = require("../models/user.js")

exports.create = async (req, res) => {
    try {
        console.log(req.body)
        req.body.slug = slugify(req.body.title)
        const newProduct = await new Product(req.body).save()
        res.json(newProduct)
    } catch (err) {
        console.log(err)
        /* res.status(400).send("Create product failed") */
        res.status(400).json({
            err: err.message
        })
    }
}

/* exports.read = async (req, res) => {
    let products = await Product.find({})
    res.json(products)
}; */

exports.listAll = async (req, res) => {
    let products = await Product.find({})
        .limit(parseInt(req.params.count))
        .populate("category")
        .populate("subs")
        .sort([
            ["createAt", "desc"]
        ])
        .then()
        .catch()
    res.json(products)
};

exports.remove = async (req, res) => {
    try {
        const deleted = await Product.findOneAndDelete({
            slug: req.params.slug
        });
        res.json(deleted);
    } catch (err) {
        console.log(err);
        return res.status(400).send("Product delete failed");
    }
};

exports.read = async (req, res) => {
    const product = await Product.findOne({
        slug: req.params.slug
    }).populate("category").populate("subs");
    res.json(product)
}

exports.update = async (req, res) => {
    if (req.body.title) {
        req.body.slug = slugify(req.body.title);
    }
    Product.findOneAndUpdate({
            slug: req.params.slug
        }, req.body, {
            new: true
        })
        .then(async updated => {
            await res.json(updated);
        })
        .catch(err => {
            console.log("PRODUCT UPDATE ERROR --->", err);
            /* return res.status(400).send("Product update failed"); */
            res.status(400).json({
                err: err.message
            })
        });
};
//WITHOUT PAGINATION
/* exports.list = async (req, res) => {
    //createAt
    try {
        const {
            sort,
            order,
            limit
        } = req.body
        const products = await Product.find({})
            .populate("category")
            .sort([
                [sort, order]
            ])
            .limit([limit])
        res.json(products)
    } catch (err) {
        console.log(err)
    }
} */
//WITH PAGINATION
exports.list = async (req, res) => {
    //createAt
    try {
        const {
            sort,
            order,
            page
        } = req.body

        const currentPage = page || 1
        const perPage = 3

        const products = await Product.find({})
            .skip((currentPage - 1) * perPage)
            .populate("category")
            .populate("subs")
            .sort([
                [sort, order]
            ])
            .limit(perPage)
        res.json(products)
    } catch (err) {
        console.log(err)
    }
}

exports.productsCount = async (req, res) => {
    let total = await Product.find({}).estimatedDocumentCount()
    res.json(total)
}



exports.productStar = async (req, res) => {
    const product = await Product.findById(req.params.productId).exec()
    const user = await User.findOne({
        email: req.user.email
    }).exec()
    const {
        star
    } = req.body
    //who is updating?
    //check uf curretly logged in user have already added rating to this product?
    let existingRatingObject = product.ratings.find((ele) => (ele.postedBy.toString() === user._id.toString()))

    // if user haven't left rating yet, push it
    if (existingRatingObject === undefined) {
        let ratingAdded = await Product.findByIdAndUpdate(product._id, {
            $push: {
                ratings: {
                    star: star,
                    postedBy: user._id
                }
            }
        }, {
            new: true
        })
        console.log("ratingAdded", ratingAdded)
        res.json(ratingAdded)
    } else {
        // if user have left rating, update it 
        const ratingUpdated = await Product.updateOne({
            ratings: {
                $elemMatch: existingRatingObject
            },

        }, {
            $set: {
                "ratings.$.star": star
            }
        }, {
            new: true
        }).exec()
        console.log("ratingUpdated", ratingUpdated)
        res.json(ratingUpdated);
    }

}

exports.listRelated = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        const related = await Product.find({
                _id: {
                    $ne: product._id
                },
                category: product.category,
            })
            .limit(3)
            .populate("category")
            .populate("subs");

        res.json(related);
    } catch (err) {
        res.status(400).json({
            err: err.message
        });
    }
};

//SEARCH / FILTER
/* const handleQuery = async (req, res, query) => {
    const products = await Product.find({
            $text: {
                $search: query
            }
        })
        .populate('category', '_id name')
        .populate('subs', '_id name');
    res.json(products);

};

exports.searchFilters = async (req, res) => {
    const {
        query
    } = req.body

    if (query) {
        console.log("query", query)
        await handleQuery(req, res, query)
    }
} */

const handleQuery = async (req, res, query) => {
    try {
        const products = await Product.find({
                title: {
                    $regex: query,
                    $options: 'i'
                }
            })
            .populate("category", "_id name")
            .populate("subs", "_id name");

        res.json(products);
    } catch (err) {
        console.log(err);
        res.status(400).json({
            err: err.message,
        });
    }
};

const handlePrice = async (req, res, price) => {
    try {
        let products = await Product.find({
                price: {
                    $gte: price[0],
                    $lte: price[1],
                }
            })
            .populate("category", "_id name")
            .populate("subs", "_id name");
        res.json(products)
    } catch (err) {
        console.log(err);
        res.status(400).json({
            err: err.message,
        });
    }
}

const handleCategory = async (req, res, categories) => {
    try {
        let products = await Product.find({
                category: {
                    $in: categories
                }
            })
            .populate("category", "_id name")
            .populate("subs", "_id name");
        res.json(products);
    } catch (err) {
        console.log(err);
        res.status(400).json({
            err: err.message,
        });
    }
};
//3.33 floor 3
const handleStar = async (req, res, stars) => {
    Product.aggregate([{
                $project: {
                    document: "$$ROOT",
                    floorAverage: {
                        $floor: {
                            $avg: "$ratings.star"
                        }
                    }
                }
            },
            {
                $match: {
                    floorAverage: stars
                }
            }
        ])
        .limit(12)
        .then(aggregates => {
            Product.find({
                    _id: aggregates
                })
                .populate("category", "_id name")
                .populate("subs", "_id name")
                .then(products => {
                    res.json(products);
                })
                .catch(err => {
                    console.log("PRODUCT AGGREGATE ERROR", err);
                    res.status(400).json({
                        err: err.message
                    });
                });
        })
        .catch(err => {
            console.log("AGGREGATE ERROR", err);
            res.status(400).json({
                err: err.message
            });
        });
};

const handleSub = async (req, res, sub) => {
    const products = await Product.find({
            subs: sub
        }).populate("category", "_id name")
        .populate("subs", "_id name")

    res.json(products)
}

const handleShipping = async (req, res, shipping) => {
    const products = await Product.find({
            shipping
        }).populate("category", "_id name")
        .populate("subs", "_id name")

    res.json(products)
}

const handleColor = async (req, res, color) => {
    const products = await Product.find({
            color
        }).populate("category", "_id name")
        .populate("subs", "_id name")

    res.json(products)
}

const handleBrand = async (req, res, brand) => {
    const products = await Product.find({
            brand
        }).populate("category", "_id name")
        .populate("subs", "_id name")

    res.json(products)
}

exports.searchFilters = async (req, res) => {
    const {
        query,
        price,
        category,
        stars,
        sub,
        shipping,
        color,
        brand
    } = req.body;

    try {
        let products;

        if (query && price && Array.isArray(category) && category.length > 0) {
            // Buscar productos que coincidan con el texto, estén dentro del rango de precio y pertenezcan a las categorías seleccionadas
            products = await Product.find({
                    title: {
                        $regex: query,
                        $options: 'i'
                    },
                    price: {
                        $gte: price[0],
                        $lte: price[1]
                    },
                    category: {
                        $in: category
                    },
                })
                .populate("category", "_id name")
                .populate("subs", "_id name");
        } else if (query && Array.isArray(category) && category.length > 0) {
            // Buscar productos que coincidan con el texto y pertenezcan a las categorías seleccionadas
            products = await Product.find({
                    title: {
                        $regex: query,
                        $options: 'i'
                    },
                    category: {
                        $in: category
                    },
                })
                .populate("category", "_id name")
                .populate("subs", "_id name");
        } else if (price !== undefined && Array.isArray(category) && category.length > 0) {
            // Filtrar productos dentro del rango de precio y pertenezcan a las categorías seleccionadas
            products = await Product.find({
                    price: {
                        $gte: price[0],
                        $lte: price[1]
                    },
                    category: {
                        $in: category
                    },
                })
                .populate("category", "_id name")
                .populate("subs", "_id name");
        } else if (query) {
            // Buscar productos que coincidan con el texto
            products = await handleQuery(req, res, query);
            return
        } else if (price !== undefined) {
            // Filtrar productos dentro del rango de precio
            products = await handlePrice(req, res, price);
            return
        } else if (Array.isArray(category) && category.length > 0) {
            // Filtrar productos por categorías seleccionadas
            products = await handleCategory(req, res, category);
            return
        } else if (stars) {
            console.log("star --->", stars);
            await handleStar(req, res, stars)
            return
        } else if (sub) {
            console.log("star --->", sub);
            await handleSub(req, res, sub)
            return
        } else if (shipping) {
            console.log("sub --->", shipping);
            await handleShipping(req, res, shipping)
            return
        } else if (color) {
            console.log("sub --->", color);
            await handleColor(req, res, color)
            return
        } else if (brand) {
            console.log("sub --->", brand);
            await handleBrand(req, res, brand)
            return
        } else {
            // Obtener todos los productos si no se proporciona ningún filtro
            products = await Product.find({})
                .populate("category", "_id name")
                .populate("subs", "_id name");
        }

        res.json(products);
    } catch (err) {
        console.log(err);
        res.status(400).json({
            err: err.message,
        });
    }
};