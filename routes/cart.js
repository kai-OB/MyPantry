const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');

// Get all
router.get('/', async (req, res) => {
	console.log('in get all');
	try {
		const cart = await Cart.find();
		res.json(cart);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});


// Get one
router.get('/:id', getCart, (req, res) => {
	console.log('in get one');
	res.send(res.cart);
});

// Create one
router.post('/', async (req, res) => {
	console.log('in create one');
	const cart = new Cart({
		name: req.body.name,
		address: req.body.address,
		inventory: req.body.inventory,
        pickupTime: req.body.pickupTime, 
        phone: req.body.phone, 
	});
	try {
		const newPantry = await cart.save();
		res.status(201).json(newPantry);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

// // Update One
// router.patch('/:id', getPantry, async (req, res) => {
// 	console.log('in update one');
// 	if (req.body.name != null) {
// 		res.pantry.name = req.body.name;
// 	}
// 	if (req.body.address != null) {
// 		res.pantry.address = req.body.address;
// 	}
// 	if (req.body.inventory != null) {
// 		res.pantry.inventory = req.body.inventory;
// 	}
// 	try {
// 		const updatedInventory = await res.pantry.save();
// 		res.json(updatedInventory);
// 	} catch (err) {
// 		res.status(400).json({ message: err.message });
// 	}
// });

// Update one item in inventory
function updateOneItem(cart, item) {
	const { itemID, name, quantity } = item;
	let itemIndex = cart.inventory.findIndex((p) => p.itemID == itemID);
	if (itemIndex > -1) {
		//item exists in the inventory, update the quantity
		let newItem = cart.inventory[itemIndex];
		newItem.quantity = quantity;
		cart.inventory[itemIndex] = newItem;
	} else {
		//item does not exists in inventory, add new item
		cart.inventory.push({ itemID, name, quantity });
	}
}

// Update One
router.patch('/:id', getCart, async (req, res) => {
	console.log('in update one');
	// console.log(typeof res);
	if (req.body.name != null) {
		res.cart.name = req.body.name;
	}
	if (req.body.address != null) {
		res.cart.address = req.body.address;
	}
	if (req.body.inventory != null) {
		req.body.inventory.forEach((item) => {
			console.log(item);
			updateOneItem(res.cart, item);
		});
	}
    if (req.body.pickupTime != null) {
		res.cart.pickupTime = req.body.pickupTime;
	}
    if (req.body.phone != null) {
		res.cart.phone = req.body.phone;
	}
	try {
		const updatedInventory = await res.cart.save();
		res.json(updatedInventory);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

// Delete One
router.delete('/:id', getCart, async (req, res) => {
	console.log('in delete one');
	try { 
		await res.cart.remove();
		res.json({ message: 'Deleted Pantry: ' + req.id });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// middleware to get the cart (all functions with /:id as param)
async function getCart(req, res, next) {
	let cart;
	try {
		cart = await Pantry.findById(req.params.id);
		if (cart == null) {
			return res.status(404).json({ message: 'Cannot find cart.' });
		}
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}

	res.cart = cart;
	// successfully completed getPantry, continue on the rest of software
	next();
}

module.exports = router;