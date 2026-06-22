exports.searchFoods = async (req, res, next) => {
  try {
    const query = req.query.q || '';
    const endpoint = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
    
    const response = await fetch(endpoint);
    const data = await response.json();
    
    res.status(200).json({
      status: 'success',
      data: data.meals || []
    });
  } catch (error) {
    next(error);
  }
};

exports.getFoodById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const endpoint = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    
    const response = await fetch(endpoint);
    const data = await response.json();
    
    if (!data.meals) {
      return res.status(404).json({ status: 'fail', message: 'Food not found' });
    }
    
    res.status(200).json({
      status: 'success',
      data: data.meals[0]
    });
  } catch (error) {
    next(error);
  }
};
