const con = require('../../config/dbconfig');
const { queryAction } = require('../../helpers/queryAction');

const actorDao = {
  table: 'actor',

  //Find an actor and all their movies
  findActorMovies(res, table, id) {
    const movies = [];
    const movieSql = `
      SELECT * 
      FROM movie m
      JOIN movie_to_${table} USING (movie_id)
      JOIN ${table} USING (${table}_id)
      WHERE ${table}_id = ${id};
    `;

    //First query: get the movies
    con.execute(movieSql, (movieErr, movieRows) => {
      if (movieErr) {
        console.error('Movie query error:', movieErr);
        return res.json({ message: 'error', error: movieErr });
      }

      movieRows.forEach(row => movies.push(row));

      //Second query: get the actor info
      const actorSql = `
        SELECT first_name AS first, last_name AS last
        FROM ${table}
        WHERE ${table}_id = ${id};
      `;

      con.execute(actorSql, (actorErr, actorRows) => {
        if (actorErr) {
          console.error('Actor query error:', actorErr);
          return res.json({ message: 'error', error: actorErr });
        }

        if (actorRows.length === 0) {
          return res.json({ message: 'Actor not found' });
        }

        //Add movies to actor object and respond
        const actor = actorRows[0];
        actor.movies = movies;
        res.json(actor);
      });
    });
  },

  //Search for actors by name
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

    //Run the query
    con.execute(sql, (error, rows) => {
      if (error) {
        console.error('Search query error:', error);
        return res.json({ message: 'error', error });
      }

      if (!rows.length) {
        return res.send('<h1>N/A</h1>');
      }

      //Send results using helper
      queryAction(res, null, rows, table);
    });
  }
};

module.exports = actorDao;