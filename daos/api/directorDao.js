const con = require('../../config/dbconfig');
const { queryAction } = require('../../helpers/queryAction');

const directorDao = {
  table: 'director',

  //Search for directors by first or last name
  search(req, res, table) {
    const firstName = req.query.first_name || null;
    const lastName = req.query.last_name || null;

    let sql = `SELECT * FROM ${table}`;
    if (firstName || lastName) {
      const conditions = [];
      if (firstName) conditions.push(`first_name LIKE '%${firstName}%'`);
      if (lastName) conditions.push(`last_name LIKE '%${lastName}%'`);
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }
    sql += ';';

    // Run the query
    con.execute(sql, (error, rows) => {
      if (error) {
        console.error('Search query error:', error);
        return res.json({ message: 'error', error });
      }

      if (!rows.length) {
        return res.send('<h1>No data to send</h1>');
      }

      // Use helper to send formatted response
      queryAction(res, null, rows, table);
    });
  },

  //Find a director and all their movies
  findDirectorMovies(res, table, id) {
    const movies = [];

    const movieSql = `
      SELECT * 
      FROM movie m
      JOIN movie_to_${table} USING (movie_id)
      JOIN ${table} USING (${table}_id)
      WHERE ${table}_id = ${id};
    `;

    //Get all movies for the director
    con.execute(movieSql, (movieErr, movieRows) => {
      if (movieErr) {
        console.error('Movie query error:', movieErr);
        return res.json({ message: 'error', error: movieErr });
      }

      movieRows.forEach(row => movies.push(row));

      //Get director's name
      const directorSql = `
        SELECT first_name AS first, last_name AS last
        FROM ${table}
        WHERE ${table}_id = ${id};
      `;

      con.execute(directorSql, (dirErr, directorRows) => {
        if (dirErr) {
          console.error('Director query error:', dirErr);
          return res.json({ message: 'error', error: dirErr });
        }

        if (directorRows.length === 0) {
          return res.json({ message: 'N/A' });
        }

        //Combine data and respond
        const director = directorRows[0];
        director.movies = movies;
        res.json(director);
      });
    });
  }
};

module.exports = directorDao;