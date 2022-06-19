'use strict';

require( 'dotenv' ).config();

/**
 * Order.js controller
 *
 * @description: A set of functions called "actions" for managing `Order`.
 */
// note that this needs to be a "private" key from STRIPE
const stripe = require('stripe')(
  process.env.STRIPE_SECRET_KEY
);
module.exports = {
  /**
   * Create a/an order record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    const { address, amount, dishes, token, city, state, user } = JSON.parse(
      ctx.request.body
    );
    const stripeAmount = Math.floor(amount * 100);
    // charge on stripe
    const charge = await stripe.charges.create({
      // Transform cents to dollars.
      amount: stripeAmount,
      currency: 'usd',
      description: `Order ${new Date()} by ${ctx.state.user._id} (user)`,
      source: token,
    });

    // Register the order in the database
    const order = await strapi.services.order.create({
      user: user,
      charge_id: charge.id,
      amount: stripeAmount,
      address,
      dishes,
      city,
      state,
    });

    return order;
  },
};
