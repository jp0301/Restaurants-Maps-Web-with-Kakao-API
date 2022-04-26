exports.selectRestaurants = async function (connection, category) {
  const selectAllRestaurantsQuery = `SELECT title, address, category, image_url, url FROM restaurants where category = '${category}';`;
  const selectCategorizedRestaurantsQuery = `SELECT title, address, category, image_url, url FROM restaurants where category = '${category}' and category = ?;`;

  const Params = [category];

  const Query = category
    ? selectCategorizedRestaurantsQuery
    : selectAllRestaurantsQuery;

  const rows = await connection.query(Query, Params);

  return rows;
};