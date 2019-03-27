const express = require('express');
const server = express();
const knex = require('knex');
const knexConfig = require('./knexfile');
const db = knex(knexConfig.development);
server.use(express.json());

server.post('/api/cohorts', (req, res) => {
  const cohort = req.body;
  if (!cohort) {
    res.status(404).json({error: 'Yo, here is an error.'})
  }
  db.insert(cohort)
    .into('cohorts')
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.get('/api/cohorts/:id', (req, res) => {
  const { id } = req.params;
  db('cohorts')
  .where({ id })
    .then(cohort => {
      res.status(200).json(cohort);
    })
    .catch(err => {
      res.status(500).json(err);
    });
})

server.get('/api/cohorts/:id/students', (req, res) => {
  const { id } = req.params;
  db('students')
  .where({ cohort_id: id })
    .then(students => {
      res.status(200).json(students);
    })
    .catch(err => {
      res.status(500).json(err);
    });
})

server.get('/api/cohorts', (req, res) => {
  db('cohorts')
    .then(cohorts => {
      res.status(200).json(cohorts);
    })
    .catch(err => {
      res.status(500).json(err);
    });
})

server.delete('/api/cohorts/:id', (req, res) => {
  const { id } = req.params;

  db('cohorts')
    .where({ id }) // or .where(id, '=', id)
    .del()
    .then(count => {
      // count === number of records deleted
      res.status(200).json(count);
    })
    .catch(err => {
      res.status(500).json(err);
    });
})

server.put('/api/cohorts/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  db('cohorts')
    .where({ id })
    .update({name: name})
    .then(changed => {
      res.status(200).json(changed);
    })
    .catch(err => {
      res.status(500).json(err);
    });
})

server.listen(5555, () => console.log('Running on port 5555'));