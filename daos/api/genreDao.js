const con = require('../../config/dbconfig');
const { queryAction } = require('../../helpers/queryAction');

const genreDao = {
  table: 'genre',

  //Find movies by genre
  findMoviesByGenre(req, res, table) {
    const genre = req.query?.genre || null;
    let sql = '';

    if (genre) {
      sql = `
        SELECT movie.*, g.genre
        FROM movie
        JOIN movie_to_genre USING (movie_id)
        JOIN genre g USING (genre_id)
        WHERE g.genre = '${genre}';
      `;
    } else {
      sql = 'SELECT * FROM movie;';
    }

    console.log('Executing SQL:', sql);

    con.execute(sql, (error, rows) => {
      if (error) {
        console.error('findMoviesByGenre error:', error);
        return res.json({ message: 'Database error', error });
      }

      if (!rows.length) {
        return res.send('<h1>N/A</h1>');
      }

      //Use helper to send formatted response
      queryAction(res, null, rows, table);
    });
  }
};

module.exports = genreDao;